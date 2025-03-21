// src/utils/TestConnection.js
import axios from 'axios';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    // Thử kết nối đến endpoint đơn giản
    const response = await axios.get('http://localhost:5000/api/health-check', {
      timeout: 5000 // Timeout 5 giây
    });
    console.log('API connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection failed with error:', error.message);
    
    // Kiểm tra cụ thể lỗi
    if (error.code === 'ECONNREFUSED') {
      console.error('Server không hoạt động hoặc sai địa chỉ');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Kết nối bị timeout');
    }
    
    return false;
  }
};