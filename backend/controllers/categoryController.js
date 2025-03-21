// backend/controllers/categoryController.js
const pool = require('../config/db');

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh mục' });
  }
};

// Lấy chi tiết danh mục theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [category] = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
    
    if (category.length === 0) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    
    res.status(200).json(category[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Lỗi khi lấy chi tiết danh mục' });
  }
};

// Thêm danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
    }
    
    const [result] = await pool.query(`
      INSERT INTO categories (name, description, created_at)
      VALUES (?, ?, NOW())
    `, [name, description || '']);
    
    const newCategoryId = result.insertId;
    
    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [newCategoryId]);
    
    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Lỗi khi tạo danh mục mới' });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
    }
    
    const [result] = await pool.query(`
      UPDATE categories
      SET name = ?, description = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, description || '', id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    
    const [updatedCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    
    res.status(200).json(updatedCategory[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật danh mục' });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra xem danh mục có sản phẩm không
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục này vì đang có sản phẩm thuộc danh mục',
        productCount: products[0].count
      });
    }
    
    // Xóa danh mục
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    
    res.status(200).json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Lỗi khi xóa danh mục' });
  }
};