import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navlink } from '../fake data/data.js';
import { AccountCircle, Notifications as NotificationsIcon } from '@mui/icons-material';
import { Menu, MenuItem, IconButton, Badge } from "@mui/material";

export const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    console.log("isLoggedIn trong Header:", isLoggedIn);
    const [responsive, setResponsive] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null); // State cho dropdown thông báo
    const [notificationsCount, setNotificationsCount] = useState(0); // Số lượng thông báo
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId"); // ID của user đã đăng nhập

            fetch(`/api/booking`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // Lọc danh sách booking dành riêng cho user đã đăng nhập
                    const filteredData = data.filter(
                        (booking) => booking.user?.id.toString() === userId
                    );

                    // Đếm số lượng thông báo cho các trạng thái
                    const pendingCount = filteredData.filter((booking) => booking.status === "PENDING").length;
                    const pendingPaymentCount = filteredData.filter((booking) => booking.status === "PENDING_PAYMENT").length;
                    const awaitingResponseCount = filteredData.filter((booking) => booking.status === "AWAIT").length;

                    // Tổng số thông báo
                    setNotificationsCount(pendingCount + pendingPaymentCount + awaitingResponseCount);

                    // Lưu danh sách thông báo
                    setNotifications(filteredData);
                } else {
                    console.error("Dữ liệu API không hợp lệ:", data);
                }
            })
            .catch((error) => console.error("Lỗi khi lấy thông tin booking:", error));
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        localStorage.removeItem("bookings_id");
        localStorage.removeItem("expertData");

        setIsLoggedIn(false);
        setAnchorEl(null);

        navigate("/");
        window.location.reload(); // Làm mới trang
    };

    const handleNotificationsClick = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
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
      {/* Icon Thông Báo */}
      <div className='icon-noti'>
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={notificationsCount} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
      </div>

      {/* Dropdown Menu Thông Báo */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleNotificationsClose}>
              {`Booking ID: ${notification.id} - Status: ${notification.status}`}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleNotificationsClose}>Không có thông báo</MenuItem>
        )}
      </Menu>

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