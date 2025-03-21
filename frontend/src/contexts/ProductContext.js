// src/contexts/ProductContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi, wishlistApi } from '../services/api';

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tải giỏ hàng và wishlist khi component mount hoặc khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    const loadCartAndWishlist = async () => {
      try {
        if (isAuthenticated && currentUser) {
          setLoading(true);
          
          // Lấy giỏ hàng từ localStorage (nếu có) để đồng bộ lên server
          const localCart = localStorage.getItem('cart');
          let localCartItems = [];
          if (localCart) {
            localCartItems = JSON.parse(localCart);
            // Đồng bộ giỏ hàng local lên server
            if (localCartItems.length > 0) {
              try {
                await cartApi.syncLocalCart(currentUser.id, localCartItems);
                // Xóa giỏ hàng local sau khi đồng bộ
                localStorage.removeItem('cart');
              } catch (syncError) {
                console.error('Error syncing local cart:', syncError);
              }
            }
          }
          
          // Lấy giỏ hàng từ server
          const cartResponse = await cartApi.getCart(currentUser.id);
          setCart(cartResponse.data);
          
          // Xử lý tương tự cho wishlist
          const localWishlist = localStorage.getItem('wishlist');
          if (localWishlist) {
            // Xử lý đồng bộ wishlist nếu cần
            localStorage.removeItem('wishlist');
          }
          
          // Lấy wishlist từ server
          const wishlistResponse = await wishlistApi.getWishlist(currentUser.id);
          setWishlist(wishlistResponse.data);
        } else {
          // Nếu chưa đăng nhập, lấy từ localStorage
          const storedCart = localStorage.getItem('cart');
          const storedWishlist = localStorage.getItem('wishlist');

          if (storedCart) {
            setCart(JSON.parse(storedCart));
          }

          if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
          }
        }
      } catch (err) {
        console.error('Error loading cart and wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCartAndWishlist();
  }, [isAuthenticated, currentUser]);

  // Lưu giỏ hàng vào localStorage (chỉ khi chưa đăng nhập)
  useEffect(() => {
    if (!isAuthenticated && cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // Lưu wishlist vào localStorage (chỉ khi chưa đăng nhập)
  useEffect(() => {
    if (!isAuthenticated && wishlist.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated && currentUser) {
        // Đã đăng nhập - lưu vào database qua API
        setLoading(true);
        const response = await cartApi.addToCart(currentUser.id, product.id, quantity);
        setCart(response.data);
        setLoading(false);
      } else {
        // Chưa đăng nhập - lưu vào localStorage
        setCart(prevCart => {
          const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Sản phẩm đã tồn tại, cập nhật số lượng
            const updatedCart = [...prevCart];
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + quantity
            };
            return updatedCart;
          } else {
            // Thêm sản phẩm mới
            return [...prevCart, { ...product, quantity }];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setLoading(false);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItem = async (id, quantity) => {
    try {
      if (isAuthenticated && currentUser) {
        // Đã đăng nhập - cập nhật qua API
        setLoading(true);
        await cartApi.updateCartItem(currentUser.id, id, quantity);
        
        // Cập nhật state
        setCart(prevCart => 
          prevCart.map(item => 
            item.id === id || item.product_id === id 
              ? { ...item, quantity } 
              : item
          )
        );
        setLoading(false);
      } else {
        // Chưa đăng nhập - cập nhật localStorage
        setCart(prevCart => 
          prevCart.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      setLoading(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (id) => {
    try {
      if (isAuthenticated && currentUser) {
        // Đã đăng nhập - xóa qua API
        setLoading(true);
        await cartApi.removeFromCart(currentUser.id, id);
        
        // Cập nhật state
        setCart(prevCart => 
          prevCart.filter(item => item.id !== id && item.product_id !== id)
        );
        setLoading(false);
      } else {
        // Chưa đăng nhập - xóa từ localStorage
        setCart(prevCart => prevCart.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setLoading(false);
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      if (isAuthenticated && currentUser) {
        // Đã đăng nhập - xóa qua API
        setLoading(true);
        await cartApi.clearCart(currentUser.id);
        setLoading(false);
      }
      
      // Luôn cập nhật state
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setLoading(false);
    }
  };

  // Tính tổng giá trị giỏ hàng
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discount_price || item.discountPrice || item.price;
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  // Thêm vào wishlist
  const addToWishlist = async (product) => {
    try {
      if (isAuthenticated && currentUser) {
        // Đã đăng nhập - lưu vào database
        setLoading(true);
        await wishlistApi.addToWishlist(currentUser.id, product.id);
        
        // Lấy wishlist mới nhất
        const response = await wishlistApi.getWishlist(currentUser.id);
        setWishlist(response.data);
        setLoading(false);
      } else {
        // Chưa đăng nhập - lưu vào localStorage
        setWishlist(prevWishlist => {
          const exists = prevWishlist.some(item => item.id === product.id);
          
          if (exists) {
            return prevWishlist;
          } else {
            return [...prevWishlist, product];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setLoading(false);
    }
  };

  // Xóa khỏi wishlist
  const removeFromWishlist = async (id) => {
    try {
      if (isAuthenticated && currentUser) {
        // Đã đăng nhập - xóa qua API
        setLoading(true);
        await wishlistApi.removeFromWishlist(currentUser.id, id);
        
        // Cập nhật state
        setWishlist(prevWishlist => 
          prevWishlist.filter(item => item.id !== id && item.product_id !== id)
        );
        setLoading(false);
      } else {
        // Chưa đăng nhập - xóa từ localStorage
        setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setLoading(false);
    }
  };

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    addToWishlist,
    removeFromWishlist
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};