// backend/controllers/orderController.js
const pool = require('../config/db');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
  }
};

// Lấy chi tiết đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Lấy thông tin đơn hàng
    const [orders] = await pool.query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    
    const order = orders[0];
    
    // Lấy chi tiết sản phẩm trong đơn hàng
    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.image, p.price as original_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    // Thêm chi tiết sản phẩm vào đơn hàng
    order.items = items;
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết đơn hàng' });
  }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { 
      user_id, 
      items, 
      total_amount, 
      shipping_address, 
      shipping_method,
      payment_method,
      customer_name,
      customer_email,
      customer_phone
    } = req.body;
    
    if (!items || items.length === 0 || !total_amount || !shipping_address || !payment_method) {
      return res.status(400).json({ message: 'Thông tin đơn hàng không đầy đủ' });
    }
    
    // Bắt đầu transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Tạo đơn hàng
      const [orderResult] = await connection.query(`
        INSERT INTO orders (
          user_id, total_amount, shipping_address, shipping_method, payment_method,
          customer_name, customer_email, customer_phone, status, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
      `, [
        user_id || null, 
        total_amount, 
        shipping_address, 
        shipping_method, 
        payment_method,
        customer_name,
        customer_email,
        customer_phone
      ]);
      
      const orderId = orderResult.insertId;
      
      // Thêm chi tiết sản phẩm vào đơn hàng
      for (const item of items) {
        // Kiểm tra số lượng tồn kho
        const [stockResult] = await connection.query(
          'SELECT stock FROM products WHERE id = ?', 
          [item.product_id]
        );
        
        if (stockResult.length === 0) {
          throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
        }
        
        const currentStock = stockResult[0].stock;
        
        if (currentStock < item.quantity) {
          throw new Error(`Sản phẩm với ID ${item.product_id} không đủ số lượng trong kho`);
        }
        
        // Thêm chi tiết đơn hàng
        await connection.query(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `, [orderId, item.product_id, item.quantity, item.price]);
        
        // Cập nhật số lượng tồn kho
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      // Commit transaction
      await connection.commit();
      
      // Lấy thông tin đơn hàng vừa tạo
      const [newOrder] = await pool.query(`
        SELECT * FROM orders WHERE id = ?
      `, [orderId]);
      
      // Lấy chi tiết sản phẩm trong đơn hàng
      const [orderItems] = await pool.query(`
        SELECT oi.*, p.name, p.image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId]);
      
      // Thêm chi tiết sản phẩm vào đơn hàng
      newOrder[0].items = orderItems;
      
      res.status(201).json(newOrder[0]);
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: `Lỗi khi tạo đơn hàng: ${error.message}` });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không được để trống' });
    }
    
    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ' });
    }
    
    const [result] = await pool.query(`
      UPDATE orders
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    
    // Nếu đơn hàng bị hủy, hoàn lại số lượng sản phẩm vào kho
    if (status === 'cancelled') {
      // Lấy các sản phẩm trong đơn hàng
      const [orderItems] = await pool.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );
      
      // Cập nhật số lượng tồn kho
      for (const item of orderItems) {
        await pool.query(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }
    
    // Lấy thông tin đơn hàng sau khi cập nhật
    const [updatedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    
    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đơn hàng' });
  }
};

// Lấy đơn hàng của một người dùng
exports.getUserOrders = async (req, res) => {
    try {
      const { userId } = req.params;
      
      const [orders] = await pool.query(`
        SELECT * FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [userId]);
      
      // Lấy chi tiết sản phẩm cho mỗi đơn hàng
      for (const order of orders) {
        const [items] = await pool.query(`
          SELECT oi.*, p.name, p.image
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id]);
        
        order.items = items;
      }
      
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Lỗi khi lấy đơn hàng của người dùng' });
    }
  };
  
  // Lấy thống kê đơn hàng
  exports.getOrderStats = async (req, res) => {
    try {
      // Tổng doanh thu
      const [totalRevenue] = await pool.query(`
        SELECT SUM(total_amount) as revenue
        FROM orders
        WHERE status != 'cancelled'
      `);
      
      // Tổng số đơn hàng
      const [totalOrders] = await pool.query(`
        SELECT COUNT(*) as count
        FROM orders
      `);
      
      // Đơn hàng theo trạng thái
      const [ordersByStatus] = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status
      `);
      
      // Doanh thu theo tháng (6 tháng gần nhất)
      const [revenueByMonth] = await pool.query(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          SUM(total_amount) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE status != 'cancelled' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month
      `);
      
      // Sản phẩm bán chạy nhất
      const [topProducts] = await pool.query(`
        SELECT 
          p.id, p.name, p.image, p.price,
          SUM(oi.quantity) as total_sold,
          SUM(oi.quantity * oi.price) as total_revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelled'
        GROUP BY p.id
        ORDER BY total_sold DESC
        LIMIT 5
      `);
      
      res.status(200).json({
        revenue: totalRevenue[0].revenue || 0,
        orderCount: totalOrders[0].count,
        ordersByStatus,
        revenueByMonth,
        topProducts
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      res.status(500).json({ message: 'Lỗi khi lấy thống kê đơn hàng' });
    }
  };
  
  // Lấy danh sách khách hàng
  exports.getCustomers = async (req, res) => {
    try {
      const [customers] = await pool.query(`
        SELECT 
          u.id, u.name, u.email, u.phone, u.created_at,
          COUNT(DISTINCT o.id) as order_count,
          SUM(CASE WHEN o.status != 'cancelled' THEN o.total_amount ELSE 0 END) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        ORDER BY total_spent DESC
      `);
      
      res.status(200).json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng' });
    }
  };