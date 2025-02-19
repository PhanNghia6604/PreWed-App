import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css"; 

const Profile = () => {
    const [user, setUser] = useState({
        username: "",
        email: "example@email.com",
        phone: "123-456-7890",
        address: "123 Main St, City",
        avatar: "https://via.placeholder.com/120", // Avatar mặc định
        joinedDate: "01/01/2024", // Ngày tham gia giả lập
        bio: "Chưa có mô tả bản thân." // Tiểu sử giả lập
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await res.text(); // Chỉ nhận về username

                if (!data || data.includes("Không có thông tin cá nhân")) {
                    setError("Bạn chưa đăng nhập hoặc chưa có thông tin.");
                } else {
                    setUser((prevUser) => ({
                        ...prevUser,
                        username: data
                    }));
                }
            } catch (err) {
                console.error("Lỗi lấy profile:", err);
                setError("Lỗi kết nối đến server.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    // Hàm xử lý khi nhập vào input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    // Hàm lưu thông tin đã chỉnh sửa
    const handleSave = () => {
        setUser(editedUser); // Cập nhật dữ liệu trong React state
        setIsEditing(false);  // Thoát chế độ chỉnh sửa
    };
    

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>Thông Tin Cá Nhân</h2>

            <div className={styles.profileHeader}>
                <img src={user.avatar} alt="Avatar" className={styles.profileAvatar} />
                <div className={styles.profileMainInfo}>
                    <h3>{user.username}</h3>
                    <p className={styles.profileJoinDate}>Tham gia từ: {user.joinedDate}</p>
                </div>
            </div>

            <div className={styles.profileDetails}>
                <p className={styles.profileInfo}>
                    <strong>Email:</strong> 
                    {isEditing ? <input type="email" name="email" value={editedUser.email} onChange={handleChange} /> : user.email}
                </p>
                <p className={styles.profileInfo}>
                    <strong>Phone:</strong> 
                    {isEditing ? <input type="text" name="phone" value={editedUser.phone} onChange={handleChange} /> : user.phone}
                </p>
                <p className={styles.profileInfo}>
                    <strong>Address:</strong> 
                    {isEditing ? <input type="text" name="address" value={editedUser.address} onChange={handleChange} /> : user.address}
                </p>
                <p className={styles.profileInfo}>
                    <strong>Giới thiệu:</strong> 
                    {isEditing ? <textarea name="bio" value={editedUser.bio} onChange={handleChange} /> : user.bio}
                </p>
            </div>

            {isEditing ? (
                <button className={styles.profileSaveButton} onClick={handleSave}>Lưu</button>
            ) : (
                <button className={styles.profileEditButton} onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</button>
            )}
        </div>
    );
};

export default Profile;
