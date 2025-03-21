// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';
import { FaStar, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaCheck, FaMinus, FaPlus } from 'react-icons/fa';
import Nav from './Nav';
import Footer from './Footer';
import { productApi, reviewApi } from '../services/api';
import { useProduct } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist } = useProduct();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: ''
  });
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Lấy chi tiết sản phẩm
        const productResponse = await productApi.getById(parseInt(id));
        if (!productResponse.data) {
          setError('Không tìm thấy sản phẩm.');
          setLoading(false);
          return;
        }
        
        setProduct(productResponse.data);
        
        // Lấy các sản phẩm liên quan
        const relatedResponse = await productApi.getRelated(parseInt(id));
        setRelatedProducts(relatedResponse.data);
        
        // Lấy đánh giá của sản phẩm
        const reviewsResponse = await reviewApi.getByProductId(parseInt(id));
        setReviews(reviewsResponse.data);
        
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      if (!isAuthenticated) {
        if (window.confirm('Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích. Chuyển đến trang đăng nhập?')) {
          navigate('/login', { state: { returnUrl: `/products/${id}` } });
        }
        return;
      }
      
      addToWishlist(product);
      alert('Đã thêm sản phẩm vào danh sách yêu thích!');
    }
  };

  // Xử lý thay đổi form đánh giá
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: value
    });
  };

  // Xử lý đánh giá sao
  const handleStarClick = (rating) => {
    setReviewStars(rating);
    setReviewForm({
      ...reviewForm,
      rating
    });
  };

  // Xử lý gửi đánh giá
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!reviewForm.name || !reviewForm.email || !reviewForm.comment || !reviewForm.rating) {
      setReviewError('Vui lòng điền đầy đủ thông tin đánh giá.');
      return;
    }
    
    setReviewSubmitting(true);
    setReviewError('');
    
    try {
      // Gọi API để thêm đánh giá
      const response = await reviewApi.add(id, reviewForm);
      
      // Thêm đánh giá mới vào danh sách
      setReviews([response.data, ...reviews]);
      
      // Reset form
      setReviewForm({
        name: '',
        email: '',
        rating: 0,
        comment: ''
      });
      setReviewStars(0);
      
      // Hiển thị thông báo thành công
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      console.error('Lỗi khi gửi đánh giá:', err);
      setReviewError('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setReviewSubmitting(false);
    }
  };

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

  // Nếu đang tải dữ liệu
  if (loading) {
    return (
      <>
        <Nav />
        <Container className="py-5 my-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Vui lòng đợi trong giây lát.</p>
        </Container>
        <Footer />
      </>
    );
  }

  // Nếu có lỗi hoặc không tìm thấy sản phẩm
  if (error || !product) {
    return (
      <>
        <Nav />
        <Container className="py-5 my-5 text-center">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>{error || 'Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.'}</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Quay lại trang sản phẩm
          </Link>
        </Container>
        <Footer />
      </>
    );
  }

  // Kiểm tra xem sản phẩm đã có trong wishlist chưa
  const isInWishlist = wishlist.some(item => item.id === product.id);

  return (
    <>
      <Nav />
      <Container className="py-5 mt-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/products">Sản phẩm</Link></li>
            <li className="breadcrumb-item"><Link to={`/products/category/${product.category}`}>{product.category}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>
        
        <Row>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="img-fluid" 
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(product.name);
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={6}>
            <h2 className="mb-3">{product.name}</h2>
            
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                {renderStars(product.averageRating, '1.2rem')}
                <span className="ms-2 text-muted">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
              <div className="ms-auto">
                <Badge bg="primary" className="px-3 py-2">{product.category}</Badge>
              </div>
            </div>
            
            <div className="mb-4">
              {product.discountPrice ? (
                <>
                  <span className="text-decoration-line-through text-muted fs-4">${product.price}</span>
                  <span className="ms-2 text-danger fw-bold fs-2">${product.discountPrice}</span>
                  <Badge bg="danger" className="ms-3">
                    -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                  </Badge>
                </>
              ) : (
                <span className="fw-bold fs-2">${product.price}</span>
              )}
            </div>
            
            <div className="mb-4">
              <p>{product.description}</p>
            </div>
            
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="text-muted me-3">Số lượng:</div>
                <div className="d-flex align-items-center">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </Button>
                  <Form.Control
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="mx-2 text-center"
                    style={{ width: '60px' }}
                  />
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus />
                  </Button>
                </div>
              </div>
              
              <div className="text-muted mb-3">
                Còn {product.stock} sản phẩm trong kho
              </div>
            </div>
            
            <div className="d-grid gap-2 mb-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? 'Hết hàng' : (
                  <>
                    <FaShoppingCart className="me-2" /> Thêm vào giỏ hàng
                  </>
                )}
              </Button>
              <Button 
                variant={isInWishlist ? "danger" : "outline-danger"}
                size="lg"
                onClick={handleAddToWishlist}
              >
                <FaHeart className="me-2" /> {isInWishlist ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích'}
              </Button>
            </div>
            
            <div className="d-flex mb-4">
              <Button variant="outline-primary" className="me-2">
                <FaShare className="me-1" /> Chia sẻ
              </Button>
              <Button variant="outline-primary">
                So sánh
              </Button>
            </div>
            
            <div className="mb-4">
              <h5>Thông tin vận chuyển:</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><FaCheck className="text-success me-2" /> Miễn phí vận chuyển cho đơn hàng trên $50</li>
                <li className="mb-2"><FaCheck className="text-success me-2" /> Giao hàng trong 2-5 ngày làm việc</li>
                <li><FaCheck className="text-success me-2" /> Đổi trả miễn phí trong 30 ngày</li>
              </ul>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-5">
          <Col>
            <Tabs defaultActiveKey="description" className="mb-4">
              <Tab eventKey="description" title="Mô tả chi tiết">
                <Card className="shadow-sm">
                  <Card.Body>
                    <div dangerouslySetInnerHTML={{ __html: product.details }}></div>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="reviews" title={`Đánh giá (${reviews.length})`}>
                <Card className="shadow-sm">
                  <Card.Body>
                    {reviews.length > 0 ? (
                      <div>
                        {reviews.map((review) => (
                          <div key={review.id} className="border-bottom pb-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="mb-0">{review.name}</h5>
                              <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                            </div>
                            <div className="mb-2">
                              {renderStars(review.rating)}
                            </div>
                            <p>{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
                      </Alert>
                    )}
                    
                    <h5 className="mt-4">Viết đánh giá</h5>
                    {reviewSuccess && (
                      <Alert variant="success">
                        Cảm ơn bạn đã đánh giá sản phẩm! Đánh giá của bạn đã được gửi thành công.
                      </Alert>
                    )}
                    {reviewError && (
                      <Alert variant="danger">
                        {reviewError}
                      </Alert>
                    )}
                    <Form onSubmit={handleSubmitReview}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Tên của bạn</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={reviewForm.name}
                              onChange={handleReviewChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={reviewForm.email}
                              onChange={handleReviewChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Đánh giá</Form.Label>
                        <div className="mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star}
                              onClick={() => handleStarClick(star)}
                              style={{ cursor: 'pointer', fontSize: '1.5rem', color: star <= reviewStars ? '#ffc107' : '#e4e5e9', marginRight: '5px' }}
                            >
                              {star <= reviewStars ? <FaStar /> : <FaRegStar />}
                            </span>
                          ))}
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Nhận xét</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          placeholder="Nhập nhận xét của bạn"
                          name="comment"
                          value={reviewForm.comment}
                          onChange={handleReviewChange}
                          required
                        />
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={reviewSubmitting}
                      >
                        {reviewSubmitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Đang gửi...
                          </>
                        ) : 'Gửi đánh giá'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        
        <Row className="mt-5">
          <Col>
            <h3 className="mb-4">Sản phẩm liên quan</h3>
            <Row>
              {relatedProducts.map((relatedProduct) => (
                <Col lg={3} md={6} key={relatedProduct.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <Card.Img 
                        variant="top" 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        style={{ height: '180px', objectFit: 'contain', padding: '10px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/180x180?text=' + encodeURIComponent(relatedProduct.name);
                        }}
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '1rem' }}>
                        <Link to={`/products/${relatedProduct.id}`} className="text-decoration-none text-dark">
                          {relatedProduct.name}
                        </Link>
                      </Card.Title>
                      <div className="mb-2">
                        {renderStars(relatedProduct.averageRating)}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        {relatedProduct.discountPrice ? (
                          <div>
                            <span className="text-decoration-line-through text-muted">${relatedProduct.price}</span>
                            <br />
                            <span className="text-danger fw-bold">${relatedProduct.discountPrice}</span>
                          </div>
                        ) : (
                          <span className="fw-bold">${relatedProduct.price}</span>
                        )}
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            addToCart(relatedProduct, 1);
                            alert(`Đã thêm "${relatedProduct.name}" vào giỏ hàng!`);
                          }}
                        >
                          <FaShoppingCart />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default ProductDetail;