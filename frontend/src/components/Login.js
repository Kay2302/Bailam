// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Modal, Spinner } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Login.css';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';
import { checkServerStatus } from '../utils/ServerStatus';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, userRole, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  
  // State cho phần quên mật khẩu
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Lấy đường dẫn trở về sau khi đăng nhập nếu có
  const returnUrl = location.state?.returnUrl || '/';
  
  // Hiệu ứng typing cho tiêu đề
  const [typedText, setTypedText] = useState('');
  const fullText = 'Đăng Nhập Tài Khoản';
  
  // Kiểm tra server status
  useEffect(() => {
    const checkServer = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };
    
    checkServer();
  }, []);
  
  // Hiệu ứng typing
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate(returnUrl);
      }
    }
    
    // Lấy email đã lưu (nếu có)
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [isAuthenticated, userRole, navigate, returnUrl]);

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate input
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      setLoading(false);
      return;
    }

    // Lưu email nếu chọn "Remember me"
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      console.log('Đang gửi yêu cầu đăng nhập...');
      await login(email, password);
      console.log('Đăng nhập thành công!');
      // Redirect được xử lý bởi useEffect khi isAuthenticated thay đổi
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err);
      
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      if (err.response) {
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (err.message && err.message.includes('Network Error')) {
        errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Xử lý quên mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetLoading(true);

    // Kiểm tra email
    if (!forgotEmail) {
      setResetError('Vui lòng nhập email!');
      setResetLoading(false);
      return;
    }

    try {
      // Gọi API để gửi yêu cầu đặt lại mật khẩu
      await userApi.requestPasswordReset(forgotEmail);
      setResetSuccess(true);
    } catch (err) {
      console.error('Lỗi khi yêu cầu đặt lại mật khẩu:', err);
      setResetError(err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setResetLoading(false);
    }
  };

  // Reset form khi đóng modal
  const handleCloseModal = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  return (
    <div className="login-page">
      <div className="animated-background">
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
      </div>
      
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <div className="text-center mb-4 text-white">
              <h2 className="typing-effect">{typedText}<span className="cursor">|</span></h2>
              <p className="subtitle">Đăng nhập để tiếp tục mua sắm</p>
            </div>
            
            <Card className="login-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="brand-logo-container">
                  </div>
                  <h4 className="welcome-text">Chào mừng trở lại!</h4>
                </div>
                
                {(error || authError) && (
                  <Alert variant="danger" className="animated-alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error || authError}
                    {error && error.includes('server') && (
                      <div className="mt-2">
                        <small>
                          Gợi ý: Hãy kiểm tra xem server backend đã chạy chưa
                        </small>
                      </div>
                    )}
                  </Alert>
                )}
                
                {serverStatus && !serverStatus.isRunning && (
                  <Alert variant="warning" className="mb-4">
                    <i className="fas fa-server me-2"></i>
                    <strong>Cảnh báo:</strong> {serverStatus.message}
                    <div className="mt-2">
                      <small>
                        Hãy đảm bảo rằng server backend đang chạy trước khi đăng nhập.
                      </small>
                    </div>
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-start-0 ps-0"
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-start-0 border-end-0 ps-0"
                      />
                      <InputGroup.Text 
                        className="bg-light cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  
                  <Row className="mb-4">
                    <Col>
                      <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        label="Ghi nhớ đăng nhập"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="custom-checkbox"
                      />
                    </Col>
                    <Col className="text-end">
                      <a 
                        href="#!" 
                        className="forgot-password"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowForgotPassword(true);
                        }}
                      >
                        Quên mật khẩu?
                      </a>
                    </Col>
                  </Row>
                  
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 login-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                  </Button>
                  
                  {/* Thêm các tài khoản test */}
                  <div className="mt-3 text-center">
                    <small className="text-muted">Tài khoản test:</small>
                    <div className="d-flex justify-content-center mt-2 gap-2">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          setEmail('admin@example.com');
                          setPassword('admin123');
                        }}
                      >
                        Admin
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          setEmail('user@example.com');
                          setPassword('user123');
                        }}
                      >
                        User
                      </Button>
                    </div>
                  </div>
                </Form>
                
                <div className="mt-4 text-center">
                  <p>Chưa có tài khoản? <Link to="/register" className="text-primary">Đăng ký ngay</Link></p>
                  
                  <Link to="/" className="btn btn-outline-secondary mt-3">
                    <FaSignOutAlt className="me-2" /> Trở về trang chủ
                  </Link>
                </div>
              </Card.Body>
            </Card>
            
            <div className="mt-4 text-center text-white">
              <p className="footer-text">
                &copy; {new Date().getFullYear()} ElectroShop. All rights reserved.
                <br />
                <small>Phiên bản 1.0.0</small>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal Quên Mật Khẩu */}
      <Modal 
        show={showForgotPassword} 
        onHide={handleCloseModal}
        centered
        className="forgot-password-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Đặt lại mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resetSuccess ? (
            // Hiển thị thông báo thành công
            <div className="text-center py-3">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
              <h5 className="mt-3">Yêu cầu đã được gửi!</h5>
              <p className="text-muted">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến.
              </p>
              <Button 
                variant="primary" 
                onClick={handleCloseModal}
                className="mt-3"
              >
                Đóng
              </Button>
            </div>
          ) : (
            // Hiển thị form nhập email để lấy lại mật khẩu
            <Form onSubmit={handleResetPassword}>
              <p className="text-muted mb-4">
                Vui lòng nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu.
              </p>
              
              {resetError && (
                <Alert variant="danger" className="animated-alert">
                  {resetError}
                </Alert>
              )}
              
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-light">
                    <FaUser />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="border-start-0 ps-0"
                  />
                </InputGroup>
              </Form.Group>
              
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    'Gửi yêu cầu đặt lại mật khẩu'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;