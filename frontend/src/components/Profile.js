// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaHistory } from 'react-icons/fa';
import Nav from './Nav';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, changePassword, error: authError, isAuthenticated, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Cập nhật dữ liệu khi có thông tin người dùng
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await updateProfile(profileData);
      setMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp.');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordMessage('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Có lỗi xảy ra khi đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị trạng thái loading
  if (authLoading) {
    return (
      <>
        <Nav />
        <Container className="py-5 mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông tin người dùng...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Container className="py-5 mt-5">
        <h2 className="mb-4">
          <FaUser className="me-2" />
          Thông tin tài khoản
        </h2>

        {authError && <Alert variant="danger">{authError}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col lg={4} md={5} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <div 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}
                  >
                    <FaUser size={40} className="text-primary" />
                  </div>
                </div>
                <h5>{profileData.name || 'Người dùng'}</h5>
                <p className="text-muted">{profileData.email}</p>
                <div className="d-grid">
                  <Link to="/order-history" className="btn btn-outline-primary">
                    <FaHistory className="me-2" /> Lịch sử đơn hàng
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} md={7}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Thông tin cá nhân</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FaEdit className="me-1" /> {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
              </Card.Header>
              <Card.Body>
                {message && <Alert variant={message.includes('thành công') ? 'success' : 'danger'}>{message}</Alert>}

                <Form onSubmit={handleProfileSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="me-2" /> Họ và tên
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaEnvelope className="me-2" /> Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Email không thể thay đổi.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaPhone className="me-2" /> Số điện thoại
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  {isEditing && (
                    <div className="d-grid">
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang cập nhật...
                          </>
                        ) : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">
                  <FaLock className="me-2" /> Đổi mật khẩu
                </h5>
              </Card.Header>
              <Card.Body>
                {passwordMessage && <Alert variant={passwordMessage.includes('thành công') ? 'success' : 'danger'}>{passwordMessage}</Alert>}

                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      Mật khẩu phải có ít nhất 6 ký tự.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Đang xử lý...
                        </>
                      ) : 'Đổi mật khẩu'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Profile;