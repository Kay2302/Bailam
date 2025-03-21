import React from 'react';

function Footer() {
  return (
    <footer className="bg-light py-5">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5>Về Chúng Tôi</h5>
            <p className="text-muted mb-4">Chúng tôi cung cấp thông tin và dịch vụ chất lượng, đáp ứng mọi nhu cầu của khách hàng.</p>
            <div className="d-flex">
              <a className="btn btn-outline-primary btn-social me-2" href="#!"><i className="bi-facebook"></i></a>
              <a className="btn btn-outline-primary btn-social me-2" href="#!"><i className="bi-twitter"></i></a>
              <a className="btn btn-outline-primary btn-social me-2" href="#!"><i className="bi-instagram"></i></a>
              <a className="btn btn-outline-primary btn-social" href="#!"><i className="bi-linkedin"></i></a>
            </div>
          </div>
          
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5>Liên Kết Nhanh</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a className="text-muted text-decoration-none" href="#home">Trang Chủ</a></li>
              <li className="mb-2"><a className="text-muted text-decoration-none" href="#tin-tuc">Tin Tức</a></li>
              <li className="mb-2"><a className="text-muted text-decoration-none" href="#lien-he">Liên Hệ</a></li>
              <li className="mb-2"><a className="text-muted text-decoration-none" href="#!">Chính Sách Bảo Mật</a></li>
              <li className="mb-2"><a className="text-muted text-decoration-none" href="#!">Điều Khoản Sử Dụng</a></li>
            </ul>
          </div>
          
          <div className="col-lg-4">
            <h5>Liên Hệ</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><i className="bi-geo-alt me-2 text-primary"></i>123 Đường ABC, Quận XYZ, TP.HCM</li>
              <li className="mb-2"><i className="bi-envelope me-2 text-primary"></i>info@example.com</li>
              <li className="mb-2"><i className="bi-phone me-2 text-primary"></i>+84 123 456 789</li>
              <li className="mb-2"><i className="bi-clock me-2 text-primary"></i>Thứ Hai - Thứ Sáu: 9:00 - 17:00</li>
            </ul>
          </div>
        </div>
        
        <div className="row mt-4">
          <div className="col-12 text-center">
            <hr className="my-3" />
            <div className="small text-muted">Copyright &copy; {new Date().getFullYear()} - Tên Công Ty</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;