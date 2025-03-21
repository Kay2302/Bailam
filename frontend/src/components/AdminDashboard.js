// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Table, Badge, Modal, Form, Tabs, Tab, Alert, Spinner, Dropdown, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaStar, FaComment, FaSearch, FaEye, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaSignOutAlt, FaCalendarAlt, FaUser, FaFilter, FaBox, FaShoppingCart, FaUsers, FaMoneyBillWave, FaTags, FaTruck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { productApi, reviewApi, orderApi, categoryApi, userApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00';
  const number = parseFloat(value);
  return isNaN(number) ? '0.00' : number.toFixed(2);
};


function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, currentUser, userRole } = useAuth();
  
  // State quản lý dữ liệu
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  
  // State quản lý UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProductForReviews, setSelectedProductForReviews] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [showProductPreviewModal, setShowProductPreviewModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State cho quản lý danh mục
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  // Form state cho sản phẩm
  const [formData, setFormData] = useState({
    name: '',
    category: '', 
    description: '',
    details: '',
    image: '',
    price: '',
    discountPrice: '',
    stock: '',
    status: 'active'
  });  
  // Kiểm tra quyền admin và lấy dữ liệu
  useEffect(() => {
    // Kiểm tra nếu không phải admin thì chuyển hướng
    if (!loading && userRole !== 'admin') {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Tải danh mục
        try {
          const categoriesResponse = await categoryApi.getAll();
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error('Error fetching categories:', error);
          // Tạo dữ liệu mẫu nếu API thất bại
          const sampleCategories = [
            { id: 1, name: 'Điện thoại', description: 'Điện thoại di động', product_count: 2 },
            { id: 2, name: 'Laptop', description: 'Máy tính xách tay', product_count: 2 },
            { id: 3, name: 'Tablet', description: 'Máy tính bảng', product_count: 1 },
            { id: 4, name: 'Tai nghe', description: 'Tai nghe không dây và có dây', product_count: 1 },
            { id: 5, name: 'Đồng hồ thông minh', description: 'Đồng hồ thông minh và thiết bị đeo', product_count: 1 },
            { id: 6, name: 'Loa', description: 'Loa thông minh và bluetooth', product_count: 1 },
            { id: 7, name: 'Phụ kiện', description: 'Phụ kiện điện tử đa dạng', product_count: 1 },
            { id: 8, name: 'Máy ảnh', description: 'Máy ảnh kỹ thuật số', product_count: 1 }
          ];
          setCategories(sampleCategories);
        }
        
        // Tải sản phẩm
        try {
          const productsResponse = await productApi.getAll();
          setProducts(productsResponse.data || []);
        } catch (error) {
          console.error('Error fetching products:', error);
          // Tạo dữ liệu mẫu nếu API thất bại
          const sampleProducts = [
            {
              id: 1,
              name: 'iPhone 15 Pro Max 256GB',
              category: 'Điện thoại',
              category_id: 1,
              description: 'Điện thoại thông minh cao cấp với hiệu năng mạnh mẽ',
              details: '<ul><li>Màn hình: 6.7 inch, Super Retina XDR OLED, 120Hz</li><li>CPU: Apple A17 Pro, 6 nhân</li></ul>',
              image: '/assets/img/portfolio/thumbnails/15.jpg',
              price: 1299.99,
              discount_price: 1199.99,
              stock: 50,
              status: 'active',
              reviewCount: 28,
              averageRating: 4.7
            },
            {
              id: 2,
              name: 'MacBook Pro M3 14 inch',
              category: 'Laptop',
              category_id: 2,
              description: 'Laptop mỏng nhẹ, mạnh mẽ với chip M3',
              details: '<ul><li>Màn hình: 14 inch, Liquid Retina XDR</li><li>CPU: Apple M3 Pro</li></ul>',
              image: '/assets/img/portfolio/thumbnails/lab.jpg',
              price: 1999.99,
              discount_price: 1849.99,
              stock: 30,
              status: 'active',
              reviewCount: 15,
              averageRating: 4.9
            },
            {
              id: 3,
              name: 'AirPods Pro 2',
              category: 'Tai nghe',
              category_id: 4,
              description: 'Tai nghe không dây cao cấp với khả năng chống ồn',
              details: '<ul><li>Loại: Tai nghe không dây in-ear</li><li>Chip: H2</li></ul>',
              image: '/assets/img/portfolio/thumbnails/pod.jpg',
              price: 249.99,
              discount_price: null,
              stock: 100,
              status: 'active',
              reviewCount: 22,
              averageRating: 4.6
            },
            {
              id: 4,
              name: 'iPad Pro M2 11-inch',
              category: 'Tablet',
              category_id: 3,
              description: 'Máy tính bảng mạnh mẽ với màn hình Liquid Retina',
              details: '<ul><li>Màn hình: 11 inch, Liquid Retina</li><li>CPU: Apple M2</li></ul>',
              image: '/assets/img/portfolio/thumbnails/ipad.jpg',
              price: 799.99,
              discount_price: 749.99,
              stock: 45,
              status: 'active',
              reviewCount: 18,
              averageRating: 4.8
            }
          ];
          setProducts(sampleProducts);
        }
        
        // Tải đơn hàng
        try {
          const ordersResponse = await orderApi.getAll();
          setOrders(ordersResponse.data || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
          // Tạo đơn hàng mẫu nếu API thất bại
          const sampleOrders = [
            {
              id: 100001,
              customer_name: 'Nguyễn Văn A',
              customer_email: 'nguyenvana@example.com',
              customer_phone: '0901234567',
              total_amount: 1299.99,
              status: 'delivered',
              created_at: '2023-06-15T08:30:00Z',
              shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
              items: [
                {
                  product_id: 1,
                  name: 'iPhone 15 Pro Max 256GB',
                  price: 1299.99,
                  quantity: 1,
                  image: '/assets/img/portfolio/thumbnails/15.jpg'
                }
              ]
            },
            {
              id: 100002,
              customer_name: 'Trần Thị B',
              customer_email: 'tranthib@example.com',
              customer_phone: '0909876543',
              total_amount: 1999.99,
              status: 'shipped',
              created_at: '2023-06-18T10:15:00Z',
              shipping_address: '456 Đường XYZ, Quận 2, TP.HCM',
              items: [
                {
                  product_id: 2,
                  name: 'MacBook Pro M3 14 inch',
                  price: 1999.99,
                  quantity: 1,
                  image: '/assets/img/portfolio/thumbnails/lab.jpg'
                }
              ]
            },
            {
              id: 100003,
              customer_name: 'Lê Văn C',
              customer_email: 'levanc@example.com',
              customer_phone: '0912345678',
              total_amount: 249.99,
              status: 'pending',
              created_at: '2023-06-20T14:45:00Z',
              shipping_address: '789 Đường LMN, Quận 3, TP.HCM',
              items: [
                {
                  product_id: 3,
                  name: 'AirPods Pro 2',
                  price: 249.99,
                  quantity: 1,
                  image: '/assets/img/portfolio/thumbnails/pod.jpg'
                }
              ]
            }
          ];
          setOrders(sampleOrders);
        }
        
        // Tải đánh giá
        try {
          const reviewsResponse = await reviewApi.getAll();
          setReviews(reviewsResponse.data || []);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          // Tạo đánh giá mẫu nếu API thất bại
          const sampleReviews = [
            {
              id: 1,
              product_id: 1,
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@example.com',
              comment: 'iPhone 15 Pro Max có camera rất tốt, chụp đêm rõ nét!',
              rating: 5,
              date: '2023-05-15',
              productName: 'iPhone 15 Pro Max 256GB'
            },
            {
              id: 2,
              product_id: 1,
              name: 'Trần Thị B',
              email: 'tranthib@example.com',
              comment: 'Pin trâu, dùng cả ngày không lo hết pin.',
              rating: 4,
              date: '2023-05-20',
              productName: 'iPhone 15 Pro Max 256GB'
            },
            {
              id: 3,
              product_id: 2,
              name: 'Lê Văn C',
              email: 'levanc@example.com',
              comment: 'MacBook Pro chạy rất mượt, màn hình đẹp, pin trâu.',
              rating: 5,
              date: '2023-06-01',
              productName: 'MacBook Pro M3 14 inch'
            }
          ];
          setReviews(sampleReviews);
        }
        
        // Tải khách hàng
        try {
          const customersResponse = await orderApi.getCustomers();
          setCustomers(customersResponse.data || []);
        } catch (error) {
          console.error('Error fetching customers:', error);
          // Tạo khách hàng mẫu nếu API thất bại
          const sampleCustomers = [
            {
              id: 1,
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@example.com',
              phone: '0901234567',
              created_at: '2023-01-15',
              order_count: 3,
              total_spent: 2500.50
            },
            {
              id: 2,
              name: 'Trần Thị B',
              email: 'tranthib@example.com',
              phone: '0909876543',
              created_at: '2023-02-20',
              order_count: 2,
              total_spent: 1800.75
            },
            {
              id: 3,
              name: 'Lê Văn C',
              email: 'levanc@example.com',
              phone: '0912345678',
              created_at: '2023-03-10',
              order_count: 1,
              total_spent: 500.25
            }
          ];
          setCustomers(sampleCustomers);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate, userRole, loading]);
    
  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hiển thị thông báo thành công
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Hiển thị thông báo lỗi
  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

// Lọc danh sách sản phẩm theo từ khóa, danh mục và trạng thái
const getFilteredProducts = () => {
  return products.filter(product => {
    // Lọc theo từ khóa
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo danh mục
    const matchesCategory = filterCategory ? product.category_id == filterCategory : true;
    
    // Lọc theo trạng thái
    const matchesStatus = filterStatus ? product.status === filterStatus : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};

// Xử lý thêm sản phẩm mới
const handleAddProduct = async () => {
  // Kiểm tra dữ liệu
  console.log('Form data:', formData); // Thêm dòng này để debug

  if (!formData.name || !formData.category || !formData.description || !formData.details || !formData.image || !formData.price || !formData.stock) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }
  
  try {
    setLoading(true);
    
    // Chuẩn bị dữ liệu sản phẩm
    const productData = {
      name: formData.name,
      category_id: parseInt(formData.category), // Sửa từ category_id thành category
      description: formData.description,
      details: formData.details,
      image: formData.image,
      price: parseFloat(formData.price),
      discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null, // Sửa từ discount_price thành discountPrice
      stock: parseInt(formData.stock),
      status: formData.status
    };
    
    // Gọi API để tạo sản phẩm mới
    const response = await productApi.create(productData);
    
    // Thêm sản phẩm mới vào danh sách
    setProducts([...products, response.data]);
    
    // Đóng form và hiển thị thông báo
    setShowAddForm(false);
    resetForm();
    showSuccess('Thêm sản phẩm mới thành công!');
  } catch (err) {
    console.error('Lỗi khi tạo sản phẩm mới:', err);
    showError('Không thể thêm sản phẩm. Vui lòng thử lại sau.');
  } finally {
    setLoading(false);
  }
    };

    // Mở form sửa sản phẩm
    const handleEditClick = (product) => {
      setCurrentProduct(product);
      
      // Điền thông tin sản phẩm vào form
      setFormData({
        name: product.name,
        category: product.category_id.toString(), // Sửa từ category_id thành category
        description: product.description,
        details: product.details,
        image: product.image,
        price: product.price.toString(),
        discountPrice: product.discount_price ? product.discount_price.toString() : '', // Sửa từ discount_price thành discountPrice
        stock: product.stock.toString(),
        status: product.status || 'active'
      });
      
      setShowEditForm(true);
    };

    // Xử lý cập nhật sản phẩm
    const handleUpdateProduct = async () => {
      // Kiểm tra dữ liệu
      if (!formData.name || !formData.category || !formData.description || !formData.details || !formData.image || !formData.price || !formData.stock) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      
      try {
        setLoading(true);
        
        // Chuẩn bị dữ liệu cập nhật
        const updateData = {
          name: formData.name,
          category_id: parseInt(formData.category), // Sửa từ category_id thành category
          description: formData.description,
          details: formData.details,
          image: formData.image,
          price: parseFloat(formData.price),
          discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null, // Sửa từ discount_price thành discountPrice
          stock: parseInt(formData.stock),
          status: formData.status
        };
        
        // Gọi API để cập nhật sản phẩm
        const response = await productApi.update(currentProduct.id, updateData);
        
        // Cập nhật sản phẩm trong danh sách
        setProducts(products.map(product => 
          product.id === currentProduct.id ? response.data : product
        ));
        
        // Đóng form và hiển thị thông báo
        setShowEditForm(false);
        resetForm();
        showSuccess('Cập nhật sản phẩm thành công!');
      } catch (err) {
        console.error('Lỗi khi cập nhật sản phẩm:', err);
        showError('Không thể cập nhật sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

  // Xử lý xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setLoading(true);
        
        // Gọi API để xóa sản phẩm
        await productApi.delete(id);
        
        // Xóa sản phẩm khỏi danh sách
        setProducts(products.filter(product => product.id !== id));
        
        showSuccess('Xóa sản phẩm thành công!');
      } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        showError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Xử lý xóa đánh giá
  const handleDeleteReview = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        setLoading(true);
        
        // Gọi API để xóa đánh giá
        await reviewApi.delete(id);
        
        // Xóa đánh giá khỏi danh sách
        setReviews(reviews.filter(review => review.id !== id));
        
        showSuccess('Xóa đánh giá thành công!');
      } catch (err) {
        console.error('Lỗi khi xóa đánh giá:', err);
        showError('Không thể xóa đánh giá. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '', // Sửa từ category_id thành category
      description: '',
      details: '',
      image: '',
      price: '',
      discountPrice: '', // Sửa từ discount_price thành discountPrice
      stock: '',
      status: 'active'
    });
    setCurrentProduct(null);
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý thay đổi form danh mục
  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value
    });
  };

  // Hiển thị danh sách đánh giá của một sản phẩm
  const handleViewReviews = (product) => {
    setSelectedProductForReviews(product);
    setActiveTab('reviews');
  };

  // Lọc đánh giá theo sản phẩm đã chọn hoặc từ khóa
  const getFilteredReviews = () => {
    if (selectedProductForReviews) {
      return reviews.filter(review => 
        review.product_id === selectedProductForReviews.id
      );
    }
    
    return reviews.filter(review => 
      review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Hàm xử lý xem sản phẩm
  const handleViewProduct = (product) => {
    setViewProduct(product);
    setShowProductPreviewModal(true);
  };

// Hàm xử lý xem chi tiết đơn hàng
const handleViewOrderDetails = (order) => {
  console.log('Viewing order details:', order);
  setSelectedOrder(order);
  setShowOrderDetailsModal(true);
};

// Hàm xử lý cập nhật trạng thái đơn hàng
const handleUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log(`Updating order ${orderId} status to ${newStatus}`);
    
    let statusUpdated = false;
    
    // Thử cập nhật qua API
    try {
      const response = await orderApi.updateStatus(orderId, newStatus);
      console.log('Update status response from API:', response);
      statusUpdated = true;
    } catch (apiError) {
      console.error('Error updating status via API:', apiError);
      
      // Cập nhật trong localStorage nếu API fail
      try {
        // Cập nhật trong mockOrders cho Admin
        const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        const updatedMockOrders = mockOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('mockOrders', JSON.stringify(updatedMockOrders));
        
        // Tìm và cập nhật đơn hàng trong userOrders
        const targetOrder = mockOrders.find(order => order.id === orderId);
        if (targetOrder && targetOrder.user_id) {
          const userOrderKey = `userOrders_${targetOrder.user_id}`;
          const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
          const updatedUserOrders = userOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          );
          localStorage.setItem(userOrderKey, JSON.stringify(updatedUserOrders));
        }
        
        statusUpdated = true;
      } catch (localStorageError) {
        console.error('Error updating status in localStorage:', localStorageError);
      }
    }
    
    if (!statusUpdated) {
      throw new Error('Không thể cập nhật trạng thái đơn hàng qua API hoặc localStorage');
    }
    
    // Cập nhật trong state
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    // Cập nhật đơn hàng đang xem nếu cần
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    showSuccess('Cập nhật trạng thái đơn hàng thành công!');
  } catch (err) {
    console.error('Error updating order status:', err);
    alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
  }
};


  // Hàm xử lý thêm danh mục mới
  const handleAddCategory = async () => {
    // Kiểm tra dữ liệu
    if (!categoryFormData.name) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }
    
    try {
      // Gửi dữ liệu lên server
      const response = await categoryApi.create(categoryFormData);
      
      // Thêm danh mục mới vào danh sách
      setCategories([...categories, { ...response.data, product_count: 0 }]);
      
      // Đóng modal và reset form
      setShowCategoryModal(false);
      setCategoryFormData({ name: '', description: '' });
      
      showSuccess('Thêm danh mục mới thành công!');
    } catch (err) {
      console.error('Error creating category:', err);
      
      // Nếu không kết nối được API, vẫn thêm danh mục vào state
      const newCategory = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: categoryFormData.name,
        description: categoryFormData.description,
        product_count: 0
      };
      
      setCategories([...categories, newCategory]);
      setShowCategoryModal(false);
      setCategoryFormData({ name: '', description: '' });
      showSuccess('Thêm danh mục mới thành công!');
    }
  };

  // Hàm xử lý chỉnh sửa danh mục
  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description
    });
    setShowEditCategoryModal(true);
  };

  // Hàm xử lý cập nhật danh mục
  const handleUpdateCategory = async () => {
    // Kiểm tra dữ liệu
    if (!categoryFormData.name) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }
    
    try {
      // Gửi dữ liệu lên server
      const response = await categoryApi.update(currentCategory.id, categoryFormData);
      
      // Cập nhật danh mục trong danh sách
      setCategories(categories.map(category => 
        category.id === currentCategory.id ? { ...response.data, product_count: category.product_count } : category
      ));
      
      // Đóng modal và reset form
      setShowEditCategoryModal(false);
      setCategoryFormData({ name: '', description: '' });
      setCurrentCategory(null);
      
      showSuccess('Cập nhật danh mục thành công!');
    } catch (err) {
      console.error('Error updating category:', err);
      
      // Nếu không kết nối được API, vẫn cập nhật danh mục trong state
      setCategories(categories.map(category => 
        category.id === currentCategory.id ? { ...category, ...categoryFormData } : category
      ));
      
      setShowEditCategoryModal(false);
      setCategoryFormData({ name: '', description: '' });
      setCurrentCategory(null);
      showSuccess('Cập nhật danh mục thành công!');
    }
  };

  // Hàm xử lý xóa danh mục
  const handleDeleteCategory = async (id) => {
    // Kiểm tra xem danh mục có sản phẩm không
    const category = categories.find(c => c.id === id);
    if (category.product_count > 0) {
      alert(`Không thể xóa danh mục này vì có ${category.product_count} sản phẩm liên quan.`);
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        // Gửi yêu cầu xóa lên server
        await categoryApi.delete(id);
        
        // Xóa danh mục khỏi danh sách
        setCategories(categories.filter(category => category.id !== id));
        
        showSuccess('Xóa danh mục thành công!');
      } catch (err) {
        console.error('Error deleting category:', err);
        
        // Nếu không kết nối được API, vẫn xóa danh mục khỏi state
        setCategories(categories.filter(category => category.id !== id));
        showSuccess('Xóa danh mục thành công!');
      }
    }
  };

  // Lấy trạng thái sản phẩm dạng Badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge bg="success"><FaCheckCircle className="me-1" /> Đang bán</Badge>;
      case 'inactive':
        return <Badge bg="danger"><FaTimesCircle className="me-1" /> Ngừng bán</Badge>;
      default:
        return <Badge bg="secondary"><FaInfoCircle className="me-1" /> {status}</Badge>;
    }
  };

  // Lấy trạng thái đơn hàng dạng Badge
