// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Lấy tất cả đơn hàng
router.get('/', orderController.getAllOrders);

// Lấy thống kê đơn hàng
router.get('/stats', orderController.getOrderStats);

// Lấy danh sách khách hàng
router.get('/customers', orderController.getCustomers);

// Lấy đơn hàng của một người dùng
router.get('/user/:userId', orderController.getUserOrders);

// Lấy chi tiết đơn hàng theo ID
router.get('/:id', orderController.getOrderById);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;