// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Đăng ký tài khoản
router.post('/register', userController.register);

// Đăng nhập
router.post('/login', userController.login);

// Lấy danh sách người dùng (cho admin)
router.get('/', userController.getAllUsers);

// Lấy thông tin người dùng
router.get('/:id', userController.getUserProfile);

// Cập nhật thông tin người dùng
router.put('/:id', userController.updateUserProfile);

// Đổi mật khẩu
router.put('/:id/password', userController.changePassword);

module.exports = router;