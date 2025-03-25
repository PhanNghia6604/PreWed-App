import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";

const Profile = () => {
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        avatar: "https://via.placeholder.com/120",
        joinedDate: "01/01/2024",
        bio: "Chưa có mô tả bản thân."
    });

    const [isEditing, setIsEditing] = useState(false);
    const [originalUser, setOriginalUser] = useState(null); // Lưu dữ liệu gốc

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.userId;

                const fetchUserData = async () => {
                    try {
                        const response = await fetch(`http://localhost:8080/api/${userId}`, {
                            method: "GET",
                            headers: {
                                "accept": "*/*",
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error("Failed to fetch user data");
                        }

                        const data = await response.json();
                        setUser({
                            username: data.username || "",
                            fullName: data.name || "",
                            email: data.email || "",
                            phone: data.phone || "",
                            address: data.address || "",
                            avatar: data.avatar || "https://via.placeholder.com/120",
                            joinedDate: "01/01/2024",
                            bio: "Chưa có mô tả bản thân."
                        });
                    } catch (error) {
                        console.error("❌ Error fetching user data:", error);
                    }
                };

                fetchUserData();
            } catch (error) {
                console.error("❌ Lỗi parse user từ localStorage:", error);
            }
        }
    }, []);

    const handleEditClick = () => {
        setOriginalUser(user); // Lưu thông tin hiện tại
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setUser(originalUser); // Khôi phục dữ liệu cũ
        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const userId = parsedUser.userId;

                const response = await fetch(`http://localhost:8080/api/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        address: user.address
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to update user data");
                }

                const data = await response.json();
                setUser({
                    ...user,
                    fullName: data.name || user.fullName,
                    email: data.email || user.email,
                    phone: data.phone || user.phone,
                    address: data.address || user.address
                });

                setIsEditing(false);
            } catch (error) {
                console.error("❌ Error updating user data:", error);
            }
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>Thông Tin Cá Nhân</h2>

            <div className={styles.profileHeader}>
                <img src={user.avatar} alt="Avatar" className={styles.profileAvatar} />
                <div className={styles.profileMainInfo}>
                    <h3>{user.username}</h3>
                </div>
            </div>

            {isEditing ? (
                <div className={styles.profileDetails}>
                    <input
                        type="text"
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        className={styles.profileInfo}
                    />
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className={styles.profileInfo}
                    />
                    <input
                        type="text"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        className={styles.profileInfo}
                    />
                    <input
                        type="text"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                        className={styles.profileInfo}
                    />
                    <div className={styles.buttonGroup}>
                        <button onClick={handleSaveClick} className={styles.saveButton}>
                            Lưu
                        </button>
                        <button onClick={handleCancelClick} className={styles.cancelButton}>
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.profileDetails}>
                    <p className={styles.profileInfo}><strong>Họ và tên:</strong> {user.fullName}</p>
                    <p className={styles.profileInfo}><strong>Email:</strong> {user.email}</p>
                    <p className={styles.profileInfo}><strong>Phone:</strong> {user.phone}</p>
                    <p className={styles.profileInfo}><strong>Address:</strong> {user.address}</p>
                    <p className={styles.profileInfo}><strong>Giới thiệu:</strong> {user.bio}</p>
                </div>
            )}

            {!isEditing ? (
                <button onClick={handleEditClick} className={styles.editButton}>
                    Chỉnh sửa thông tin
                </button>
            ) : null}
        </div>
    );
};

export default Profile;
