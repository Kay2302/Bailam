import React from "react";
import { Link } from "react-router-dom";
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/Tintuc">Tin tức</Link></li>
        <li><Link to="/LienHe">Liên hệ</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;