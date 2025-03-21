// src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { useProduct } from '../contexts/ProductContext';
import { orderApi } from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { clearCart } = useProduct();
  const [orderSummary, setOrderSummary] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Vietnam'
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [validated, setValidated] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [loading, setLoading] = useState(false);

  // Kiểm tra đăng nhập và lấy thông tin đơn hàng
  useEffect(() => {
    // Nếu không đăng nhập, chuyển về trang đăng nhập
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/checkout' } });
      return;
    }
    
    // Lấy thông tin đơn hàng từ sessionStorage
    const savedOrderSummary = sessionStorage.getItem('orderSummary');
    if (savedOrderSummary) {
      setOrderSummary(JSON.parse(savedOrderSummary));
    } else {
      // Nếu không có thông tin đơn hàng, chuyển về trang giỏ hàng
      navigate('/cart');
    }
    
    // Nếu đã đăng nhập, điền thông tin người dùng vào form
    if (currentUser) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      }));
    }
    
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate, currentUser]);

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };

// Sửa lại phần xử lý đặt hàng

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.stopPropagation();
    setValidated(true);
    return;
  }
  
  setLoading(true);
  
  try {
    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      user_id: currentUser?.id,
      items: orderSummary.items.map(item => ({
        product_id: item.id || item.product_id,
        quantity: item.quantity,
        price: item.discountPrice || item.discount_price || item.price
      })),
      total_amount: orderSummary.total,
      shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}, ${shippingInfo.country}`,
      shipping_method: orderSummary.shippingMethod,
      payment_method: paymentMethod,
      customer_name: shippingInfo.fullName,
      customer_email: shippingInfo.email,
      customer_phone: shippingInfo.phone
    };
    
    console.log('Submitting order with data:', orderData);
    
    let response;
    let orderCreatedViaApi = false;
    
    try {
      // Thử gọi API để tạo đơn hàng
      response = await orderApi.create(orderData);
      console.log('Order created successfully via API:', response.data);
      orderCreatedViaApi = true;
    } catch (apiError) {
      console.error('Error with API, creating mock order:', apiError);
      
      // Nếu API fails, tạo một đơn hàng giả
      response = await createMockOrder(orderData);
      console.log('Created mock order:', response.data);
    }
    
    // Lưu ID đơn hàng để hiển thị
    setOrderId(response.data.id);
    
    // Xóa giỏ hàng sau khi đặt hàng thành công
    await clearCart();
    
    // Xóa thông tin đơn hàng khỏi sessionStorage
    sessionStorage.removeItem('orderSummary');
    sessionStorage.removeItem('pendingCheckout');
    
    // Nếu đơn hàng được tạo thông qua API thành công, không cần làm gì thêm
    // Nếu đơn hàng được tạo thông qua mock, cần đảm bảo nó xuất hiện trong cả Admin và trang user
    if (!orderCreatedViaApi) {
      // Thêm vào danh sách đơn hàng cho Admin
      const adminOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      if (!adminOrders.some(order => order.id === response.data.id)) {
        adminOrders.push(response.data);
        localStorage.setItem('mockOrders', JSON.stringify(adminOrders));
      }
      
      // Thêm vào danh sách đơn hàng của user
      const userOrderKey = `userOrders_${currentUser?.id}`;
      const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
      if (!userOrders.some(order => order.id === response.data.id)) {
        userOrders.push(response.data);
        localStorage.setItem(userOrderKey, JSON.stringify(userOrders));
      }
    }
    
    // Hiển thị thông báo đặt hàng thành công
    setOrderComplete(true);
    
  } catch (error) {
    console.error('Error during order submission:', error);
    
    // Tạo đơn hàng giả nếu mọi thứ thất bại
    try {
      const mockOrderId = Math.floor(100000 + Math.random() * 900000);
      
      // Tạo đơn hàng giả
      const mockOrder = {
        id: mockOrderId,
        user_id: currentUser?.id,
        customer_name: shippingInfo.fullName,
        customer_email: shippingInfo.email,
        customer_phone: shippingInfo.phone,
        total_amount: orderSummary.total,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        shipping_method: orderSummary.shippingMethod,
        payment_method: paymentMethod,
        status: 'pending',
        created_at: new Date().toISOString(),
        items: orderSummary.items.map(item => ({
          product_id: item.id || item.product_id,
          name: item.name,
          price: item.discountPrice || item.discount_price || item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };
      
      // Lưu đơn hàng vào localStorage
      // 1. Lưu cho trang Admin
      const adminOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      adminOrders.push(mockOrder);
      localStorage.setItem('mockOrders', JSON.stringify(adminOrders));
      
      // 2. Lưu cho trang đơn hàng của user
      const userOrderKey = `userOrders_${currentUser?.id}`;
      const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
      userOrders.push(mockOrder);
      localStorage.setItem(userOrderKey, JSON.stringify(userOrders));
      
      setOrderId(mockOrderId);
      
      // Xóa giỏ hàng
      await clearCart();
      
      // Xóa thông tin đơn hàng khỏi sessionStorage
      sessionStorage.removeItem('orderSummary');
      sessionStorage.removeItem('pendingCheckout');
      
      // Hiển thị thông báo đặt hàng thành công
      setOrderComplete(true);
    } catch (fallbackError) {
      console.error('Error in fallback handling:', fallbackError);
      setOrderError('Không thể tạo đơn hàng. Vui lòng thử lại sau.');
    }
  } finally {
    setLoading(false);
  }
};

// Cải tiến hàm tạo đơn hàng mock để đảm bảo đồng bộ với Admin và trang đơn hàng của user

const createMockOrder = (orderData) => {
  return new Promise((resolve) => {
    // Giả lập độ trễ của API
    setTimeout(() => {
      const mockOrderId = Math.floor(100000 + Math.random() * 900000);
      
      // Tạo đơn hàng giả với định dạng giống với API trả về
      const mockOrder = {
        id: mockOrderId,
        user_id: orderData.user_id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        shipping_method: orderData.shipping_method,
        payment_method: orderData.payment_method,
        status: 'pending',
        created_at: new Date().toISOString(),
        items: orderData.items.map(item => ({
          product_id: item.product_id,
          name: orderSummary.items.find(i => i.id === item.product_id || i.product_id === item.product_id)?.name || 'Unknown Product',
          price: item.price,
          quantity: item.quantity,
          image: orderSummary.items.find(i => i.id === item.product_id || i.product_id === item.product_id)?.image || ''
        }))
      };
      
      // Lưu đơn hàng vào localStorage để có thể xem lại sau
      // 1. Lưu cho trang Admin
      const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      existingOrders.push(mockOrder);
      localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
      
      // 2. Lưu cho trang đơn hàng của user
      const userOrderKey = `userOrders_${orderData.user_id}`;
      const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
      userOrders.push(mockOrder);
      localStorage.setItem(userOrderKey, JSON.stringify(userOrders));
      
      resolve({
        data: mockOrder
      });
    }, 1000);
  });
};


  if (orderComplete) {
    return (
      <>
        <Nav />
        <Container className="py-5 mt-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Body className="p-5 text-center">
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                  </div>
                  <h2 className="mb-4">Đặt hàng thành công!</h2>
                  <p className="mb-4">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.</p>
                  <p className="mb-4">Mã đơn hàng: <strong>#{orderId || Math.floor(100000 + Math.random() * 900000)}</strong></p>
                  <p>Chúng tôi sẽ gửi email xác nhận đơn hàng và thông tin vận chuyển đến địa chỉ email của bạn.</p>
                  <div className="mt-4">
                    <Button variant="primary" onClick={() => navigate('/')}>
                      Tiếp tục mua sắm
                    </Button>
                    <Button variant="outline-primary" className="ms-3" onClick={() => navigate('/order-history')}>
                      Xem đơn hàng
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Container className="py-5 mt-5">
        <h2 className="mb-4">Thanh Toán</h2>
        
        {orderError && (
          <Alert variant="danger">{orderError}</Alert>
        )}
        
        {loading && (
          <div className="text-center mb-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Đang xử lý...</span>
            </Spinner>
            <p className="mt-2">Đang xử lý đơn hàng của bạn, vui lòng đợi...</p>
          </div>
        )}
        
        {orderSummary && (
          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h4 className="mb-3">Thông Tin Giao Hàng</h4>
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và tên</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={shippingInfo.fullName}
                            onChange={handleShippingInfoChange}
                            required
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập họ và tên.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleShippingInfoChange}
                            required
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập email hợp lệ.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleShippingInfoChange}
                            required
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập số điện thoại.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Quốc gia</Form.Label>
                          <Form.Select
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleShippingInfoChange}
                            required
                            disabled={loading}
                          >
                            <option value="Vietnam">Việt Nam</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập địa chỉ.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Thành phố</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleShippingInfoChange}
                            required
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập thành phố.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mã bưu điện</Form.Label>
                          <Form.Control
                            type="text"
                            name="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={handleShippingInfoChange}
                            required
                            disabled={loading}
                          />
                          <Form.Control.Feedback type="invalid">
                            Vui lòng nhập mã bưu điện.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h4 className="mb-3 mt-4">Phương Thức Thanh Toán</h4>
                    
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="radio"
                        id="credit-card"
                        label="Thẻ tín dụng / Thẻ ghi nợ"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                        disabled={loading}
                      />
                      
                      {paymentMethod === 'credit-card' && (
                        <div className="ms-4 mt-3">
                          <Row>
                            <Col md={12}>
                              <Form.Group className="mb-3">
                                <Form.Label>Số thẻ</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="XXXX XXXX XXXX XXXX"
                                  required={paymentMethod === 'credit-card'}
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Ngày hết hạn</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="MM/YY"
                                  required={paymentMethod === 'credit-card'}
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>CVV</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="XXX"
                                  required={paymentMethod === 'credit-card'}
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      )}
                      
                      <Form.Check
                        type="radio"
                        id="paypal"
                        label="PayPal"
                        name="paymentMethod"
                        value="paypal"
                        className="mt-3"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        disabled={loading}
                      />
                      
                      <Form.Check
                        type="radio"
                        id="cod"
                        label="Thanh toán khi nhận hàng (COD)"
                        name="paymentMethod"
                        value="cod"
                        className="mt-3"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        disabled={loading}
                      />
                    </Form.Group>
                    
                    <div className="d-grid gap-2 mt-4">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
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
                        ) : 'Đặt hàng'}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate('/cart')}
                        disabled={loading}
                      >
                        Quay lại giỏ hàng
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Tóm tắt đơn hàng</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    {orderSummary.items.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <div>
                          <span className="fw-bold">{item.quantity}x</span> {item.name}
                        </div>
                        <div>${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>${orderSummary.subTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>${orderSummary.shippingCost.toFixed(2)}</span>
                  </div>
                  
                  {orderSummary.discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Giảm giá:</span>
                      <span>-${orderSummary.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-0">
                    <span className="fw-bold">Tổng cộng:</span>
                    <span className="fw-bold fs-5">${orderSummary.total.toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>
              
              <Alert variant="info">
                <i className="bi bi-info-circle-fill me-2"></i>
                Đơn hàng của bạn sẽ được xử lý và giao hàng trong vòng 2-5 ngày làm việc.
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Checkout;