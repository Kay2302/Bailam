// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Lấy tất cả sản phẩm
router.get('/', productController.getAllProducts);

// Tìm kiếm sản phẩm
router.get('/search', productController.searchProducts);

// Lấy sản phẩm theo danh mục
router.get('/category/:categoryId', productController.getProductsByCategory);

// Lấy sản phẩm liên quan
router.get('/:id/related', productController.getRelatedProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Thêm sản phẩm mới
router.post('/', productController.createProduct);

// Cập nhật sản phẩm
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

module.exports = router;