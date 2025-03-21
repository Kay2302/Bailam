// backend/controllers/reviewController.js
const pool = require('../config/db');

// Lấy tất cả đánh giá của một sản phẩm
exports.getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const [reviews] = await pool.query(`
      SELECT * FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
    `, [productId]);
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Lỗi khi lấy đánh giá' });
  }
};

// Thêm đánh giá mới
exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, email, comment, rating } = req.body;
    
    if (!name || !email || !comment || !rating) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Kiểm tra sản phẩm tồn tại
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    // Thêm đánh giá mới
    const [result] = await pool.query(`
      INSERT INTO reviews (product_id, name, email, comment, rating, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [productId, name, email, comment, rating]);
    
    const reviewId = result.insertId;
    
    // Lấy đánh giá vừa thêm
    const [newReview] = await pool.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
    
    res.status(201).json(newReview[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Lỗi khi thêm đánh giá' });
  }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Đánh giá không tồn tại' });
    }
    
    res.status(200).json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Lỗi khi xóa đánh giá' });
  }
};

// Lấy tất cả đánh giá (cho trang admin)
exports.getAllReviews = async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, p.name as productName
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Lỗi khi lấy tất cả đánh giá' });
  }
};