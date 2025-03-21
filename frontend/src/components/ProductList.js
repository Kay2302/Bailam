// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Nav from './Nav';
import Footer from './Footer';
import Products from './Products';
import { productApi } from '../services/api';

function ProductList() {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy tham số tìm kiếm từ URL nếu có
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

// Sửa đoạn code lọc sản phẩm trong ProductList.js
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Lấy tất cả sản phẩm
      const response = await productApi.getAll();
      let filteredProducts = response.data;
      
      // Debug: xem dữ liệu sản phẩm ban đầu
      console.log('All products:', filteredProducts);
      console.log('Current category:', category);
      
      // Lọc theo danh mục nếu có
      if (category) {
        // Chuyển đổi tên danh mục thành chữ thường để so sánh không phân biệt hoa thường
        const categoryLower = category.toLowerCase();
        
        filteredProducts = filteredProducts.filter(product => {
          // Kiểm tra cả tên danh mục và category_id (nếu có)
          const productCategory = product.category ? product.category.toLowerCase() : '';
          const productCategoryId = product.category_id ? product.category_id.toString() : '';
          
          console.log(`Comparing: "${productCategory}" with "${categoryLower}"`);
          return productCategory === categoryLower || productCategoryId === category;
        });
        
        // Debug: xem sản phẩm sau khi lọc
        console.log('Filtered products by category:', filteredProducts);
      }
      
      // Lọc theo từ khóa tìm kiếm nếu có
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product => 
            (product.name && product.name.toLowerCase().includes(searchLower)) ||
            (product.description && product.description.toLowerCase().includes(searchLower)) ||
            (product.category && product.category.toLowerCase().includes(searchLower))
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Đã có lỗi xảy ra khi tải dữ liệu sản phẩm.');
      setLoading(false);
    }
  };
  
  fetchProducts();
  window.scrollTo(0, 0);
}, [category, searchQuery]);
  return (
    <>
      <Nav />
      <Container className="py-5 mt-5">
        <h2 className="mb-4">
          {category 
            ? `Sản phẩm ${category}` 
            : searchQuery 
              ? `Kết quả tìm kiếm cho "${searchQuery}"` 
              : 'Tất cả sản phẩm'
          }
        </h2>
        <Products 
          products={products} 
          loading={loading} 
          error={error} 
        />
      </Container>
      <Footer />
    </>
  );
}

export default ProductList;