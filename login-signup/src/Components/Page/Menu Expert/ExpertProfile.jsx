import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExpertProfile.module.css";

const ExpertProfile = () => {
    const navigate = useNavigate();
    const [expertData, setExpertData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExpertData = async () => {
            const token = localStorage.getItem("token");
            let expertId = localStorage.getItem("expertId");
    
            if (!token || !expertId) {
                navigate("/expert-login");
                return;
            }
    
            try {
                const response = await fetch(`/api/expert/profile/${expertId}`, {
                    headers: { "Authorization": `Bearer ${token}` },
                });
    
                if (!response.ok) throw new Error("Không thể tải thông tin chuyên gia.");
    
                const data = await response.json();
                setExpertData(data);
            } catch (err) {
                setError(err.message);
            }
        };
    
        setTimeout(fetchExpertData, 500); // Chờ 0.5s để đảm bảo dữ liệu đã được lưu
    }, [navigate]);
    

    // Xử lý thay đổi input
    const handleChange = (e, index, field) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (field) {
            const updatedArray = [...expertData[field]];
            updatedArray[index] = value;
            setExpertData({ ...expertData, [field]: updatedArray });
        } else {
            setExpertData({ ...expertData, [name]: value });
        }
    };

    // Xử lý tải ảnh đại diện
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setExpertData({ ...expertData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Xử lý thêm & xóa phần tử của mảng (chứng chỉ)
    const handleAddItem = (field) => {
        setExpertData({ ...expertData, [field]: [...expertData[field], ""] });
    };
    const handleRemoveItem = (index, field) => {
        const updatedArray = expertData[field].filter((_, i) => i !== index);
        setExpertData({ ...expertData, [field]: updatedArray });
    };

    // Xử lý lưu thông tin
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const expertId = localStorage.getItem("expertId");

            if (!expertData.name || !expertData.phone || !expertData.email || !expertData.specialty) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            const response = await fetch(`/api/expert/profile/${expertId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expertData),
            });

            if (!response.ok) throw new Error("Không thể cập nhật thông tin.");

            alert("Cập nhật thông tin thành công!");
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("expertId");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole"); // Xóa luôn vai trò người dùng nếu có
        navigate("/"); // Chuyển về trang đăng nhập
    };

    if (error) return <p className={styles.error}>{error}</p>;
    if (!expertData) return <p>Đang tải...</p>;

    return (
        <div className={styles["profile-container"]}>
            <h2>Hồ sơ chuyên gia</h2>
            <div className={styles["profile-form"]}>
                {/* Ảnh đại diện */}
                <label>Ảnh đại diện:</label>
                <div className={styles["avatar-container"]}>
                    {expertData.avatar ? (
                        <img src={expertData.avatar} alt="Avatar" className={styles.avatar} />
                    ) : (
                        <div className={styles["avatar-placeholder"]}>Chưa có ảnh</div>
                    )}
                    {isEditing && <input type="file" accept="image/*" onChange={handleImageUpload} />}
                </div>

                {/* Thông tin cá nhân */}
                {["name", "phone", "address", "email", "specialty"].map((field) => (
                    <div key={field}>
                        <label>{field === "specialty" ? "Chuyên môn" : field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        {isEditing ? (
                            <input type="text" name={field} value={expertData[field]} onChange={handleChange} />
                        ) : (
                            <p>{expertData[field]}</p>
                        )}
                    </div>
                ))}

                {/* Chứng chỉ */}
                <label>Chứng chỉ:</label>
                <ul>
                    {expertData.certificates.map((certificate, index) => (
                        <li key={index}>
                            {isEditing ? (
                                <>
                                    <input type="text" value={certificate} onChange={(e) => handleChange(e, index, "certificates")} />
                                    <button type="button" onClick={() => handleRemoveItem(index, "certificates")}>Xóa</button>
                                </>
                            ) : (
                                certificate
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing && <button type="button" onClick={() => handleAddItem("certificates")}>+ Thêm chứng chỉ</button>}

                {/* Nút hành động */}
                {isEditing ? (
                    <button onClick={handleSave} className={styles["save-btn"]}>Lưu thay đổi</button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className={styles["edit-btn"]}>Chỉnh sửa</button>
                )}
                <button onClick={handleLogout} className={styles["logout-btn"]}>Đăng xuất</button>
            </div>
        </div>
    );
};

export default ExpertProfile;
