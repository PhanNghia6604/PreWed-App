import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExpertProfile.module.css";

const ExpertProfile = () => {
    const navigate = useNavigate();
    const [expertData, setExpertData] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa

    useEffect(() => {
        const username = localStorage.getItem("currentExpert");
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];

        const currentExpert = storedExperts.find((exp) => exp.username === username);
        if (currentExpert) {
            setExpertData({
                ...currentExpert,
                certificates: currentExpert.certificates || [],
                consultingPrices: currentExpert.consultingPrices || [],
                avatar: currentExpert.avatar || "",
            });
        } else {
            alert("Không tìm thấy thông tin chuyên gia!");
            navigate("/expert-login");
        }
    }, [navigate]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === "certificates") {
            const updatedCertificates = [...expertData.certificates];
            updatedCertificates[index] = value;
            setExpertData({ ...expertData, certificates: updatedCertificates });
        } else if (name === "consultingPrices") {
            const updatedPrices = [...expertData.consultingPrices];
            updatedPrices[index] = value;
            setExpertData({ ...expertData, consultingPrices: updatedPrices });
        } else {
            setExpertData({ ...expertData, [name]: value });
        }
    };

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

    const handleAddCertificate = () => {
        setExpertData({ 
            ...expertData, 
            certificates: [...expertData.certificates, ""] 
        });
    };

    const handleRemoveCertificate = (index) => {
        const updatedCertificates = expertData.certificates.filter((_, i) => i !== index);
        setExpertData({ ...expertData, certificates: updatedCertificates });
    };

    const handleAddPrice = () => {
        setExpertData({ 
            ...expertData, 
            consultingPrices: [...expertData.consultingPrices, ""] 
        });
    };

    const handleRemovePrice = (index) => {
        const updatedPrices = expertData.consultingPrices.filter((_, i) => i !== index);
        setExpertData({ ...expertData, consultingPrices: updatedPrices });
    };

    const handleSave = () => {
        if (!expertData) return;

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
        setIsEditing(false); // Quay về trạng thái xem thông tin
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
                <label>Ảnh đại diện:</label>
                <div className={styles["avatar-container"]}>
                    {expertData.avatar ? (
                        <img src={expertData.avatar} alt="Avatar" className={styles.avatar} />
                    ) : (
                        <div className={styles["avatar-placeholder"]}>Chưa có ảnh</div>
                    )}
                    {isEditing && <input type="file" accept="image/*" onChange={handleImageUpload} />}
                </div>

                <label>Họ và tên:</label>
                {isEditing ? (
                    <input type="text" name="name" value={expertData.name} onChange={handleChange} />
                ) : (
                    <p>{expertData.name}</p>
                )}

                <label>Số điện thoại:</label>
                {isEditing ? (
                    <input type="text" name="phone" value={expertData.phone} onChange={handleChange} />
                ) : (
                    <p>{expertData.phone}</p>
                )}

                <label>Địa chỉ:</label>
                {isEditing ? (
                    <input type="text" name="address" value={expertData.address} onChange={handleChange} />
                ) : (
                    <p>{expertData.address}</p>
                )}

                <label>Email:</label>
                {isEditing ? (
                    <input type="email" name="email" value={expertData.email} onChange={handleChange} />
                ) : (
                    <p>{expertData.email}</p>
                )}

                <label>Chuyên môn:</label>
                {isEditing ? (
                    <input type="text" name="specialty" value={expertData.specialty} onChange={handleChange} />
                ) : (
                    <p>{expertData.specialty}</p>
                )}

                {isEditing && (
                    <>
                        <label>Chứng chỉ:</label>
                        {expertData?.certificates?.map((certificate, index) => (
                            <div key={index} className={styles["certificate-group"]}>
                                <input type="text" name="certificates" value={certificate} onChange={(e) => handleChange(e, index)} />
                                <button type="button" onClick={() => handleRemoveCertificate(index)}>Xóa</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddCertificate} className={styles["add-btn"]}>+ Thêm chứng chỉ</button>

                        <label>Giá tư vấn:</label>
                        {expertData?.consultingPrices?.map((price, index) => (
                            <div key={index} className={styles["price-group"]}>
                                <input type="text" name="consultingPrices" value={price} onChange={(e) => handleChange(e, index)} />
                                <button type="button" onClick={() => handleRemovePrice(index)}>Xóa</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPrice} className={styles["add-btn"]}>+ Thêm gói tư vấn</button>
                    </>
                )}

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
