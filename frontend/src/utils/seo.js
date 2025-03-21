import tinTucData from '../Data/tinTucData';

// Hàm chuyển đổi tiêu đề thành slug
export const createSlug = (text) => {
  if (!text) return '';
  
  // Chuyển đổi chữ tiếng Việt có dấu thành không dấu
  const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
  
  let result = text.toLowerCase();
  
  // Chuyển đổi ký tự có dấu thành không dấu
  for (let i = 0; i < from.length; i++) {
    result = result.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  
  // Chuyển đổi ký tự đặc biệt thành dấu gạch ngang
  result = result
    .replace(/[^a-z0-9]/g, '-') // Thay thế ký tự không phải chữ cái, số thành dấu gạch ngang
    .replace(/-+/g, '-')        // Thay thế nhiều dấu gạch ngang liên tiếp thành một dấu
    .replace(/^-+|-+$/g, '');   // Xóa dấu gạch ngang ở đầu và cuối
  
  return result;
};

// Tạo URL thân thiện với SEO
export const createSeoUrl = (item) => {
  const slug = createSlug(item.title);
  return `/tin-tuc/${slug}-${item.id}.html`;
};

// Xử lý sitemap
export const sitemap = {
  generateSitemap: () => {
    const baseUrl = window.location.origin;
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Thêm trang chủ
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // Thêm trang tin tức chi tiết
    tinTucData.forEach(item => {
      const seoUrl = createSeoUrl(item);
      xml += `  <url>\n    <loc>${baseUrl}${seoUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    
    xml += '</urlset>';
    
    // Trong môi trường thực tế, bạn sẽ lưu file này vào thư mục public
    console.log('Sitemap generated:', xml);
    
    return xml;
  }
};