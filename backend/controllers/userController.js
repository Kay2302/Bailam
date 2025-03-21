// backend/controllers/userController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Tạo tài khoản mới
    const [result] = await pool.query(`
      INSERT INTO users (name, email, password, phone, role, created_at)
      VALUES (?, ?, ?, ?, 'customer', NOW())
    `, [name, email, hashedPassword, phone || '']);
    
    const userId = result.insertId;
    
    // Tạo JWT token
    const token = jwt.sign(
      { id: userId, email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      token,
      user: {
        id: userId,
        name,
        email,
        phone: phone || '',
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Lỗi khi đăng ký tài khoản' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }
    
    // Kiểm tra tài khoản
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    const user = users[0];
    
    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Lỗi khi đăng nhập' });
  }
};
// Lấy thông tin người dùng
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [users] = await pool.query(`
      SELECT id, name, email, phone, role, created_at, updated_at
      FROM users
      WHERE id = ?
    `, [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
  }
};

// Cập nhật thông tin người dùng
exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Tên không được để trống' });
    }
    
    const [result] = await pool.query(`
      UPDATE users
      SET name = ?, phone = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, phone || '', id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    const [updatedUser] = await pool.query(`
      SELECT id, name, email, phone, role, created_at, updated_at
      FROM users
      WHERE id = ?
    `, [id]);
    
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }
    
    // Kiểm tra người dùng
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    const user = users[0];
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    
    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Cập nhật mật khẩu
    await pool.query(`
      UPDATE users
      SET password = ?, updated_at = NOW()
      WHERE id = ?
    `, [hashedPassword, id]);
    
    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Lỗi khi đổi mật khẩu' });
  }
};

// Lấy danh sách người dùng (cho admin)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT id, name, email, phone, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
};