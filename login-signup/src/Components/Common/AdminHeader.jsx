import React, { useState , useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import styles from "./AdminHeader.module.css"; // Import CSS

export const AdminHeader = ({ isLoggedIn, setIsLoggedIn }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // Đảm bảo màu sáng cho biểu tượng khi trang tải lại
        const icon = document.getElementById("account-icon");
        if (icon) {
          icon.style.color = "#ffffff"; // Màu sáng mặc định
        }
      }, []); // Chạy một lần khi trang tải lại

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminData");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setAnchorEl(null);

        setTimeout(() => {
            window.location.href = "/";
        }, 100);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>Admin Dashboard</div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <Link to="/admin-users" className={styles.navLink}>Quản lý người dùng</Link>
                    <Link to="/admin-slots" className={styles.navLink}>Quản lý tạo slot</Link>
                    <Link to="/admin-servicepackage" className={styles.navLink}>Quản lý gói dịch vụ</Link>
                    <Link to="/admin-reports" className={styles.navLink}>Báo cáo thu nhập</Link>
                    <Link to="/admin-blogs" className={styles.navLink}>Quản lý Blogs</Link>

                    {/* User Menu */}
{isLoggedIn && (
  <>
  <IconButton
  onClick={(e) => setAnchorEl(e.currentTarget)}
  className={styles.menuIcon}
  id="account-icon"  // Thêm ID duy nhất cho biểu tượng
>
  <AccountCircle fontSize="large" />
</IconButton>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      keepMounted
      id="user-menu"  // Thêm id để tránh xung đột
    >
      <MenuItem
        onClick={() => {
          navigate("/admin-profile");
          setAnchorEl(null);
        }}
        className={styles.menuItem}
      >
        Hồ sơ
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        className={styles.menuItem}
      >
        Đăng xuất
      </MenuItem>
    </Menu>
  </>
)}

                </nav>
            </div>
        </header>
    );
};
