// components/SeoForm.js
import React, { useState } from 'react';

function SeoForm({ initialData, onSave }) {
  const [seoData, setSeoData] = useState({
    metaTitle: initialData.metaTitle || '',
    metaDescription: initialData.metaDescription || '',
    metaKeywords: initialData.metaKeywords || '',
    canonical: initialData.canonical || ''
  });

  const handleChange = (e) => {
    setSeoData({
      ...seoData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(seoData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="metaTitle" className="form-label">Meta Title</label>
        <input
          type="text"
          className="form-control"
          id="metaTitle"
          name="metaTitle"
          value={seoData.metaTitle}
          onChange={handleChange}
        />
        <div className="form-text">Tiêu đề hiển thị trên kết quả tìm kiếm</div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="metaDescription" className="form-label">Meta Description</label>
        <textarea
          className="form-control"
          id="metaDescription"
          name="metaDescription"
          rows="3"
          value={seoData.metaDescription}
          onChange={handleChange}
        ></textarea>
        <div className="form-text">Mô tả hiển thị trên kết quả tìm kiếm</div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="metaKeywords" className="form-label">Meta Keywords</label>
        <input
          type="text"
          className="form-control"
          id="metaKeywords"
          name="metaKeywords"
          value={seoData.metaKeywords}
          onChange={handleChange}
        />
        <div className="form-text">Các từ khóa chính, cách nhau bằng dấu phẩy</div>
      </div>
      
      <div className="mb-3">
        <label htmlFor="canonical" className="form-label">Canonical URL</label>
        <input
          type="text"
          className="form-control"
          id="canonical"
          name="canonical"
          value={seoData.canonical}
          onChange={handleChange}
        />
        <div className="form-text">URL gốc nếu có nhiều URL trỏ đến cùng nội dung</div>
      </div>
      
      <button type="submit" className="btn btn-primary">Lưu thông tin SEO</button>
    </form>
  );
}

export default SeoForm;