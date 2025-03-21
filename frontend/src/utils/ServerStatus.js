// src/utils/ServerStatus.js
import axios from 'axios';

export const checkServerStatus = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/health-check', { timeout: 3000 });
    return {
      isRunning: true,
      message: response.data.message || 'Server is running'
    };
  } catch (error) {
    return {
      isRunning: false,
      message: 'Server không hoạt động hoặc không thể kết nối'
    };
  }
};