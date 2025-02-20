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
        setIsLoggedIn(false);
        setAnchorEl(null); // Đóng menu sau khi logout
        navigate("/");
    };

    return (
        <header>
            <div className="container flexsb">
                <div className="logo">
                    <img src={logo} alt="" />
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
                            <IconButton
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                color="inherit"
                            >
                                <AccountCircle fontSize="large" />
                            </IconButton>

                            {/* Menu Dropdown */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={() => navigate("/profile")}>Trang cá nhân</MenuItem>
                                <MenuItem onClick={() => navigate("/test")}>Làm kiểm tra</MenuItem>
                                <MenuItem onClick={() => navigate("")}>Lịch sử làm bài kiểm tra</MenuItem>
                                <MenuItem onClick={() => navigate("")}>Lịch hẹn</MenuItem>
                                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                            </Menu>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};