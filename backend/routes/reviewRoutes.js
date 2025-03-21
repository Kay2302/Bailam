// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Lấy tất cả đánh giá (cho trang admin)
router.get('/', reviewController.getAllReviews);

// Lấy tất cả đánh giá của một sản phẩm
router.get('/:productId', reviewController.getReviewsByProductId);

// Thêm đánh giá mới
router.post('/:productId', reviewController.addReview);

// Xóa đánh giá
router.delete('/:id', reviewController.deleteReview);

module.exports = router;