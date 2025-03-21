// backend/middleware/admin.js
module.exports = (req, res, next) => {
    // Kiểm tra xem người dùng đã được xác thực chưa
    if (!req.user) {
      return res.status(401).json({ message: 'Không có thông tin xác thực' });
    }
    
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    
    next();
  };