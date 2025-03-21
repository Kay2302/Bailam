// backend/controllers/productController.js
const pool = require('../config/db');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*, 
        COALESCE(AVG(r.rating), 0) AS averageRating,
        COUNT(DISTINCT r.id) AS reviewCount,
        c.name AS categoryName
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu sản phẩm' });
  }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [product] = await pool.query(`
      SELECT 
        p.*, 
        COALESCE(AVG(r.rating), 0) AS averageRating,
        COUNT(DISTINCT r.id) AS reviewCount,
        c.name AS categoryName
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    res.status(200).json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết sản phẩm' });
  }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, description, details, image, price, discount_price, stock, status } = req.body;
    
    if (!name || !category_id || !description || !image || !price || stock === undefined) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    const [result] = await pool.query(`
      INSERT INTO products (name, category_id, description, details, image, price, discount_price, stock, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [name, category_id, description, details, image, price, discount_price, stock, status || 'active']);
    
    const newProductId = result.insertId;
    
    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [newProductId]);
    
    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm mới' });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description, details, image, price, discount_price, stock, status } = req.body;
    
    if (!name || !category_id || !description || !image || !price || stock === undefined) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    const [result] = await pool.query(`
      UPDATE products
      SET name = ?, category_id = ?, description = ?, details = ?, image = ?, 
          price = ?, discount_price = ?, stock = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, category_id, description, details, image, price, discount_price, stock, status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    const [updatedProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    
    res.status(200).json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm' });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Xóa các đánh giá liên quan
    await pool.query('DELETE FROM reviews WHERE product_id = ?', [id]);
    
    // Xóa sản phẩm
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    res.status(200).json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
  }
};

// Lấy các sản phẩm liên quan
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Lấy danh mục của sản phẩm
    const [product] = await pool.query('SELECT category_id FROM products WHERE id = ?', [id]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    const categoryId = product[0].category_id;
    
    // Lấy các sản phẩm cùng danh mục, trừ sản phẩm hiện tại
    const [relatedProducts] = await pool.query(`
      SELECT p.*, c.name as categoryName
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT 4
    `, [categoryId, id]);
    
    // Nếu không đủ 4 sản phẩm, lấy thêm sản phẩm khác
    if (relatedProducts.length < 4) {
      const [additionalProducts] = await pool.query(`
        SELECT p.*, c.name as categoryName
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.category_id != ? AND p.id != ? AND p.status = 'active'
        ORDER BY p.created_at DESC
        LIMIT ?
      `, [categoryId, id, 4 - relatedProducts.length]);
      
      relatedProducts.push(...additionalProducts);
    }
    
    res.status(200).json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm liên quan' });
  }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        COALESCE(AVG(r.rating), 0) AS averageRating,
        COUNT(DISTINCT r.id) AS reviewCount,
        c.name AS categoryName
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.status = 'active'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [categoryId]);
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm theo danh mục' });
  }
};

// Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Cần có từ khóa tìm kiếm' });
    }
    
    const searchTerm = `%${query}%`;
    
    const [products] = await pool.query(`
      SELECT 
        p.*, 
        COALESCE(AVG(r.rating), 0) AS averageRating,
        COUNT(DISTINCT r.id) AS reviewCount,
        c.name AS categoryName
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.description LIKE ?) AND p.status = 'active'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [searchTerm, searchTerm]);
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Lỗi khi tìm kiếm sản phẩm' });
  }
};