-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

-- Tạo bảng products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT,
  description TEXT,
  details TEXT,
  image VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  stock INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tạo bảng reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  comment TEXT,
  rating INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tạo bảng orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_method VARCHAR(50),
  payment_method VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tạo bảng order_items
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tạo bảng coupons
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount DECIMAL(5, 2) NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL
);

-- Tạo bảng wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, product_id)
);

-- Chèn dữ liệu mẫu cho bảng users
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin', 'admin@example.com', '$2a$10$GcIFAxDX6Nt9V6X7wgGK8.ZK.U3XKpg4jVvtw6A.oCQGa6EQ4Ae8G', '0987654321', 'admin'),
('User', 'user@example.com', '$2a$10$GcIFAxDX6Nt9V6X7wgGK8.ZK.U3XKpg4jVvtw6A.oCQGa6EQ4Ae8G', '0123456789', 'customer');

-- Chèn dữ liệu mẫu cho bảng categories từ data/categories.js
INSERT INTO categories (name, description) VALUES
('Điện thoại', 'Điện thoại di động thông minh'),
('Laptop', 'Máy tính xách tay'),
('Tablet', 'Máy tính bảng'),
('Tai nghe', 'Tai nghe không dây và có dây'),
('Đồng hồ thông minh', 'Đồng hồ thông minh và thiết bị đeo'),
('Loa', 'Loa thông minh và loa bluetooth'),
('Phụ kiện', 'Phụ kiện điện tử đa dạng'),
('Máy ảnh', 'Máy ảnh kỹ thuật số');

