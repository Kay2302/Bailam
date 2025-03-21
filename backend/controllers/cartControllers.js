// backend/controllers/cartController.js
const pool = require('../config/db');

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  try {
    // Lấy user_id từ token đã được xác thực bởi middleware
    const userId = req.user.id;
    
    // Lấy giỏ hàng từ database
    const [cartItems] = await pool.query(`
      SELECT c.*, p.name, p.image, p.price, p.discount_price, p.stock 
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);
    
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc số lượng' });
    }
    
    // Kiểm tra sản phẩm tồn tại
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    // Kiểm tra số lượng trong kho
    if (product[0].stock < quantity) {
      return res.status(400).json({ message: 'Số lượng sản phẩm trong kho không đủ' });
    }
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const [existingItem] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (existingItem.length > 0) {
      // Cập nhật số lượng nếu đã tồn tại
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      // Thêm mới nếu chưa tồn tại
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }
    
    // Lấy giỏ hàng mới cập nhật
    const [updatedCart] = await pool.query(`
      SELECT c.*, p.name, p.image, p.price, p.discount_price, p.stock 
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);
    
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng' });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc số lượng' });
    }
    
    // Kiểm tra sản phẩm tồn tại
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    // Kiểm tra số lượng trong kho
    if (product[0].stock < quantity) {
      return res.status(400).json({ message: 'Số lượng sản phẩm trong kho không đủ' });
    }
    
    // Cập nhật số lượng
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    
    res.status(200).json({ message: 'Cập nhật giỏ hàng thành công' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng' });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    
    res.status(200).json({ message: 'Xóa giỏ hàng thành công' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng' });
  }
};