import React, { useState } from 'react';

function LienHe() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    success: false,
    error: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form tại đây
    setFormStatus({ success: true, error: false });
  };

  return (
    <section className="page-section" id="lien-he">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-lg-8 col-xl-6 text-center">
            <h2 className="mt-0">Liên Hệ Với Chúng Tôi</h2>
            <hr className="divider" />
            <p className="text-muted mb-5">Bạn có câu hỏi hoặc cần hỗ trợ? Hãy gửi tin nhắn cho chúng tôi!</p>
          </div>
        </div>
        
        <div className="row gx-4 gx-lg-5">
          <div className="col-lg-4 mb-5">
            <div className="card h-100">
              <div className="card-body text-center p-5">
                <h3 className="mb-4">Thông Tin Liên Hệ</h3>
                <div className="mb-4">
                  <i className="bi-geo-alt fs-2 text-primary mb-2"></i>
                  <p>123 Đường ABC, Quận XYZ<br />Thành phố HCM, Việt Nam</p>
                </div>
                <div className="mb-4">
                  <i className="bi-envelope fs-2 text-primary mb-2"></i>
                  <p>info@example.com</p>
                </div>
                <div className="mb-4">
                  <i className="bi-phone fs-2 text-primary mb-2"></i>
                  <p>+84 123 456 789</p>
                </div>
                <div className="mb-4">
                  <i className="bi-clock fs-2 text-primary mb-2"></i>
                  <p>Thứ Hai - Thứ Sáu: 9:00 - 17:00</p>
                </div>
                <div className="d-flex justify-content-center">
                  <a className="mx-2" href="#!"><i className="bi-facebook fs-3"></i></a>
                  <a className="mx-2" href="#!"><i className="bi-twitter fs-3"></i></a>
                  <a className="mx-2" href="#!"><i className="bi-instagram fs-3"></i></a>
                  <a className="mx-2" href="#!"><i className="bi-linkedin fs-3"></i></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-8 mb-5">
            <div className="card">
              <div className="card-body p-5">
                <form id="contactForm" onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input 
                      className="form-control" 
                      id="name" 
                      type="text" 
                      placeholder="Nhập tên của bạn..." 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                    <label htmlFor="name">Họ và tên</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input 
                      className="form-control" 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                    <label htmlFor="email">Địa chỉ email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input 
                      className="form-control" 
                      id="phone" 
                      type="tel" 
                      placeholder="(123) 456-7890" 
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                    <label htmlFor="phone">Số điện thoại</label>
                  </div>
                  <div className="form-floating mb-3">
                    <textarea 
                      className="form-control" 
                      id="message" 
                      placeholder="Nhập nội dung tin nhắn..." 
                      style={{ height: "10rem" }} 
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                    <label htmlFor="message">Nội dung</label>
                  </div>
                  
                  {/* Thông báo thành công */}
                  <div className={formStatus.success ? "" : "d-none"} id="submitSuccessMessage">
                    <div className="text-center mb-3">
                      <div className="fw-bolder">Gửi tin nhắn thành công!</div>
                      Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
                    </div>
                  </div>
                  
                  {/* Thông báo lỗi */}
                  <div className={formStatus.error ? "" : "d-none"} id="submitErrorMessage">
                    <div className="text-center text-danger mb-3">Có lỗi khi gửi tin nhắn!</div>
                  </div>
                  
                  {/* Nút gửi */}
                  <div className="d-grid">
                    <button className="btn btn-primary btn-xl" id="submitButton" type="submit">Gửi</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row gx-4 gx-lg-5 justify-content-center mt-5">
          <div className="col-lg-8 text-center">
            <h3 className="mt-0">Bản Đồ</h3>
            <hr className="divider" />
            <div className="ratio ratio-16x9">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580555733!2d106.69916961471815!3d10.771594992323746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFThu7Egbmhpw6puIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1655254657482!5m2!1svi!2s" 
                width="600" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LienHe;