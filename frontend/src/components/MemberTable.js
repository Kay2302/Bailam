// components/MemberTable.js
import React from 'react';
import './MemberTable.css';

function MemberTable({ members, onDelete, onEdit }) {
  return (
    <table className="member-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên</th>
          <th>Điện thoại</th>
          <th>Quyền</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.id}</td>
            <td>{member.name}</td>
            <td>{member.phone}</td>
            <td>{member.role}</td>
            <td className="action-buttons">
              <button className="edit-button">
                <span className="icon">✏️</span> Sửa
              </button>
              <button 
                className="delete-button"
                onClick={() => onDelete(member.id)}
              >
                <span className="icon">🗑️</span> Xoá
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MemberTable;