import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navlink } from '../fake data/data.js';
import logo from '../fake data/images/logo.png';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { Menu, MenuItem, IconButton } from "@mui/material";

export const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    console.log("isLoggedIn trong Header:", isLoggedIn);
    const [responsive, setResponsive] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        localStorage.removeItem("expertData");
        // Xóa bookings_id sau khi logout
        localStorage.removeItem("bookings_id");

        setIsLoggedIn(false);
        setAnchorEl(null);

        navigate("/");
        window.location.reload(); // Refresh lại trang
    };

    return (
        <header>
            <div className="container flexsb">
                <div className="logo">
                    Premarital Preparation Hub
                </div>

                <div className={responsive ? "hideMenu" : "nav"}>
                    {navlink.map((link, i) => (
                        <Link to={link.url} key={i}>
                            {link.text}
                        </Link>
                    ))}

                    {!isLoggedIn ? (
                        <Link to="/login">Login</Link>
                    ) : (
                        <>
                            {/* Nút mở menu tài khoản */}
                            <div className="menu-button-container">
                                <IconButton
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                    color="inherit"
                                >
                                    <AccountCircle fontSize="large" />
                                </IconButton>
                            </div>

                            {/* Menu Dropdown */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={() => navigate("/profile")}>Trang cá nhân</MenuItem>
                                <MenuItem onClick={() => navigate("/test")}>Làm kiểm tra</MenuItem>
                                <MenuItem onClick={() => navigate("history-test")}>Lịch sử làm bài kiểm tra</MenuItem>
                                <MenuItem onClick={() => navigate("/my-booking")}>Lịch đã đặt</MenuItem>
                                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};