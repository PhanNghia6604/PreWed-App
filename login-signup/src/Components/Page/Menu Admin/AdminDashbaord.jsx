import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu chưa đăng nhập thì chuyển về trang login
    const token = localStorage.getItem("token");
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
      
    </div>
  );
};
