import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";

const Profile = () => {
    const [user, setUser] = useState({
        username: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "https://via.placeholder.com/120",
        joinedDate: "01/01/2024",
        bio: "Chưa có mô tả bản thân."
    });

    useEffect(() => {
        // Kiểm tra nếu "user" trong localStorage tồn tại
        const storedUser = localStorage.getItem("user");
    
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    username: parsedUser.username || "",
                    name: parsedUser.fullName || "", // Kiểm tra giá trị null
                    email: parsedUser.email || "",
                    phone: parsedUser.phone || "",
                    address: parsedUser.address || "",
                    avatar: "https://via.placeholder.com/120", // Nếu API không có avatar
                    joinedDate: "01/01/2024",
                    bio: "Chưa có mô tả bản thân."
                });
            } catch (error) {
                console.error("❌ Lỗi parse JSON:", error);
            }
        }
    }, []);
    

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>Thông Tin Cá Nhân</h2>

            <div className={styles.profileHeader}>
                <img src={user.avatar} alt="Avatar" className={styles.profileAvatar} />
                <div className={styles.profileMainInfo}>
                    <h3>{user.username}</h3>
                </div>
            </div>

            <div className={styles.profileDetails}>
                <p className={styles.profileInfo}><strong>Họ và tên:</strong> {user.name}</p> {/* Thêm fullName */}
                <p className={styles.profileInfo}><strong>Email:</strong> {user.email}</p>
                <p className={styles.profileInfo}><strong>Phone:</strong> {user.phone}</p>
                <p className={styles.profileInfo}><strong>Address:</strong> {user.address}</p>
                <p className={styles.profileInfo}><strong>Giới thiệu:</strong> {user.bio}</p>
            </div>
        </div>
    );
};

export default Profile;
