import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu chưa đăng nhập thì chuyển về trang login
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Xóa token
    navigate("/admin-login"); // Chuyển hướng về trang login
  };

  return (
    <div className={styles.dashboard}>
      {/* Thanh Navbar */}
      <nav className={styles.navbar}>
        <h1>Admin Dashboard</h1>
        <ul>
          <li><Link to="/admin/revenue">Quản lý thu nhập</Link></li>
          <li><Link to="/admin/users">Quản lý chuyên gia & User</Link></li>
          <li><Link to="/admin/blogs">Quản lý Blog</Link></li>
          <li><Link to="/admin/approve-experts">Phê duyệt chuyên gia</Link></li>
          <li><button onClick={handleLogout} className={styles.logoutBtn}>Đăng xuất</button></li>
        </ul>
      </nav>

      {/* Nội dung trang */}
      <div className={styles.content}>
        <h2>Chào mừng đến với Admin Dashboard!</h2>
        <p>Chọn một mục từ menu để quản lý hệ thống.</p>
      </div>
    </div>
  );
};
