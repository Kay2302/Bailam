// src/data/productData.js
const productData = [
  {
    id: 1,
    category: "Điện thoại",
    name: "iPhone 15 Pro Max 256GB",
    description: "Điện thoại thông minh cao cấp với hiệu năng mạnh mẽ và camera chuyên nghiệp.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Màn hình: 6.7 inch, Super Retina XDR OLED, 120Hz</li>
        <li>CPU: Apple A17 Pro, 6 nhân</li>
        <li>RAM: 8GB</li>
        <li>Bộ nhớ trong: 256GB</li>
        <li>Camera sau: 48MP (chính) + 12MP (góc siêu rộng) + 12MP (telephoto)</li>
        <li>Camera trước: 12MP</li>
        <li>Pin: 4422mAh, sạc nhanh 27W, sạc không dây 15W</li>
        <li>Hệ điều hành: iOS 17</li>
      </ul>
      <p>iPhone 15 Pro Max mang đến trải nghiệm cao cấp với thiết kế titanium bền bỉ, chip A17 Pro mạnh mẽ và hệ thống camera chuyên nghiệp. Sản phẩm có khả năng chụp ảnh đêm ấn tượng, quay video 4K 60fps và hỗ trợ các tính năng thông minh mới nhất từ Apple.</p>
      <p>Màn hình Super Retina XDR với công nghệ ProMotion cho tốc độ làm mới 120Hz, mang đến trải nghiệm mượt mà và tiết kiệm pin. Sản phẩm còn được trang bị cổng USB-C, hỗ trợ kết nối với nhiều thiết bị và phụ kiện.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/15.jpg",
    price: 1299.99,
    discountPrice: 1199.99,
    stock: 50,
    status: "active",
    reviewCount: 28,
    averageRating: 4.7
  },
  {
    id: 2,
    category: "Laptop",
    name: "MacBook Pro M3 14 inch",
    description: "Laptop mỏng nhẹ, mạnh mẽ với chip M3 và màn hình Retina tuyệt đẹp.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Màn hình: 14 inch, Liquid Retina XDR, 120Hz</li>
        <li>CPU: Apple M3 Pro, 10 nhân</li>
        <li>RAM: 16GB</li>
        <li>Bộ nhớ: SSD 512GB</li>
        <li>Đồ họa: GPU 16 nhân tích hợp</li>
        <li>Cổng kết nối: 3x Thunderbolt 4, HDMI, Jack 3.5mm, MagSafe 3</li>
        <li>Pin: Lên đến 18 giờ sử dụng</li>
        <li>Hệ điều hành: macOS Sonoma</li>
      </ul>
      <p>MacBook Pro M3 là bước đột phá về hiệu năng với con chip Apple Silicon thế hệ mới. Máy xử lý nhanh chóng các tác vụ đồ họa nặng, chỉnh sửa video 4K mượt mà và có thời lượng pin ấn tượng.</p>
      <p>Màn hình Liquid Retina XDR với độ sáng cao, hiển thị màu sắc chân thực và hỗ trợ HDR. Bàn phím Magic Keyboard thoải mái khi gõ, cùng với hệ thống âm thanh 6 loa cho trải nghiệm giải trí tuyệt vời.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/lab.jpg",
    price: 1999.99,
    discountPrice: 1849.99,
    stock: 30,
    status: "active",
    reviewCount: 42,
    averageRating: 4.9
  },
  {
    id: 3,
    category: "Tai nghe",
    name: "AirPods Pro 2",
    description: "Tai nghe không dây cao cấp với khả năng chống ồn chủ động và âm thanh không gian.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Loại: Tai nghe không dây in-ear</li>
        <li>Chip: H2</li>
        <li>Tính năng: Chống ồn chủ động, Âm thanh không gian, Chế độ xuyên âm</li>
        <li>Thời lượng pin: 6 giờ (tai nghe), 30 giờ (với hộp sạc)</li>
        <li>Chuẩn kháng nước: IPX4</li>
        <li>Kết nối: Bluetooth 5.3</li>
        <li>Sạc: USB-C, sạc không dây</li>
      </ul>
      <p>AirPods Pro 2 mang đến trải nghiệm âm thanh cao cấp với công nghệ chống ồn chủ động hiệu quả gấp đôi thế hệ trước. Âm thanh không gian với theo dõi chuyển động đầu tạo trải nghiệm nghe nhạc và xem phim đắm chìm.</p>
      <p>Điều khiển cảm ứng trên thân tai nghe cho phép điều chỉnh âm lượng, chuyển bài hát và nhận cuộc gọi. Hộp sạc được nâng cấp với loa tích hợp để dễ dàng tìm kiếm khi bị thất lạc và khả năng sạc không dây tiện lợi.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/pod.jpg",
    price: 249.99,
    discountPrice: null,
    stock: 100,
    status: "active",
    reviewCount: 56,
    averageRating: 4.6
  },
  {
    id: 4,
    category: "Tablet",
    name: "iPad Pro M2 11-inch",
    description: "Máy tính bảng mạnh mẽ với màn hình Liquid Retina và chip M2.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Màn hình: 11 inch, Liquid Retina, 120Hz</li>
        <li>CPU: Apple M2, 8 nhân</li>
        <li>RAM: 8GB</li>
        <li>Bộ nhớ: 256GB</li>
        <li>Camera sau: 12MP (góc rộng) + 10MP (góc siêu rộng) + LiDAR</li>
        <li>Camera trước: 12MP Ultra Wide</li>
        <li>Pin: 10 giờ sử dụng</li>
        <li>Kết nối: Wi-Fi 6E, Bluetooth 5.3, USB-C</li>
      </ul>
      <p>iPad Pro M2 mang đến hiệu năng vượt trội cho các tác vụ đồ họa, thiết kế và làm việc chuyên nghiệp. Màn hình Liquid Retina với ProMotion cho trải nghiệm mượt mà khi vẽ với Apple Pencil hay lướt web.</p>
      <p>Hỗ trợ Apple Pencil thế hệ 2 với độ trễ thấp và khả năng nhận diện lực nhấn. Kết hợp với Magic Keyboard, iPad Pro trở thành một máy tính nhỏ gọn, linh hoạt cho công việc và giải trí.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/ipad.jpg",
    price: 799.99,
    discountPrice: 749.99,
    stock: 45,
    status: "active",
    reviewCount: 38,
    averageRating: 4.8
  },
  {
    id: 5,
    category: "Đồng hồ thông minh",
    name: "Apple Watch Series 9",
    description: "Đồng hồ thông minh với màn hình luôn hiển thị, tính năng theo dõi sức khỏe toàn diện.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Màn hình: LTPO OLED Always-On, 484 x 396 pixel</li>
        <li>Kích thước: 41mm hoặc 45mm</li>
        <li>Chip: Apple S9</li>
        <li>Bộ nhớ: 32GB</li>
        <li>Cảm biến: Nhịp tim quang học, ECG, SpO2, nhiệt độ, la bàn, cao độ</li>
        <li>Kết nối: Bluetooth 5.3, Wi-Fi, NFC, LTE (tùy phiên bản)</li>
        <li>Pin: Lên đến 18 giờ sử dụng thông thường, 36 giờ ở chế độ tiết kiệm pin</li>
        <li>Kháng nước: 50m</li>
      </ul>
      <p>Apple Watch Series 9 là trợ lý sức khỏe toàn diện trên cổ tay với khả năng đo nhịp tim, điện tâm đồ, nồng độ oxy trong máu và nhiệt độ cơ thể. Theo dõi giấc ngủ chi tiết và phân tích các giai đoạn ngủ.</p>
      <p>Tính năng phát hiện té ngã, phát hiện tai nạn và SOS khẩn cấp giúp bảo vệ người dùng. Hỗ trợ nhiều loại bài tập với các chỉ số chuyên sâu và tích hợp Apple Fitness+ cho trải nghiệm tập luyện tại nhà.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/dh.jpg",
    price: 399.99,
    discountPrice: 379.99,
    stock: 60,
    status: "active",
    reviewCount: 31,
    averageRating: 4.5
  },
  {
    id: 6,
    category: "Loa",
    name: "HomePod mini",
    description: "Loa thông minh nhỏ gọn với âm thanh 360 độ và tích hợp Siri.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Kích thước: 84.3 x 97.9 mm</li>
        <li>Trọng lượng: 345g</li>
        <li>Âm thanh: Loa toàn dải, hai loa passive radiator</li>
        <li>Chip: Apple S5</li>
        <li>Microphone: Mảng 4 microphone</li>
        <li>Kết nối: Bluetooth 5.0, Wi-Fi 802.11n, Thread</li>
        <li>Tính năng: Siri, AirPlay 2, HomeKit hub</li>
        <li>Màu sắc: Trắng, Đen, Cam, Vàng, Xanh dương</li>
      </ul>
      <p>HomePod mini mang đến âm thanh 360 độ sống động trong thiết kế nhỏ gọn. Công nghệ tính toán âm học và bộ xử lý S5 tạo ra trải nghiệm nghe nhạc phong phú với bass mạnh mẽ và vocal trong trẻo.</p>
      <p>Tích hợp trợ lý ảo Siri giúp điều khiển nhạc, trả lời câu hỏi và điều khiển thiết bị thông minh trong nhà. Tính năng Intercom cho phép gửi tin nhắn tới các thiết bị Apple khác trong gia đình. Kết nối nhiều HomePod mini để tạo hệ thống âm thanh đa phòng.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/loa.jpg",
    price: 99.99,
    discountPrice: null,
    stock: 75,
    status: "active",
    reviewCount: 24,
    averageRating: 4.3
  },
  {
    id: 7,
    category: "Phụ kiện",
    name: "Apple Pencil Pro",
    description: "Bút cảm ứng thế hệ mới với độ trễ thấp và cảm biến áp lực.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Kết nối: Bluetooth, Nam châm</li>
        <li>Tính năng: Cảm biến áp lực, Cảm biến nghiêng, Cử chỉ cuộn</li>
        <li>Độ trễ: 9ms</li>
        <li>Pin: Sử dụng liên tục 12 giờ</li>
        <li>Sạc: USB-C, sạc không dây</li>
        <li>Tương thích: iPad Pro, iPad Air thế hệ mới</li>
        <li>Màu sắc: Trắng</li>
      </ul>
      <p>Apple Pencil Pro là công cụ sáng tạo hoàn hảo cho nghệ sĩ, nhà thiết kế và người dùng yêu thích ghi chú. Độ trễ cực thấp và độ chính xác cao mang lại cảm giác như viết trên giấy thật.</p>
      <p>Tính năng cử chỉ cuộn cho phép thay đổi công cụ, kích thước bút và màu sắc nhanh chóng. Cảm biến áp lực thông minh điều chỉnh độ đậm nhạt của nét vẽ theo lực nhấn, tạo ra những tác phẩm nghệ thuật chuyên nghiệp.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/pencil.jpg",
    price: 129.99,
    discountPrice: 119.99,
    stock: 90,
    status: "active",
    reviewCount: 19,
    averageRating: 4.7
  },
  {
    id: 8,
    category: "Điện thoại",
    name: "Samsung Galaxy S23 Ultra",
    description: "Điện thoại Android cao cấp với bút S Pen và camera zoom 100x.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Màn hình: 6.8 inch, Dynamic AMOLED 2X, 120Hz</li>
        <li>CPU: Snapdragon 8 Gen 2</li>
        <li>RAM: 12GB</li>
        <li>Bộ nhớ trong: 256GB</li>
        <li>Camera sau: 200MP (chính) + 12MP (góc siêu rộng) + 10MP (telephoto 3x) + 10MP (telephoto 10x)</li>
        <li>Camera trước: 12MP</li>
        <li>Pin: 5000mAh, sạc nhanh 45W</li>
        <li>Kèm bút S Pen</li>
      </ul>
      <p>Samsung Galaxy S23 Ultra là flagship Android mạnh mẽ với camera 200MP và khả năng zoom quang học 10x, zoom kỹ thuật số 100x. Bút S Pen tích hợp mang đến khả năng ghi chú, vẽ và điều khiển từ xa tiện lợi.</p>
      <p>Màn hình Dynamic AMOLED 2X với độ sáng cao, hiển thị rõ nét ngay dưới ánh nắng mặt trời. Chip Snapdragon 8 Gen 2 phiên bản đặc biệt cho Galaxy mang đến hiệu năng vượt trội cho gaming và đa nhiệm.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/ss.jpg",
    price: 1199.99,
    discountPrice: 1099.99,
    stock: 40,
    status: "active",
    reviewCount: 35,
    averageRating: 4.6
  },
  {
    id: 9,
    category: "Laptop",
    name: "Dell XPS 15",
    description: "Laptop cao cấp với màn hình OLED, hiệu năng mạnh mẽ cho công việc sáng tạo.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Màn hình: 15.6 inch, 4K OLED, cảm ứng</li>
        <li>CPU: Intel Core i9-13900H</li>
        <li>RAM: 32GB DDR5</li>
        <li>Ổ cứng: SSD 1TB NVMe</li>
        <li>Đồ họa: NVIDIA RTX 4070 8GB</li>
        <li>Pin: Lên đến 12 giờ</li>
        <li>Cổng kết nối: 2x Thunderbolt 4, USB-C, jack 3.5mm, đầu đọc thẻ SD</li>
        <li>Trọng lượng: 1.96kg</li>
      </ul>
      <p>Dell XPS 15 là máy tính xách tay cao cấp với thiết kế mỏng nhẹ, vỏ nhôm CNC và carbon fiber. Màn hình OLED 4K hiển thị 100% DCI-P3, độ chính xác màu tuyệt vời cho công việc thiết kế đồ họa và chỉnh sửa video.</p>
      <p>Hiệu năng mạnh mẽ với CPU Intel thế hệ 13 và GPU NVIDIA RTX series, xử lý mượt mà các phần mềm sáng tạo nặng như Adobe Premiere, After Effects và DaVinci Resolve. Hệ thống tản nhiệt tiên tiến giúp duy trì hiệu suất ổn định trong thời gian dài.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/lab.jpg",
    price: 2499.99,
    discountPrice: 2299.99,
    stock: 25,
    status: "active",
    reviewCount: 22,
    averageRating: 4.8
  },
  {
    id: 10,
    category: "Máy ảnh",
    name: "Sony Alpha A7 IV",
    description: "Máy ảnh mirrorless full-frame với cảm biến 33MP và quay video 4K 60fps.",
    details: `
      <h4>Thông số kỹ thuật:</h4>
      <ul>
        <li>Cảm biến: CMOS Exmor R Full-frame 33MP</li>
        <li>Bộ xử lý: BIONZ XR</li>
        <li>Dải ISO: 100-51200 (mở rộng 50-204800)</li>
        <li>Tốc độ chụp liên tiếp: 10fps</li>
        <li>Video: 4K 60fps 10-bit 4:2:2, Full HD 120fps</li>
        <li>Màn hình: LCD 3.0 inch, xoay lật, cảm ứng</li>
        <li>EVF: 3.68 triệu điểm, phóng đại 0.78x</li>
        <li>Kết nối: Wi-Fi, Bluetooth, USB-C, HDMI, jack 3.5mm</li>
        <li>Pin: NP-FZ100, quay liên tục 580 ảnh</li>
      </ul>
      <p>Sony Alpha A7 IV là máy ảnh mirrorless full-frame đa năng với cảm biến 33MP thế hệ mới, mang đến chất lượng hình ảnh vượt trội trong cả chụp ảnh và quay video. Hệ thống lấy nét tự động AI nhanh chóng và chính xác, theo dõi mắt con người, động vật và chim.</p>
      <p>Khả năng quay video 4K 60fps không crop với định dạng 10-bit 4:2:2 đáp ứng nhu cầu sản xuất nội dung chuyên nghiệp. Thiết kế công thái học cải tiến với grip lớn hơn, nút bấm tùy chỉnh và menu giao diện mới dễ sử dụng.</p>
    `,
    image: "/assets/img/portfolio/thumbnails/cam.jpg",
    price: 2499.99,
    discountPrice: null,
    stock: 15,
    status: "active",
    reviewCount: 18,
    averageRating: 4.9
  }
];

export default productData;