// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const pool = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Cho phép tất cả các origin trong quá trình dev
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Thêm middleware để log request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route trang chủ
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend API đang chạy</h1>
    <p>Server đang hoạt động trên cổng ${PORT}</p>
    <h2>Các API có sẵn:</h2>
    <ul>
      <li><a href="/api/health-check">/api/health-check</a> - Kiểm tra server</li>
      <li><a href="/api/products">/api/products</a> - API sản phẩm</li>
      <li><a href="/api/categories">/api/categories</a> - API danh mục</li>
      <li>/api/users - API người dùng (yêu cầu POST)</li>
      <li>/api/test-login - API test đăng nhập (yêu cầu POST)</li>
    </ul>
  `);
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Các route API đặc biệt
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/api/db-check', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 as connected');
    res.status(200).json({ 
      status: 'ok', 
      message: 'Database connection successful',
      data: result 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Endpoint test login trong server.js
app.post('/api/test-login', (req, res) => {
  console.log('Test login endpoint called with body:', req.body);
  const { email, password } = req.body;
  
  // Kiểm tra tài khoản admin
  if (email === 'admin@example.com' && password === 'admin123') {
    console.log('Admin login successful');
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token: 'admin-token-' + Date.now(),
      user: {
        id: 999,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
  }
  
  // Kiểm tra tài khoản user
  if (email === 'user@example.com' && password === 'user123') {
    console.log('User login successful');
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token: 'user-token-' + Date.now(),
      user: {
        id: 888,
        name: 'Regular User',
        email: 'user@example.com',
        role: 'customer'
      }
    });
  }
  
  // Kiểm tra tài khoản cũ nếu cần
  if (email === 'test@example.com' && password === 'password123') {
    console.log('Old admin login successful');
    return res.status(200).json({
      message: 'Đăng nhập thành công',
      token: 'test-token-' + Date.now(),
      user: {
        id: 777,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }
    });
  }
  
  // Nếu không khớp với tài khoản nào
  console.log('Login failed for:', email);
  return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
});
// In ra các route đã đăng ký (chỉ những route trực tiếp)
console.log('Các routes đã đăng ký:');
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path);
  }
});

// Catch-all route (đặt cuối cùng)
app.use('*', (req, res) => {
  res.status(404).send(`
    <h1>404 - Không tìm thấy</h1>
    <p>Route ${req.originalUrl} không tồn tại</p>
    <a href="/">Quay lại trang chủ</a>
  `);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  console.log(`Truy cập: http://localhost:${PORT} để kiểm tra`);
});