-- Chèn dữ liệu mẫu cho bảng products từ data/productData.js
INSERT INTO products (name, category_id, description, details, image, price, discount_price, stock, status) VALUES
('iPhone 15 Pro Max 256GB', 1, 'Điện thoại thông minh cao cấp với hiệu năng mạnh mẽ và camera chuyên nghiệp.', '<h4>Thông số kỹ thuật:</h4><ul><li>Màn hình: 6.7 inch, Super Retina XDR OLED, 120Hz</li><li>CPU: Apple A17 Pro, 6 nhân</li><li>RAM: 8GB</li><li>Bộ nhớ trong: 256GB</li><li>Camera sau: 48MP (chính) + 12MP (góc siêu rộng) + 12MP (telephoto)</li><li>Camera trước: 12MP</li><li>Pin: 4422mAh, sạc nhanh 27W, sạc không dây 15W</li><li>Hệ điều hành: iOS 17</li></ul>', '/assets/img/portfolio/thumbnails/15.jpg', 1299.99, 1199.99, 50, 'active'),
('MacBook Pro M3 14 inch', 2, 'Laptop mỏng nhẹ, mạnh mẽ với chip M3 và màn hình Retina tuyệt đẹp.', '<h4>Thông số kỹ thuật:</h4><ul><li>Màn hình: 14 inch, Liquid Retina XDR, 120Hz</li><li>CPU: Apple M3 Pro, 10 nhân</li><li>RAM: 16GB</li><li>Bộ nhớ: SSD 512GB</li><li>Đồ họa: GPU 16 nhân tích hợp</li><li>Cổng kết nối: 3x Thunderbolt 4, HDMI, Jack 3.5mm, MagSafe 3</li><li>Pin: Lên đến 18 giờ sử dụng</li><li>Hệ điều hành: macOS Sonoma</li></ul>', '/assets/img/portfolio/thumbnails/lab.jpg', 1999.99, 1849.99, 30, 'active'),
('AirPods Pro 2', 4, 'Tai nghe không dây cao cấp với khả năng chống ồn chủ động và âm thanh không gian.', '<h4>Thông số kỹ thuật:</h4><ul><li>Loại: Tai nghe không dây in-ear</li><li>Chip: H2</li><li>Tính năng: Chống ồn chủ động, Âm thanh không gian, Chế độ xuyên âm</li><li>Thời lượng pin: 6 giờ (tai nghe), 30 giờ (với hộp sạc)</li><li>Chuẩn kháng nước: IPX4</li><li>Kết nối: Bluetooth 5.3</li><li>Sạc: USB-C, sạc không dây</li></ul>', '/assets/img/portfolio/thumbnails/pod.jpg', 249.99, NULL, 100, 'active'),
('iPad Pro M2 11-inch', 3, 'Máy tính bảng mạnh mẽ với màn hình Liquid Retina và chip M2.', '<h4>Thông số kỹ thuật:</h4><ul><li>Màn hình: 11 inch, Liquid Retina, 120Hz</li><li>CPU: Apple M2, 8 nhân</li><li>RAM: 8GB</li><li>Bộ nhớ: 256GB</li><li>Camera sau: 12MP (góc rộng) + 10MP (góc siêu rộng) + LiDAR</li><li>Camera trước: 12MP Ultra Wide</li><li>Pin: 10 giờ sử dụng</li><li>Kết nối: Wi-Fi 6E, Bluetooth 5.3, USB-C</li></ul>', '/assets/img/portfolio/thumbnails/ipad.jpg', 799.99, 749.99, 45, 'active'),
('Apple Watch Series 9', 5, 'Đồng hồ thông minh với màn hình luôn hiển thị, tính năng theo dõi sức khỏe toàn diện.', '<h4>Thông số kỹ thuật:</h4><ul><li>Màn hình: LTPO OLED Always-On, 484 x 396 pixel</li><li>Kích thước: 41mm hoặc 45mm</li><li>Chip: Apple S9</li><li>Bộ nhớ: 32GB</li><li>Cảm biến: Nhịp tim quang học, ECG, SpO2, nhiệt độ, la bàn, cao độ</li><li>Kết nối: Bluetooth 5.3, Wi-Fi, NFC, LTE (tùy phiên bản)</li><li>Pin: Lên đến 18 giờ sử dụng thông thường, 36 giờ ở chế độ tiết kiệm pin</li><li>Kháng nước: 50m</li></ul>', '/assets/img/portfolio/thumbnails/dh.jpg', 399.99, 379.99, 60, 'active'),
('HomePod mini', 6, 'Loa thông minh nhỏ gọn với âm thanh 360 độ và tích hợp Siri.', '<h4>Thông số kỹ thuật:</h4><ul><li>Kích thước: 84.3 x 97.9 mm</li><li>Trọng lượng: 345g</li><li>Âm thanh: Loa toàn dải, hai loa passive radiator</li><li>Chip: Apple S5</li><li>Microphone: Mảng 4 microphone</li><li>Kết nối: Bluetooth 5.0, Wi-Fi 802.11n, Thread</li><li>Tính năng: Siri, AirPlay 2, HomeKit hub</li><li>Màu sắc: Trắng, Đen, Cam, Vàng, Xanh dương</li></ul>', '/assets/img/portfolio/thumbnails/loa.jpg', 99.99, NULL, 75, 'active'),
('Apple Pencil Pro', 7, 'Bút cảm ứng thế hệ mới với độ trễ thấp và cảm biến áp lực.', '<h4>Thông số kỹ thuật:</h4><ul><li>Kết nối: Bluetooth, Nam châm</li><li>Tính năng: Cảm biến áp lực, Cảm biến nghiêng, Cử chỉ cuộn</li><li>Độ trễ: 9ms</li><li>Pin: Sử dụng liên tục 12 giờ</li><li>Sạc: USB-C, sạc không dây</li><li>Tương thích: iPad Pro, iPad Air thế hệ mới</li><li>Màu sắc: Trắng</li></ul>', '/assets/img/portfolio/thumbnails/pencil.jpg', 129.99, 119.99, 90, 'active'),
('Samsung Galaxy S23 Ultra', 1, 'Điện thoại Android cao cấp với bút S Pen và camera zoom 100x.', '<h4>Thông số kỹ thuật:</h4><ul><li>Màn hình: 6.8 inch, Dynamic AMOLED 2X, 120Hz</li><li>CPU: Snapdragon 8 Gen 2</li><li>RAM: 12GB</li><li>Bộ nhớ trong: 256GB</li><li>Camera sau: 200MP (chính) + 12MP (góc siêu rộng) + 10MP (telephoto 3x) + 10MP (telephoto 10x)</li><li>Camera trước: 12MP</li><li>Pin: 5000mAh, sạc nhanh 45W</li><li>Kèm bút S Pen</li></ul>', '/assets/img/portfolio/thumbnails/ss.jpg', 1199.99, 1099.99, 40, 'active'),
('Dell XPS 15', 2, 'Laptop cao cấp với màn hình OLED, hiệu năng mạnh mẽ cho công việc sáng tạo.', '<h4>Thông số kỹ thuật:</h4><ul><li>Màn hình: 15.6 inch, 4K OLED, cảm ứng</li><li>CPU: Intel Core i9-13900H</li><li>RAM: 32GB DDR5</li><li>Ổ cứng: SSD 1TB NVMe</li><li>Đồ họa: NVIDIA RTX 4070 8GB</li><li>Pin: Lên đến 12 giờ</li><li>Cổng kết nối: 2x Thunderbolt 4, USB-C, jack 3.5mm, đầu đọc thẻ SD</li><li>Trọng lượng: 1.96kg</li></ul>', '/assets/img/portfolio/thumbnails/lab.jpg', 2499.99, 2299.99, 25, 'active'),
('Sony Alpha A7 IV', 8, 'Máy ảnh mirrorless full-frame với cảm biến 33MP và quay video 4K 60fps.', '<h4>Thông số kỹ thuật:</h4><ul><li>Cảm biến: CMOS Exmor R Full-frame 33MP</li><li>Bộ xử lý: BIONZ XR</li><li>Dải ISO: 100-51200 (mở rộng 50-204800)</li><li>Tốc độ chụp liên tiếp: 10fps</li><li>Video: 4K 60fps 10-bit 4:2:2, Full HD 120fps</li><li>Màn hình: LCD 3.0 inch, xoay lật, cảm ứng</li><li>EVF: 3.68 triệu điểm, phóng đại 0.78x</li><li>Kết nối: Wi-Fi, Bluetooth, USB-C, HDMI, jack 3.5mm</li><li>Pin: NP-FZ100, quay liên tục 580 ảnh</li></ul>', '/assets/img/portfolio/thumbnails/cam.jpg', 2499.99, NULL, 15, 'active');
  
