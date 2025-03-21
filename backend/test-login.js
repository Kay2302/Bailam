// backend/test-login.js
const axios = require('axios');

async function testLogin(type = 'admin') {
  try {
    console.log(`Testing ${type} login endpoint...`);
    
    // Thông tin đăng nhập dựa vào loại tài khoản
    const loginData = type === 'admin' 
      ? {
          email: 'admin@example.com',
          password: 'admin123'
        }
      : {
          email: 'user@example.com',
          password: 'user123'
        };
    
    const response = await axios.post('http://localhost:5000/api/test-login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Login test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Thử đăng nhập với tài khoản admin
testLogin('admin');

// Thử đăng nhập với tài khoản user
setTimeout(() => {
  testLogin('user');
}, 1000);