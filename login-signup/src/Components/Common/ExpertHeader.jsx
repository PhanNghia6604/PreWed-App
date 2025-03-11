import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import styles from "./ExpertHeader.module.css"; // Import CSS Module

export const ExpertHeader = ({ isLoggedIn, setIsLoggedIn }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("expertData");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setAnchorEl(null); // Đóng menu trước khi điều hướng

        // Chuyển hướng về trang chủ
        setTimeout(() => {
            window.location.href = "/";
        }, 100);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>Expert Dashboard</div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <Link to="/expert-dashboard">Dashboard</Link>
                    <Link to="/expert-appointments">Lịch hẹn</Link>
                    <Link to="/expert-profile">Hồ sơ</Link>
                    <Link to="/expert-earning">Xem thu nhập</Link>
                </nav>

                {/* Dropdown Menu khi đăng nhập */}
                {isLoggedIn && (
                    <div className={styles.profileMenu}>
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            className={styles.menuIcon}
                        >
                            <AccountCircle fontSize="large" />
                        </IconButton>
                        <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={() => setAnchorEl(null)}
    PaperProps={{
        style: {
            backgroundColor: "white", // Chỉ đổi màu menu, không phải toàn bộ trang
            color: "black",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Đổ bóng đẹp
            borderRadius: "8px",
            minWidth: "150px",
        },
    }}
    anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
    }}
    transformOrigin={{
        vertical: "top",
        horizontal: "right",
    }}
>

                            <MenuItem
                                onClick={() => {
                                    navigate("/expert-profile");
                                    setAnchorEl(null);
                                }}
                                className={styles.menuItem}
                            >
                                Hồ sơ
                            </MenuItem>
                            <MenuItem onClick={handleLogout} className={styles.menuItem}>
                                Đăng xuất
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </div>
        </header>
    );
};
