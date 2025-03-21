// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Lấy tất cả danh mục
router.get('/', categoryController.getAllCategories);

// Lấy chi tiết danh mục theo ID
router.get('/:id', categoryController.getCategoryById);

// Thêm danh mục mới
router.post('/', categoryController.createCategory);

// Cập nhật danh mục
router.put('/:id', categoryController.updateCategory);

// Xóa danh mục
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;