-- Chèn dữ liệu mẫu cho bảng reviews
INSERT INTO reviews (product_id, name, email, comment, rating) VALUES
(1, 'Nguyễn Văn A', 'nguyenvana@example.com', 'iPhone 15 Pro Max có camera rất tốt, chụp đêm rõ nét!', 5),
(1, 'Trần Thị B', 'tranthib@example.com', 'Pin trâu, dùng cả ngày không lo hết pin.', 4),
(2, 'Lê Văn C', 'levanc@example.com', 'MacBook Pro chạy rất mượt, màn hình đẹp, pin trâu.', 5),
(3, 'Phạm Thị D', 'phamthid@example.com', 'AirPods Pro 2 chống ồn rất tốt, âm thanh trong trẻo.', 5),
(4, 'Hoàng Văn E', 'hoangvane@example.com', 'iPad Pro M2 rất phù hợp để vẽ và làm việc, màn hình đẹp.', 4);

-- Chèn dữ liệu mẫu cho bảng orders
INSERT INTO orders (user_id, total_amount, shipping_address, shipping_method, payment_method, customer_name, customer_email, customer_phone, status) VALUES
(2, 1299.99, '123 Đường ABC, Quận 1, TP.HCM', 'standard', 'credit-card', 'Nguyễn Văn A', 'nguyenvana@example.com', '0901234567', 'delivered'),
(2, 1049.99, '456 Đường XYZ, Quận 2, TP.HCM', 'express', 'paypal', 'Trần Thị B', 'tranthib@example.com', '0909876543', 'shipped'),
(NULL, 249.99, '789 Đường LMN, Quận 3, TP.HCM', 'standard', 'cod', 'Lê Văn C', 'levanc@example.com', '0912345678', 'pending');

-- Chèn dữ liệu mẫu cho bảng order_items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 1199.99),
(2, 2, 1, 1849.99),
(2, 3, 1, 249.99),
(3, 3, 1, 249.99);

-- Chèn dữ liệu mẫu cho bảng coupons
INSERT INTO coupons (code, discount, expiry_date) VALUES
('SALE10', 10.00, DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)),
('SALE20', 20.00, DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY)),
('FREESHIP', 100.00, DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY));

-- Chèn dữ liệu mẫu cho bảng wishlist
INSERT INTO wishlist (user_id, product_id) VALUES
(2, 1),
(2, 3),
(2, 5);