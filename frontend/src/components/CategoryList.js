// src/components/CategoryList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaTags } from 'react-icons/fa';
import categories from '../Data/categories';

function CategoryList() {
  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold">
            <FaTags className="me-2" />
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-muted">Khám phá sản phẩm theo danh mục</p>
        </div>

        <Row>
          {categories.map(category => (
            <Col key={category.id} xs={6} md={4} lg={3} className="mb-4">
              <Link 
                to={`/products/category/${encodeURIComponent(category.name.toLowerCase())}`} 
                className="text-decoration-none"
              >
                <Card className="h-100 shadow-sm category-card border-0">
                  <div className="category-image-container">
                    <Card.Img 
                      variant="top" 
                      src={category.image} 
                      alt={category.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=' + category.name;
                      }}
                      className="category-image"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold">{category.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      {category.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      <style jsx="true">{`
        .category-card {
          transition: transform 0.3s, box-shadow 0.3s;
          overflow: hidden;
        }
        
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .category-image-container {
          height: 150px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
        }
        
        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        
        .category-card:hover .category-image {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}

export default CategoryList;