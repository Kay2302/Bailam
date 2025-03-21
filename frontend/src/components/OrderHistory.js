// src/components/OrderHistory.js
import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Card, Accordion, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../services/api';

// Hàm tiện ích để định dạng số tiền
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00';
  const number = parseFloat(value);
  return isNaN(number) ? '0.00' : number.toFixed(2);
};

function OrderHistory() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra đăng nhập và lấy đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      // Nếu chưa đăng nhập, chuyển về trang đăng nhập
      if (!isAuthenticated || !currentUser) {
        navigate('/login', { state: { returnUrl: '/order-history' } });
        return;
      }
      
      setLoading(true);
      
      try {
        let userOrders = [];
        
        // Thử lấy đơn hàng từ API
        try {
          const response = await orderApi.getUserOrders(currentUser.id);
          userOrders = response.data || [];
          console.log('Orders from API:', userOrders);
        } catch (apiError) {
          console.error('Error fetching orders from API:', apiError);
        }
        
        // Lấy thêm đơn hàng từ localStorage
        const userOrderKey = `userOrders_${currentUser.id}`;
        const localOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
        console.log('Orders from localStorage:', localOrders);
        
        // Kết hợp đơn hàng từ API và localStorage, đảm bảo không trùng lặp theo ID
        const orderIds = new Set(userOrders.map(order => order.id));
        for (const localOrder of localOrders) {
          if (!orderIds.has(localOrder.id)) {
            userOrders.push(localOrder);
            orderIds.add(localOrder.id);
          }
        }
        
        // Nếu không có đơn hàng nào, kiểm tra trong mockOrders
        if (userOrders.length === 0) {
          const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          const filteredMockOrders = mockOrders.filter(order => 
            order.user_id === currentUser.id || 
            order.customer_email === currentUser.email
          );
          userOrders = [...userOrders, ...filteredMockOrders];
        }
        
        // Sắp xếp đơn hàng theo thời gian tạo, mới nhất lên đầu
        userOrders.sort((a, b) => {
          const dateA = new Date(a.created_at || '1970-01-01');
          const dateB = new Date(b.created_at || '1970-01-01');
          return dateB - dateA;
        });
        
        console.log('Final orders to display:', userOrders);
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử đơn hàng:', err);
        setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
        
        // Sử dụng dữ liệu mẫu nếu API fail
        setOrders([
          {
            id: 123456,
            created_at: '2023-05-15',
            status: 'delivered',
            total_amount: 1299.99,
            items: [
              { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 1199.99, quantity: 1, image: '/assets/img/portfolio/thumbnails/15.jpg' }
            ],
            shipping_address: '123 Main St, City, Country',
            shipping_method: 'Express',
            payment_method: 'Credit Card'
          },
          {
            id: 123457,
            created_at: '2023-06-10',
            status: 'shipped',
            total_amount: 1049.99,
            items: [
              { id: 2, name: 'MacBook Pro M3 14 inch', price: 1849.99, quantity: 1, image: '/assets/img/portfolio/thumbnails/lab.jpg' },
              { id: 3, name: 'AirPods Pro 2', price: 249.99, quantity: 1, image: '/assets/img/portfolio/thumbnails/pod.jpg' }
            ],
            shipping_address: '456 Oak St, Another City, Country',
            shipping_method: 'Standard',
            payment_method: 'PayPal'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Cuộn lên đầu trang
    window.scrollTo(0, 0);
  }, [isAuthenticated, currentUser, navigate]);

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      let cancelSuccess = false;
      
      // Thử gọi API để hủy đơn hàng
      try {
        await orderApi.updateStatus(orderId, 'cancelled');
        cancelSuccess = true;
      } catch (apiError) {
        console.error('Lỗi khi hủy đơn hàng qua API:', apiError);
        
        // Nếu API thất bại, cập nhật trong localStorage
        try {
          // Cập nhật trong userOrders
          const userOrderKey = `userOrders_${currentUser.id}`;
          const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
          const updatedUserOrders = userOrders.map(order => 
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          );
          localStorage.setItem(userOrderKey, JSON.stringify(updatedUserOrders));
          
          // Cập nhật trong mockOrders
          const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
          const updatedMockOrders = mockOrders.map(order => 
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          );
          localStorage.setItem('mockOrders', JSON.stringify(updatedMockOrders));
          
          cancelSuccess = true;
        } catch (localStorageError) {
          console.error('Lỗi khi cập nhật trong localStorage:', localStorageError);
        }
      }
      
      if (cancelSuccess) {
        // Cập nhật state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        
        alert('Đơn hàng đã được hủy thành công!');
      } else {
        throw new Error('Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Render trạng thái đơn hàng
  const renderOrderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
      case 'processing':
        return <Badge bg="info">Đang xử lý</Badge>;
      case 'shipped':
        return <Badge bg="primary">Đang giao hàng</Badge>;
      case 'delivered':
        return <Badge bg="success">Đã giao hàng</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status || 'Không xác định'}</Badge>;
    }
  };

  // Hiển thị trạng thái loading
  if (loading && orders.length === 0) {
    return (
      <>
        <Nav />
        <Container className="py-5 mt-5">
          <h2 className="mb-4">Lịch Sử Đơn Hàng</h2>
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </Spinner>
            <p className="mt-3">Đang tải dữ liệu đơn hàng...</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Container className="py-5 mt-5">
        <h2 className="mb-4">Lịch Sử Đơn Hàng</h2>
        
        {error && (
          <Alert variant="danger">{error}</Alert>
        )}
        
        {orders.length === 0 ? (
          <Card className="shadow-sm text-center py-5">
            <Card.Body>
              <i className="bi bi-bag-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              <h4 className="mt-3">Bạn chưa có đơn hàng nào</h4>
              <p className="text-muted">Hãy mua sắm và quay lại đây để xem lịch sử đơn hàng của bạn.</p>
              <Link to="/products" className="btn btn-primary mt-3">
                Mua sắm ngay
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Accordion defaultActiveKey={orders[0]?.id?.toString()} className="shadow-sm">
            {orders.map((order) => (
              <Accordion.Item key={order.id} eventKey={order.id.toString()}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <div>
                      <span className="fw-bold">Đơn hàng #{order.id}</span>
                      <span className="text-muted ms-3">
                        {order.created_at 
                          ? new Date(order.created_at).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="me-3">${formatCurrency(order.total_amount)}</span>
                      {renderOrderStatus(order.status)}
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="mb-4">
                    <h5 className="mb-3">Chi tiết đơn hàng</h5>
                    <Table responsive borderless className="align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items && order.items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                  className="me-3"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                                  }}
                                />
                                <div>
                                  <Link to={`/products/${item.product_id || item.id}`} className="text-decoration-none">
                                    {item.name}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td>${formatCurrency(item.price)}</td>
                            <td>{item.quantity}</td>
                            <td>${formatCurrency(parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10))}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                          <td className="fw-bold">${formatCurrency(order.total_amount)}</td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h5 className="mb-3">Thông tin giao hàng</h5>
                      <Card className="bg-light">
                        <Card.Body>
                          <p className="mb-1"><strong>Địa chỉ:</strong> {order.shipping_address || 'N/A'}</p>
                          <p className="mb-0"><strong>Phương thức:</strong> {order.shipping_method || 'N/A'}</p>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h5 className="mb-3">Thông tin thanh toán</h5>
                      <Card className="bg-light">
                        <Card.Body>
                          <p className="mb-0"><strong>Phương thức:</strong> {order.payment_method || 'N/A'}</p>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="text-end mt-3">
                    {order.status === 'delivered' && (
                      <Button variant="outline-primary" className="me-2">
                        Đánh giá sản phẩm
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <Button 
                        variant="outline-danger" 
                        className="me-2"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={loading}
                      >
                        {loading ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                      </Button>
                    )}
                    <Button variant="primary">
                      Liên hệ hỗ trợ
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default OrderHistory;