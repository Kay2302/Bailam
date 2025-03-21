// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import Header from './Header';
import CategoryList from './CategoryList';  // Thêm dòng này
import Products from './Products';
import Contact from './Contact';
import Footer from './Footer';
import { productApi } from '../services/api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll();
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Đã có lỗi xảy ra khi tải dữ liệu sản phẩm.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div id="page-top">
      <Nav />
      <Header />
      <CategoryList />  {/* Thêm dòng này */}
      <Products 
        products={products} 
        loading={loading} 
        error={error} 
      />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;