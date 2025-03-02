import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExpertProfile.module.css";

const ExpertProfile = () => {
    const navigate = useNavigate();
    const [expertData, setExpertData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem("currentExpert");
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
        const currentExpert = storedExperts.find((exp) => exp.username === username);

        if (currentExpert) {
            setExpertData({
                ...currentExpert,
                certificates: currentExpert.certificates || [],
                consultingPrices: currentExpert.consultingPrices || [],
                workingSchedule: currentExpert.workingSchedule || [],
                avatar: currentExpert.avatar || "",
            });
        } else {
            alert("Không tìm thấy thông tin chuyên gia!");
            navigate("/expert-login");
        }
    }, [navigate]);

    // Xử lý thay đổi input
    const handleChange = (e, index, field) => {
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

    // Xử lý thêm & xóa phần tử của mảng (chứng chỉ, giá tư vấn, lịch làm việc)
    const handleAddItem = (field) => {
        setExpertData({ ...expertData, [field]: [...expertData[field], ""] });
    };
    const handleRemoveItem = (index, field) => {
        const updatedArray = expertData[field].filter((_, i) => i !== index);
        setExpertData({ ...expertData, [field]: updatedArray });
    };

    // Xử lý lưu thông tin
    const handleSave = () => {
        if (!expertData.name || !expertData.phone || !expertData.email || !expertData.specialty) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
        const updatedExperts = storedExperts.map((exp) =>
            exp.username === expertData.username ? expertData : exp
        );

        localStorage.setItem("experts", JSON.stringify(updatedExperts));
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentExpert");
        navigate("/expert-login");
    };

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

                {/* Giá tư vấn */}
                <label>Giá tư vấn:</label>
                <ul>
                    {expertData.consultingPrices.map((price, index) => (
                        <li key={index}>
                            {isEditing ? (
                                <>
                                    <input type="text" value={price} onChange={(e) => handleChange(e, index, "consultingPrices")} />
                                    <button type="button" onClick={() => handleRemoveItem(index, "consultingPrices")}>Xóa</button>
                                </>
                            ) : (
                                price
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing && <button type="button" onClick={() => handleAddItem("consultingPrices")}>+ Thêm gói tư vấn</button>}

                {/* Lịch làm việc */}
                <label>Lịch làm việc:</label>
                <ul>
                    {expertData.workingSchedule.map((schedule, index) => (
                        <li key={index}>
                            {isEditing ? (
                                <>
                                    <input type="text" value={schedule} onChange={(e) => handleChange(e, index, "workingSchedule")} />
                                    <button type="button" onClick={() => handleRemoveItem(index, "workingSchedule")}>Xóa</button>
                                </>
                            ) : (
                                schedule
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing && <button type="button" onClick={() => handleAddItem("workingSchedule")}>+ Thêm lịch làm việc</button>}

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
