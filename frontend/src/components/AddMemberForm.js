// components/AddMemberForm.js
import React, { useState } from 'react';
import './AddMemberForm.css';

function AddMemberForm({ onAddMember, onCancel }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name || !phone || !role) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    
    // Add new member
    onAddMember({ name, phone, role });
    
    // Reset form
    setName('');
    setPhone('');
    setRole('');
  };
  
  return (
    <div className="add-member-form">
      <h3>Thêm mới user vào hệ thống</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tên User"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Chọn Quyền mặc định</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="User">User</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Thêm mới</button>
      </form>
    </div>
  );
}

export default AddMemberForm;