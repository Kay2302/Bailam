// src/components/NotFound.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

function NotFound() {
  return (
    <>
      <Nav />
      <Container className="py-5 my-5 text-center">
        <FaExclamationTriangle size={80} className="text-warning mb-4" />
        <h1 className="display-4">404 - Không tìm thấy trang</h1>
        <p className="lead mb-4">Trang bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/">
          <Button variant="primary" size="lg">
            <FaHome className="me-2" /> Quay về trang chủ
          </Button>
        </Link>
      </Container>
      <Footer />
    </>
  );
}

export default NotFound;