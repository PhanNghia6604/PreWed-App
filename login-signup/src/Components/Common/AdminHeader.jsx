import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import styles from "./AdminHeader.module.css"; // Import CSS Module

export const AdminHeader = ({ isLoggedIn, setIsLoggedIn }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminData");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setAnchorEl(null); // Đóng menu trước khi điều hướng

        // Chuyển hướng về trang chủ và reload toàn bộ ứng dụng
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
                    
                    <Link to="/admin-users">Quản lý người dùng</Link>
                    <Link to="/admin-reports">Báo cáo</Link>
                    <Link to="/admin-settings">Cài đặt</Link>

                    {/* Dropdown Menu khi đăng nhập */}
                    {isLoggedIn && (
                        <>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn chặn sự kiện click gây lỗi
                                    setAnchorEl(e.currentTarget);
                                }}
                                className={styles["menu-icon"]}
                            >
                                <AccountCircle fontSize="large" />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={() => setAnchorEl(null)}
                              keepMounted // Giữ lại menu trong DOM để tránh lỗi render
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate("/admin-profile");
                                        setAnchorEl(null);
                                    }}
                                    className={styles["menu-item"]}
                                >
                                    Hồ sơ
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    className={styles["menu-item"]}
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