// Lấy trạng thái đơn hàng dạng Badge
const getOrderStatusBadge = (status) => {
  console.log('Getting badge for status:', status);
  
  switch(status) {
    case 'pending':
      return <Badge bg="warning" text="dark"><FaInfoCircle className="me-1" /> Chờ xử lý</Badge>;
    case 'processing':
      return <Badge bg="info"><FaInfoCircle className="me-1" /> Đang xử lý</Badge>;
    case 'shipped':
      return <Badge bg="primary"><FaTruck className="me-1" /> Đang giao</Badge>;
    case 'delivered':
      return <Badge bg="success"><FaCheckCircle className="me-1" /> Đã giao</Badge>;
    case 'cancelled':
      return <Badge bg="danger"><FaTimesCircle className="me-1" /> Đã hủy</Badge>;
    default:
      console.log('Unknown status:', status);
      return <Badge bg="secondary"><FaInfoCircle className="me-1" /> {status || 'Không xác định'}</Badge>;
  }
};

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="admin-dashboard">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand>Quản Trị Cửa Hàng</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
                <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải dữ liệu...</p>
        </Container>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="admin-dashboard">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand>Quản Trị Cửa Hàng</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
                <Button variant="outline-light" onClick={handleLogout}>Đăng xuất</Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Alert variant="danger">
            {error}
          </Alert>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Quản Trị Cửa Hàng</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Button variant="outline-light" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Đăng xuất
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <header className="dashboard-header text-center mb-4">
          <h1>Quản Lý Cửa Hàng</h1>
          <p className="text-muted">Thêm, sửa, xóa và quản lý sản phẩm, đơn hàng và đánh giá</p>
        </header>
        
        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="search-container" style={{ width: '60%' }}>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {activeTab === 'products' && (
            <Button 
              variant="primary" 
              onClick={() => {
                setShowAddForm(true);
              }}
              className="px-4"
            >
              <FaPlus className="me-2" />Thêm Sản Phẩm Mới
            </Button>
          )}
        </div>
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            if (k === 'products') {
              setSelectedProductForReviews(null);
            }
          }}
          className="mb-3"
        >
          <Tab eventKey="products" title={<span><FaBox className="me-2" />Sản Phẩm</span>}>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 align-items-center">
                <div>
                    <Form.Select 
                      value={filterCategory} 
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="form-select-sm"
                      style={{ width: '200px' }}
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </Form.Select>                
                    </div>
                <div>
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select-sm"
                    style={{ width: '200px' }}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ngừng bán</option>
                  </Form.Select>
                </div>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setFilterCategory('');
                    setFilterStatus('');
                    setSearchTerm('');
                  }}
                >
                  <FaFilter className="me-1" /> Reset bộ lọc
                </Button>
              </div>
              
              <div>
                <span className="text-muted">
                  Tổng số: {getFilteredProducts().length} sản phẩm
                </span>
              </div>
            </div>
            
            <div className="table-responsive">
              <Table striped bordered hover className="shadow-sm">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '15%' }}>Hình ảnh</th>
                    <th style={{ width: '20%' }}>Tên sản phẩm</th>
                    <th style={{ width: '10%' }}>Danh mục</th>
                    <th style={{ width: '10%' }}>Giá</th>
                    <th style={{ width: '8%' }}>Kho</th>
                    <th style={{ width: '10%' }}>Trạng thái</th>
                    <th style={{ width: '22%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredProducts().length > 0 ? (
                    getFilteredProducts().map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                            }}
                          />
                        </td>
                        <td className="fw-bold">{product.name}</td>
                        <td>
                          <Badge bg="primary" pill className="px-3 py-2">{product.category}</Badge>
                        </td>
                        <td>
                          {product.discountPrice ? (
                            <>
                              <span className="text-decoration-line-through text-muted">${product.price}</span>
                              <br />
                              <span className="text-danger fw-bold">${product.discountPrice}</span>
                            </>
                          ) : (
                            <span>${product.price}</span>
                          )}
                        </td>
                        <td>{product.stock}</td>
                        <td>{getStatusBadge(product.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                          <Button 
                              variant="info" 
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                            >
                              <FaEye className="me-1" /> Xem
                            </Button>
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleEditClick(product)}
                            >
                              <FaEdit className="me-1" /> Sửa
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <FaTrash className="me-1" /> Xóa
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleViewReviews(product)}
                            >
                              <FaStar className="me-1" /> Đánh giá ({product.reviewCount || 0})
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <FaInfoCircle className="me-2" />
                          <p className="mb-0">Không tìm thấy sản phẩm nào phù hợp với điều kiện tìm kiếm</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>
          
          <Tab eventKey="orders" title={<span><FaShoppingCart className="me-2" />Đơn Hàng</span>}>
            <div className="mb-3">
              <div className="d-flex gap-2 align-items-center">
                <div>
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select-sm"
                    style={{ width: '200px' }}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </Form.Select>
                </div>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setFilterStatus('');
                    setSearchTerm('');
                  }}
                >
                  <FaFilter className="me-1" /> Reset bộ lọc
                </Button>
              </div>
            </div>
            
            <div className="table-responsive">
              <Table striped bordered hover className="shadow-sm">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '15%' }}>Khách hàng</th>
                    <th style={{ width: '15%' }}>Ngày đặt</th>
                    <th style={{ width: '15%' }}>Tổng tiền</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '35%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(order => 
                    (filterStatus ? order.status === filterStatus : true) && 
                    (searchTerm ? 
                      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      order.id?.toString().includes(searchTerm) : 
                      true
                    )
                  ).length > 0 ? (
                    orders.filter(order => 
                      (filterStatus ? order.status === filterStatus : true) && 
                      (searchTerm ? 
                        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.id?.toString().includes(searchTerm) : 
                        true
                      )
                    ).map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td>${order.total_amount?.toFixed(2) || '0.00'}</td>
                        <td>{getOrderStatusBadge(order.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="info" 
                              size="sm"
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              <FaEye className="me-1" /> Chi tiết
                            </Button>
                            
                            <Dropdown>
                              <Dropdown.Toggle variant="primary" size="sm" id={`dropdown-${order.id}`}>
                                Cập nhật trạng thái
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                                  disabled={order.status === 'pending'}
                                >
                                  Chờ xử lý
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                  disabled={order.status === 'processing'}
                                >
                                  Đang xử lý
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                  disabled={order.status === 'shipped'}
                                >
                                  Đang giao
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                  disabled={order.status === 'delivered'}
                                >
                                  Đã giao
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  disabled={order.status === 'cancelled'}
                                >
                                  Hủy đơn
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <FaInfoCircle className="me-2" />
                          <p className="mb-0">Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>
          
<Tab eventKey="customers" title={<span><FaUsers className="me-2" />Khách Hàng</span>}>
  <div className="table-responsive">
    <Table striped bordered hover className="shadow-sm">
      <thead className="bg-light">
        <tr>
          <th style={{ width: '5%' }}>ID</th>
          <th style={{ width: '20%' }}>Tên khách hàng</th>
          <th style={{ width: '20%' }}>Email</th>
          <th style={{ width: '15%' }}>Số điện thoại</th>
          <th style={{ width: '15%' }}>Ngày đăng ký</th>
          <th style={{ width: '10%' }}>Số đơn hàng</th>
          <th style={{ width: '15%' }}>Tổng chi tiêu</th>
        </tr>
      </thead>
      <tbody>
        {customers.filter(customer => 
          searchTerm ? 
            customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.includes(searchTerm) : 
            true
        ).length > 0 ? (
          customers.filter(customer => 
            searchTerm ? 
              customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              customer.phone?.includes(searchTerm) : 
              true
          ).map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}</td>
              <td>{customer.order_count || 0}</td>
              <td>
                ${typeof customer.total_spent === 'number' ? 
                  customer.total_spent.toFixed(2) : 
                  parseFloat(customer.total_spent || 0).toFixed(2)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center py-4">
              <div className="text-muted">
                <FaInfoCircle className="me-2" />
                <p className="mb-0">Không tìm thấy khách hàng nào phù hợp với điều kiện tìm kiếm</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
</Tab>          
          <Tab eventKey="reviews" title={<span><FaStar className="me-2" />Đánh Giá</span>}>
            <div className="mb-3">
              {selectedProductForReviews && (
                <Alert variant="info" className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Đang xem đánh giá cho: </strong> {selectedProductForReviews.name}
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setSelectedProductForReviews(null)}
                  >
                    Xem tất cả đánh giá
                  </Button>
                </Alert>
              )}
            </div>
            
            <div className="table-responsive">
              <Table striped bordered hover className="shadow-sm">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '15%' }}>Khách hàng</th>
                    <th style={{ width: '20%' }}>Sản phẩm</th>
                    <th style={{ width: '30%' }}>Nhận xét</th>
                    <th style={{ width: '10%' }}>Đánh giá</th>
                    <th style={{ width: '10%' }}>Ngày đăng</th>
                    <th style={{ width: '10%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredReviews().length > 0 ? (
                    getFilteredReviews().map((review) => (
                      <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>{review.name}</td>
                        <td>
                          <a href={`/products/${review.product_id}`} target="_blank" rel="noopener noreferrer">
                            {review.productName}
                          </a>
                        </td>
                        <td>
                          <div style={{ maxHeight: '80px', overflow: 'auto' }}>
                            {review.comment}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {Array(5).fill(0).map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < review.rating ? "text-warning" : "text-muted"} 
                              />
                            ))}
                            <span className="ms-2">{review.rating}/5</span>
                          </div>
                        </td>
                        <td>{review.date ? new Date(review.date).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <FaTrash className="me-1" /> Xóa
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                          <FaInfoCircle className="me-2" />
                          <p className="mb-0">Không tìm thấy đánh giá nào</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="categories" title={<span><FaTags className="me-2" />Danh Mục</span>}>
            <div className="d-flex justify-content-between mb-4">
              <h5>Quản lý danh mục sản phẩm</h5>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowCategoryModal(true)}
              >
                <FaPlus className="me-1" /> Thêm danh mục
              </Button>
            </div>
            
            <div className="table-responsive">
              <Table striped bordered hover className="shadow-sm">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '20%' }}>Tên danh mục</th>
                    <th style={{ width: '40%' }}>Mô tả</th>
                    <th style={{ width: '15%' }}>Số sản phẩm</th>
                    <th style={{ width: '20%' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.filter(category => 
                    searchTerm ? 
                      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) : 
                      true
                  ).length > 0 ? (
                    categories.filter(category => 
                      searchTerm ? 
                        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) : 
                        true
                    ).map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td>{category.product_count}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <FaEdit className="me-1" /> Sửa
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              disabled={category.product_count > 0}
                            >
                              <FaTrash className="me-1" /> Xóa
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="text-muted">
                          <FaInfoCircle className="me-2" />
                          <p className="mb-0">Không tìm thấy danh mục nào</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Tab>

          <Tab eventKey="reports" title={<span><FaMoneyBillWave className="me-2" />Báo Cáo</span>}>
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Doanh Thu</h5>
                    <h2 className="display-6">${orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.total_amount || 0 : 0), 0).toFixed(2)}</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <a className="small text-white stretched-link" href="#!">Xem chi tiết</a>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Đơn Hàng</h5>
                    <h2 className="display-6">{orders.length}</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <a className="small text-white stretched-link" href="#!">Xem chi tiết</a>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Sản Phẩm</h5>
                    <h2 className="display-6">{products.length}</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <a className="small text-white stretched-link" href="#!">Xem chi tiết</a>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Khách Hàng</h5>
                    <h2 className="display-6">{customers.length}</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <a className="small text-white stretched-link" href="#!">Xem chi tiết</a>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-xl-6">
                <div className="card mb-4">
                  <div className="card-header">
                    <i className="fas fa-chart-area me-1"></i>
                    Doanh thu theo thời gian
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      {/* Thêm biểu đồ doanh thu ở đây */}
                      <div className="text-center py-5">
                        <FaMoneyBillWave size={50} className="text-muted mb-3" />
                        <p>Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="card mb-4">
                  <div className="card-header">
                    <i className="fas fa-chart-bar me-1"></i>
                    Sản phẩm bán chạy
                  </div>
                  <div className="card-body">
                    <div style={{ height: '300px' }}>
                      {/* Thêm biểu đồ sản phẩm bán chạy ở đây */}
                      <div className="text-center py-5">
                        <FaBox size={50} className="text-muted mb-3" />
                        <p>Biểu đồ sản phẩm bán chạy sẽ được hiển thị ở đây</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Container>

      {/* Modal Thêm Sản Phẩm */}
      <Modal show={showAddForm} onHide={() => setShowAddForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm Sản Phẩm Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nhập tên sản phẩm" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Nhập giá sản phẩm" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá khuyến mãi (không bắt buộc)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleFormChange}
                    placeholder="Nhập giá khuyến mãi" 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Số lượng trong kho <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleFormChange}
                placeholder="Nhập số lượng" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả ngắn <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả ngắn" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chi tiết sản phẩm <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5}
                name="details"
                value={formData.details}
                onChange={handleFormChange}
                placeholder="Nhập chi tiết sản phẩm" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Đường dẫn hình ảnh <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                placeholder="Nhập đường dẫn hình ảnh" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select 
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddForm(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Thêm Sản Phẩm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Sửa Sản Phẩm */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Sửa Sản Phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nhập tên sản phẩm" 
              />
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Danh mục</Form.Label>
            <Form.Select 
              name="category"
              value={formData.category}
              onChange={handleFormChange}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="Nhập giá sản phẩm" 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá khuyến mãi (không bắt buộc)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleFormChange}
                    placeholder="Nhập giá khuyến mãi" 
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Số lượng trong kho</Form.Label>
              <Form.Control 
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleFormChange}
                placeholder="Nhập số lượng" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả ngắn</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Nhập mô tả ngắn" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chi tiết sản phẩm</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5}
                name="details"
                value={formData.details}
                onChange={handleFormChange}
                placeholder="Nhập chi tiết sản phẩm" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Đường dẫn hình ảnh</Form.Label>
              <Form.Control 
                type="text" 
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                placeholder="Nhập đường dẫn hình ảnh" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select 
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditForm(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Cập Nhật
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Thêm Danh Mục */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Danh Mục Mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={categoryFormData.name}
                onChange={handleCategoryFormChange}
                placeholder="Nhập tên danh mục" 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description"
                value={categoryFormData.description}
                onChange={handleCategoryFormChange}
                placeholder="Nhập mô tả danh mục" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Thêm Danh Mục
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Sửa Danh Mục */}
      <Modal show={showEditCategoryModal} onHide={() => setShowEditCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa Danh Mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                value={categoryFormData.name}
                onChange={handleCategoryFormChange}
                placeholder="Nhập tên danh mục" 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                name="description"
                value={categoryFormData.description}
                onChange={handleCategoryFormChange}
                placeholder="Nhập mô tả danh mục" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditCategoryModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateCategory}>
            Cập Nhật
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xem Chi Tiết Sản Phẩm */}
      <Modal show={showProductPreviewModal} onHide={() => setShowProductPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi Tiết Sản Phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewProduct && (
            <div className="product-detail">
              <div className="text-center mb-4">
                <img 
                  src={viewProduct.image} 
                  alt={viewProduct.name} 
                  className="img-fluid rounded" 
                  style={{ maxHeight: '300px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
              
              <h3 className="mb-3">{viewProduct.name}</h3>
              
              <div className="d-flex justify-content-between mb-3">
                <Badge bg="primary" className="p-2">{viewProduct.category}</Badge>
                {getStatusBadge(viewProduct.status)}
              </div>
              
              <div className="mb-3">
                <h5>Giá:</h5>
                {viewProduct.discountPrice ? (
                  <div>
                    <span className="text-decoration-line-through text-muted fs-5">${viewProduct.price}</span>
                    <span className="text-danger fs-3 ms-2">${viewProduct.discountPrice}</span>
                    <span className="badge bg-danger ms-2">
                      {Math.round((1 - viewProduct.discountPrice / viewProduct.price) * 100)}% GIẢM
                    </span>
                  </div>
                ) : (
                  <div className="fs-3">${viewProduct.price}</div>
                )}
              </div>
              
              <div className="mb-3">
                <h5>Tồn kho:</h5>
                <p>{viewProduct.stock} sản phẩm</p>
              </div>
              
              <div className="mb-3">
                <h5>Mô tả:</h5>
                <p>{viewProduct.description}</p>
              </div>
              
              <div className="mb-3">
                <h5>Chi tiết sản phẩm:</h5>
                <div dangerouslySetInnerHTML={{ __html: viewProduct.details }}></div>
              </div>
              
              <div className="mb-3">
                <h5>Đánh giá:</h5>
                <div className="d-flex align-items-center">
                  {Array(5).fill(0).map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < Math.round(viewProduct.averageRating || 0) ? "text-warning" : "text-muted"} 
                    />
                  ))}
                  <span className="ms-2">
                    {parseFloat(viewProduct.averageRating || 0).toFixed(1)}/5 
                    ({viewProduct.reviewCount || 0} đánh giá)
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductPreviewModal(false)}>
            Đóng
          </Button>
          <Button 
            variant="warning" 
            onClick={() => {
              handleEditClick(viewProduct);
              setShowProductPreviewModal(false);
            }}
          >
            <FaEdit className="me-1" /> Sửa sản phẩm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Chi Tiết Đơn Hàng */}
      <Modal show={showOrderDetailsModal} onHide={() => setShowOrderDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi Tiết Đơn Hàng #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="mb-4">
                <h5>Thông tin đơn hàng</h5>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td className="fw-bold" width="30%">Mã đơn hàng</td>
                      <td>#{selectedOrder.id}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Ngày đặt</td>
                      <td>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Trạng thái</td>
                      <td>{getOrderStatusBadge(selectedOrder.status)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Tổng tiền</td>
                      <td className="fw-bold text-danger">${selectedOrder.total_amount?.toFixed(2) || '0.00'}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              
              <div className="mb-4">
                <h5>Thông tin khách hàng</h5>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td className="fw-bold" width="30%">Tên khách hàng</td>
                      <td>{selectedOrder.customer_name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Email</td>
                      <td>{selectedOrder.customer_email || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Số điện thoại</td>
                      <td>{selectedOrder.customer_phone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Địa chỉ giao hàng</td>
                      <td>{selectedOrder.shipping_address || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              
              <div>
                <h5>Chi tiết sản phẩm</h5>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                                }}
                              />
                              {item.name}
                            </div>
                          </td>
                          <td>${item.price?.toFixed(2) || '0.00'}</td>
                          <td>{item.quantity}</td>
                          <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                        <td className="fw-bold">${selectedOrder.total_amount?.toFixed(2) || '0.00'}</td>
                      </tr>
                    </tfoot>
                  </Table>
                ) : (
                  <Alert variant="info">Không có thông tin chi tiết sản phẩm</Alert>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderDetailsModal(false)}>
            Đóng
          </Button>
          {selectedOrder && (
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-update-status">
                Cập nhật trạng thái
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item 
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'pending')}
                  disabled={selectedOrder.status === 'pending'}
                >
                  Chờ xử lý
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                  disabled={selectedOrder.status === 'processing'}
                >
                  Đang xử lý
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                  disabled={selectedOrder.status === 'shipped'}
                >
                  Đang giao
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                  disabled={selectedOrder.status === 'delivered'}
                >
                  Đã giao
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                  disabled={selectedOrder.status === 'cancelled'}
                >
                  Hủy đơn
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminDashboard;