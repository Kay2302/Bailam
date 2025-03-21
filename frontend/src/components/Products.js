// src/components/Products.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FaStar, FaRegStar, FaSearch, FaFilter, FaShoppingCart, FaHeart, FaEye, FaTags, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useProduct } from '../contexts/ProductContext';
import productData from '../Data/productData'; // Import dữ liệu mẫu

function Products({ products = [], loading = false, error = null }) {
  const { addToCart } = useProduct();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 6;
  
  // Sử dụng dữ liệu mẫu nếu không có dữ liệu truyền vào
  const allProducts = products.length > 0 ? products : productData;

  // Lấy danh sách danh mục từ dữ liệu sản phẩm
  const categories = [...new Set(allProducts.map(product => product.category))];

  // Lọc và sắp xếp sản phẩm
  useEffect(() => {
    let result = [...allProducts];
    
    // Lọc theo từ khóa
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Lọc theo danh mục
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Lọc theo khoảng giá
    result = result.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Lọc theo trạng thái (chỉ hiển thị sản phẩm đang bán)
    result = result.filter(product => product.status === 'active' || product.status === undefined);
    
    // Sắp xếp sản phẩm
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'newest':
      default:
        // Giả sử sản phẩm mới nhất có ID cao hơn
        result.sort((a, b) => b.id - a.id);
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, searchTerm, selectedCategory, priceRange, sortBy]);

  // Tính toán sản phẩm cho trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Render đánh giá sao
  const renderStars = (rating, size = '1rem') => {
    const roundedRating = Math.round(rating || 0);
    return Array(5).fill(0).map((_, index) => (
      <span 
        key={index}
        style={{ color: index < roundedRating ? '#ffc107' : '#e4e5e9', fontSize: size, marginRight: '2px' }}
      >
        {index < roundedRating ? <FaStar /> : <FaRegStar />}
      </span>
    ));
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <section className="page-section" id="products">
        <Container className="px-4 px-lg-5 text-center">
          <h2 className="text-center mt-0">Sản Phẩm Nổi Bật</h2>
          <hr className="divider" />
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải dữ liệu...</p>
        </Container>
      </section>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <section className="page-section" id="products">
        <Container className="px-4 px-lg-5 text-center">
          <h2 className="text-center mt-0">Sản Phẩm Nổi Bật</h2>
          <hr className="divider" />
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </Container>
      </section>
    );
  }

  // Hiển thị khi không có sản phẩm
  if (filteredProducts.length === 0) {
    return (
      <section className="page-section" id="products">
        <Container className="px-4 px-lg-5">
          <h2 className="text-center mt-0">Sản Phẩm Nổi Bật</h2>
          <hr className="divider" />
          
          {/* Thanh tìm kiếm và bộ lọc */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  Xóa
                </Button>
              </InputGroup>
            </Col>
            <Col md={4} className="mt-3 mt-md-0">
              <Button 
                variant="outline-primary" 
                className="w-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-2" /> {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              </Button>
            </Col>
          </Row>
          
          {/* Hiển thị bộ lọc nếu showFilters = true */}
          {showFilters && (
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Danh mục sản phẩm</Form.Label>
                      <Form.Select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Khoảng giá</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="number"
                          placeholder="Từ"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value) || 0})}
                        />
                        <span className="mx-2">-</span>
                        <Form.Control
                          type="number"
                          placeholder="Đến"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value) || 0})}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sắp xếp theo</Form.Label>
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="price-asc">Giá tăng dần</option>
                        <option value="price-desc">Giá giảm dần</option>
                        <option value="name-asc">Tên A-Z</option>
                        <option value="name-desc">Tên Z-A</option>
                        <option value="rating">Đánh giá cao nhất</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setSelectedCategory('');
                      setPriceRange({ min: 0, max: 5000 });
                      setSearchTerm('');
                      setSortBy('newest');
                    }}
                  >
                    Đặt lại bộ lọc
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
          
          <div className="alert alert-info text-center" role="alert">
            <p className="mb-0">Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.</p>
            <Button 
              variant="outline-primary" 
              className="mt-2"
              onClick={() => {
                setSelectedCategory('');
                setPriceRange({ min: 0, max: 5000 });
                setSearchTerm('');
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="page-section" id="products">
      <Container className="px-4 px-lg-5">
        <h2 className="text-center mt-0">Sản Phẩm Nổi Bật</h2>
        <hr className="divider" />
        
        {/* Thanh tìm kiếm và bộ lọc */}
        <Row className="mb-4">
          <Col md={8}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                Xóa
              </Button>
            </InputGroup>
          </Col>
          <Col md={4} className="mt-3 mt-md-0">
            <Button 
              variant="outline-primary" 
              className="w-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-2" /> {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
          </Col>
        </Row>
        
        {/* Hiển thị bộ lọc nếu showFilters = true */}
        {showFilters && (
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Danh mục sản phẩm</Form.Label>
                    <Form.Select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Khoảng giá</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        placeholder="Từ"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value) || 0})}
                      />
                      <span className="mx-2">-</span>
                      <Form.Control
                        type="number"
                        placeholder="Đến"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value) || 0})}
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sắp xếp theo</Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="price-asc">Giá tăng dần</option>
                      <option value="price-desc">Giá giảm dần</option>
                      <option value="name-asc">Tên A-Z</option>
                      <option value="name-desc">Tên Z-A</option>
                      <option value="rating">Đánh giá cao nhất</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange({ min: 0, max: 5000 });
                    setSearchTerm('');
                    setSortBy('newest');
                  }}
                >
                  Đặt lại bộ lọc
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
        
        {/* Hiển thị kết quả tìm kiếm */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <FaTags className="me-2" />
            <span>Hiển thị {currentProducts.length} / {filteredProducts.length} sản phẩm</span>
          </div>
          <div>
            <span className="me-2">Sắp xếp:</span>
            <div className="btn-group">
              <Button 
                variant={sortBy === 'price-asc' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setSortBy('price-asc')}
              >
                <FaSortAmountUp className="me-1" /> Giá
              </Button>
              <Button 
                variant={sortBy === 'price-desc' ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => setSortBy('price-desc')}
              >
                <FaSortAmountDown className="me-1" /> Giá
              </Button>
            </div>
          </div>
        </div>
        
        {/* Danh sách sản phẩm */}
        <Row className="g-4">
          {currentProducts.map((product) => (
            <Col lg={4} md={6} key={product.id}>
              <Card className="h-100 shadow-sm hover-scale product-card">
                <div className="position-relative">
                  <Link to={`/products/${product.id}`}>
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      alt={product.name} 
                      style={{ height: '220px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/220x220?text=' + encodeURIComponent(product.name);
                      }}
                    />
                  </Link>
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 end-0 m-2 px-2 py-1"
                  >
                    {product.category}
                  </Badge>
                  {product.discountPrice && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-0 m-2 px-2 py-1"
                    >
                      -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                    </Badge>
                  )}
                  
                  <div className="product-actions position-absolute bottom-0 start-0 end-0 mb-2 text-center">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="mx-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart />
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="mx-1"
                    >
                      <FaHeart />
                    </Button>
                    <Link to={`/products/${product.id}`}>
                      <Button 
                        variant="info" 
                        size="sm" 
                        className="mx-1 text-white"
                      >
                        <FaEye />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <Link to={`/products/${product.id}`} className="text-decoration-none text-dark product-title">
                      {product.name}
                    </Link>
                  </Card.Title>
                  
                  <Card.Text className="text-muted small">
                    {product.description.length > 80 
                      ? `${product.description.substring(0, 80)}...` 
                      : product.description
                    }
                  </Card.Text>
                  
                  <div className="d-flex align-items-center mb-2">
                    {renderStars(product.averageRating)}
                    <small className="text-muted ms-2">
                      ({product.reviewCount || 0} đánh giá)
                    </small>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {product.discountPrice ? (
                          <>
                            <span className="text-decoration-line-through text-muted">${product.price}</span>
                            <br />
                            <span className="text-danger fw-bold fs-5">${product.discountPrice}</span>
                          </>
                        ) : (
                          <span className="fw-bold fs-5">${product.price}</span>
                        )}
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart className="me-1" /> Thêm vào giỏ
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination>
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
              
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item 
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
        
        <div className="text-center mt-5">
          <Link to="/products" className="btn btn-primary btn-lg">
            Xem Tất Cả Sản Phẩm
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default Products;