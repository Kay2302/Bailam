// src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Row, Col, Alert, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart, FaCreditCard, FaTag } from 'react-icons/fa';
import Nav from './Nav';
import Footer from './Footer';
import { useProduct } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart, getCartTotal } = useProduct();
  const { isAuthenticated } = useAuth();
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingCost, setShippingCost] = useState(5.99);
  const [loading, setLoading] = useState(false);

  // Tính toán tổng tiền khi giỏ hàng thay đổi
  useEffect(() => {
    const itemsTotal = getCartTotal();
    
    setSubTotal(itemsTotal);
    setTotal(itemsTotal + shippingCost - discount);
  }, [cart, discount, shippingCost, getCartTotal]);

  // Cập nhật số lượng sản phẩm
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    
    // Tìm sản phẩm để kiểm tra kho hàng
    const item = cart.find(item => item.id === id);
    if (item && newQuantity > item.stock) {
      alert(`Chỉ còn ${item.stock} sản phẩm trong kho!`);
      setLoading(false);
      return;
    }
    
    try {
      await updateCartItem(id, newQuantity);
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      alert('Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      setLoading(true);
      try {
        await removeFromCart(id);
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Áp dụng mã giảm giá
  const applyCoupon = async () => {
    if (!couponCode) {
      setCouponError('Vui lòng nhập mã giảm giá');
      return;
    }
    
    setLoading(true);
    setCouponError('');
    
    try {
      // Gọi API để kiểm tra và áp dụng mã giảm giá
      const response = await fetch(`http://localhost:5000/api/coupons/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code: couponCode })
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        const discountAmount = subTotal * (data.discount / 100);
        setDiscount(discountAmount);
        setCouponApplied(true);
      } else {
        // Nếu không có API hoặc API không trả về kết quả hợp lệ, sử dụng mã giảm giá mẫu
        if (couponCode === 'SALE10') {
          const discountAmount = subTotal * 0.1;
          setDiscount(discountAmount);
          setCouponApplied(true);
        } else if (couponCode === 'SALE20') {
          const discountAmount = subTotal * 0.2;
          setDiscount(discountAmount);
          setCouponApplied(true);
        } else if (couponCode === 'FREESHIP') {
          setShippingCost(0);
          setCouponApplied(true);
        } else {
          setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        }
      }
    } catch (error) {
      console.error('Lỗi khi áp dụng mã giảm giá:', error);
      setCouponError('Không thể áp dụng mã giảm giá. Vui lòng thử lại.');
      
      // Fallback sử dụng mã giảm giá mẫu nếu không kết nối được API
      if (couponCode === 'SALE10') {
        const discountAmount = subTotal * 0.1;
        setDiscount(discountAmount);
        setCouponApplied(true);
      } else if (couponCode === 'SALE20') {
        const discountAmount = subTotal * 0.2;
        setDiscount(discountAmount);
        setCouponApplied(true);
      } else if (couponCode === 'FREESHIP') {
        setShippingCost(0);
        setCouponApplied(true);
      } else {
        setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi phương thức vận chuyển
  const handleShippingChange = (e) => {
    const method = e.target.value;
    setShippingMethod(method);
    
    switch(method) {
      case 'express':
        setShippingCost(12.99);
        break;
      case 'overnight':
        setShippingCost(19.99);
        break;
      case 'standard':
      default:
        setShippingCost(5.99);
    }
  };

// Thay đổi phần xử lý checkout để đồng bộ với API

const handleCheckout = () => {
  if (cart.length === 0) {
    alert('Giỏ hàng của bạn đang trống!');
    return;
  }
  
  if (!isAuthenticated) {
    // Lưu thông tin đơn hàng vào sessionStorage để khôi phục sau khi đăng nhập
    sessionStorage.setItem('pendingCheckout', JSON.stringify({
      items: cart,
      subTotal,
      discount,
      shippingCost,
      total,
      shippingMethod
    }));
    
    if (window.confirm('Bạn cần đăng nhập để tiếp tục thanh toán. Chuyển đến trang đăng nhập?')) {
      navigate('/login', { state: { returnUrl: '/checkout' } });
    }
    return;
  }
  
  try {
    // Chuẩn bị thông tin đơn hàng
    const orderSummary = {
      items: cart.map(item => ({
        id: item.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        discountPrice: item.discountPrice || item.discount_price,
        quantity: item.quantity,
        image: item.image,
        stock: item.stock
      })),
      subTotal,
      discount,
      shippingCost,
      total,
      shippingMethod
    };
    
    // Lưu vào sessionStorage để sử dụng ở trang Checkout
    sessionStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    
    // Chuyển đến trang thanh toán
    navigate('/checkout');
  } catch (error) {
    console.error('Error during checkout preparation:', error);
    alert('Có lỗi xảy ra khi chuẩn bị thanh toán. Vui lòng thử lại.');
  }
};

  return (
    <>
      <Nav />
      <Container className="py-5 mt-5">
        <h2 className="mb-4">
          <FaShoppingCart className="me-2" />
          Giỏ hàng của bạn
        </h2>
        
        {cart.length === 0 ? (
          <Row>
            <Col>
              <Alert variant="info">
                <div className="text-center py-4">
                  <FaShoppingCart size={50} className="mb-3 text-muted" />
                  <h4>Giỏ hàng của bạn đang trống</h4>
                  <p className="mb-4">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
                  <Link to="/products" className="btn btn-primary">
                    <FaArrowLeft className="me-2" /> Tiếp tục mua sắm
                  </Link>
                </div>
              </Alert>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th style={{ width: '50%' }}>Sản phẩm</th>
                          <th style={{ width: '15%' }}>Giá</th>
                          <th style={{ width: '20%' }}>Số lượng</th>
                          <th style={{ width: '15%' }}>Tổng</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                  className="me-3"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                  }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.name}</h6>
                                  {item.discountPrice && (
                                    <span className="badge bg-danger">GIẢM GIÁ</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              {item.discountPrice ? (
                                <>
                                  <span className="text-decoration-line-through text-muted">${item.price}</span>
                                  <br />
                                  <span className="text-danger">${item.discountPrice}</span>
                                </>
                              ) : (
                                <span>${item.price}</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || loading}
                                >
                                  <FaMinus />
                                </Button>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  max={item.stock}
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="mx-2 text-center"
                                  style={{ width: '60px' }}
                                  disabled={loading}
                                />
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock || loading}
                                >
                                  <FaPlus />
                                </Button>
                              </div>
                              {item.quantity >= item.stock && (
                                <small className="text-danger d-block mt-1">Đạt giới hạn kho</small>
                              )}
                            </td>
                            <td className="fw-bold">
                              ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                            </td>
                            <td>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={loading}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  <div className="d-flex justify-content-between mt-3">
                    <Link to="/products" className="btn btn-outline-primary">
                      <FaArrowLeft className="me-2" /> Tiếp tục mua sắm
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => {
                        if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
                          clearCart();
                        }
                      }}
                      disabled={loading}
                    >
                      <FaTrash className="me-2" /> Xóa giỏ hàng
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">
                    <FaTag className="me-2" /> Mã giảm giá
                  </h5>
                  
                  {couponApplied ? (
                    <Alert variant="success">
                      Mã giảm giá <strong>{couponCode}</strong> đã được áp dụng!
                    </Alert>
                  ) : (
                    <>
                      <InputGroup className="mb-3">
                        <Form.Control
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          disabled={loading}
                        />
                        <Button 
                          variant="primary" 
                          onClick={applyCoupon}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Đang xử lý...
                            </>
                          ) : 'Áp dụng'}
                        </Button>
                      </InputGroup>
                      
                      {couponError && (
                        <Alert variant="danger">{couponError}</Alert>
                      )}
                      
                      <div className="text-muted small">
                        <p className="mb-1">Mã giảm giá mẫu:</p>
                        <ul className="ps-3">
                          <li>SALE10 - Giảm 10% tổng đơn hàng</li>
                          <li>SALE20 - Giảm 20% tổng đơn hàng</li>
                          <li>FREESHIP - Miễn phí vận chuyển</li>
                        </ul>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Phương thức vận chuyển</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Check
                      type="radio"
                      id="shipping-standard"
                      label="Tiêu chuẩn (3-5 ngày) - $5.99"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={handleShippingChange}
                      className="mb-2"
                      disabled={loading}
                    />
                    <Form.Check
                      type="radio"
                      id="shipping-express"
                      label="Nhanh (2-3 ngày) - $12.99"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={handleShippingChange}
                      className="mb-2"
                      disabled={loading}
                    />
                    <Form.Check
                      type="radio"
                      id="shipping-overnight"
                      label="Hỏa tốc (1 ngày) - $19.99"
                      name="shippingMethod"
                      value="overnight"
                      checked={shippingMethod === 'overnight'}
                      onChange={handleShippingChange}
                      disabled={loading}
                    />
                  </Form>
                </Card.Body>
              </Card>
              
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Tóm tắt đơn hàng</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Giảm giá:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Tổng cộng:</span>
                    <span className="fw-bold fs-5">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-100" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-2" /> Thanh toán
                      </>
                    )}
                  </Button>
                  
                  <div className="mt-3 text-center">
                    <img 
                      src="/assets/img/payment-methods.png" 
                      alt="Payment Methods" 
                      style={{ maxWidth: '100%', height: 'auto' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/250x40?text=Payment+Methods';
                      }}
                    />
                    <p className="text-muted small mt-2">
                      Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau
                    </p>
                  </div>
                </Card.Body>
              </Card>
              
              <div className="mt-4">
                <Alert variant="info">
                  <div className="d-flex">
                    <div className="me-3">
                      <FaShoppingCart size={24} />
                    </div>
                    <div>
                      <strong>Chính sách mua hàng</strong>
                      <p className="mb-0 small">Miễn phí đổi trả trong vòng 30 ngày. Bảo hành sản phẩm lên đến 12 tháng.</p>
                    </div>
                  </div>
                </Alert>
              </div>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Cart;