// src/components/Nav.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav as BootstrapNav, Button, Dropdown, Badge, Spinner } from 'react-bootstrap';
import { FaUser, FaShoppingCart, FaList, FaSignOutAlt, FaSignInAlt, FaHome, FaPhone, FaStore, FaHeart, FaClipboardList, FaSearch, FaTag } from 'react-icons/fa';
import { useProduct } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useProduct();
  const { isAuthenticated, currentUser, logout, loading: authLoading } = useAuth();
  
  // Tính tổng số sản phẩm trong giỏ hàng
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Thêm sự kiện scroll để thay đổi màu navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Xác định nếu đang ở trang admin
  const isAdminPage = location.pathname.includes('/admin');

  // Tạo class cho navbar dựa trên trạng thái scroll và đường dẫn hiện tại
  const navbarClass = `navbar navbar-expand-lg ${
    isScrolled || !location.pathname.startsWith('/') || location.pathname.length > 1
      ? 'navbar-light bg-light shadow-sm'
      : 'navbar-dark bg-transparent'
  } fixed-top py-3 transition`;

  return (
    <Navbar 
      expand="lg" 
      className={navbarClass} 
      id="mainNav"
    >
      <Container className="px-4 px-lg-5">
        <Link className="navbar-brand fw-bold" to="/">
          <FaStore className="me-2" />
          ElectroShop
        </Link>
        <Navbar.Toggle aria-controls="navbarResponsive" />
        <Navbar.Collapse id="navbarResponsive">
          <form className="d-flex mx-auto my-2 my-lg-0" onSubmit={handleSearch} style={{ maxWidth: '400px' }}>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Tìm kiếm sản phẩm..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>
          
          <BootstrapNav className="ms-auto my-2 my-lg-0">
            <BootstrapNav.Item>
              <Link className="nav-link px-lg-3 py-3 py-lg-4" to="/">
                <FaHome className="me-1 d-none d-md-inline" /> Trang Chủ
              </Link>
            </BootstrapNav.Item>
            <BootstrapNav.Item>
              <Link className="nav-link px-lg-3 py-3 py-lg-4" to="/products">
                <FaTag className="me-1 d-none d-md-inline" /> Sản Phẩm
              </Link>
            </BootstrapNav.Item>
            
            <Dropdown as={BootstrapNav.Item}>
              <Dropdown.Toggle as="div" className="nav-link px-lg-3 py-3 py-lg-4 d-flex align-items-center" style={{ cursor: 'pointer' }}>
                <FaTag className="me-1 d-none d-md-inline" /> Danh Mục
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/products/category/Điện thoại">Điện thoại</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/category/Laptop">Laptop</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/category/Tablet">Tablet</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/category/Tai nghe">Tai nghe</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/category/Đồng hồ thông minh">Đồng hồ thông minh</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/category/Phụ kiện">Phụ kiện</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <BootstrapNav.Item>
              <a className="nav-link px-lg-3 py-3 py-lg-4" href="/#lien-he">
                <FaPhone className="me-1 d-none d-md-inline" /> Liên Hệ
              </a>
            </BootstrapNav.Item>
            
            <BootstrapNav.Item>
              <Link className="nav-link px-lg-3 py-3 py-lg-4 position-relative" to="/cart">
                <FaShoppingCart className="me-1" />
                <span className="d-none d-md-inline">Giỏ hàng</span>
                {cartItemCount > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute" 
                    style={{ top: '10px', right: '5px', fontSize: '0.6rem' }}
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </BootstrapNav.Item>
            
          {authLoading ? (
            <BootstrapNav.Item>
              <div className="nav-link px-lg-3 py-3 py-lg-4">
                <Spinner animation="border" size="sm" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </Spinner>
              </div>
            </BootstrapNav.Item>
          ) : isAuthenticated ? (
            currentUser?.role === 'admin' ? (
              // Menu cho admin
              <Dropdown as={BootstrapNav.Item}>
                <Dropdown.Toggle as="div" className="nav-link px-lg-3 py-3 py-lg-4 d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <FaUser className="me-1" /> {currentUser.name}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/admin">
                    <FaList className="me-2" /> Quản trị
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/wishlist">
                    <FaHeart className="me-2" /> Yêu thích
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/order-history">
                    <FaClipboardList className="me-2" /> Đơn hàng
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              // Menu cho user đã đăng nhập
              <Dropdown as={BootstrapNav.Item}>
                <Dropdown.Toggle as="div" className="nav-link px-lg-3 py-3 py-lg-4 d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <FaUser className="me-1" /> {currentUser.name}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" /> Tài khoản
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/wishlist">
                    <FaHeart className="me-2" /> Yêu thích
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/order-history">
                    <FaClipboardList className="me-2" /> Đơn hàng
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )
          ) : (
            // Menu cho người chưa đăng nhập
            <BootstrapNav.Item>
              <Link className="nav-link px-lg-3 py-3 py-lg-4" to="/login">
                <FaSignInAlt className="me-1 d-none d-md-inline" /> Đăng Nhập
              </Link>
            </BootstrapNav.Item>
          )}
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Nav;