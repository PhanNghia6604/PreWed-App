import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExpertProfile.module.css";

const ExpertProfile = () => {
    const navigate = useNavigate();
    const [expertData, setExpertData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

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

            const uniqueCertificates = Array.from(
                new Map(data.certificates.map(c => [c.certificateName, c])).values()
            );

            setExpertData({ ...data, certificates: uniqueCertificates });
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchExpertData();
    }, []);

    const handleChange = (e, index, field) => {
        const { name, value } = e.target;
        if (field === "certificates") {
            const updatedCertificates = [...expertData.certificates];
            updatedCertificates[index] = { ...updatedCertificates[index], [name]: value };
            setExpertData({ ...expertData, certificates: updatedCertificates });
        } else {
            setExpertData({ ...expertData, [name]: value });
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setExpertData({ ...expertData, avatar: reader.result });
        };
        reader.onerror = (error) => console.error("Lỗi khi đọc file:", error);
    };

    const handleAddItem = (field) => {
        setExpertData({
            ...expertData,
            [field]: [...expertData[field], { certificateName: "", certificateUrl: "" }]
        });
    };

    const handleRemoveItem = (index, field) => {
        const updatedArray = expertData[field].filter((_, i) => i !== index);
        setExpertData({ ...expertData, [field]: updatedArray });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const expertId = localStorage.getItem("expertId");

            if (!expertData.name || !expertData.phone || !expertData.email || !expertData.specialty) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            const response = await fetch("/api/expert/expert/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(expertData),
            });

            if (!response.ok) throw new Error("Không thể cập nhật thông tin.");
            alert("Cập nhật thành công!");
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchExpertData(); // Tải lại dữ liệu gốc
    };

    const handleLogout = () => {
        localStorage.removeItem("expertId");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/");
    };
    // Hàm để hiển thị tất cả chuyên môn nếu "ALL" được chọn
    const displaySpecialty = expertData && expertData.specialty
        ? expertData.specialty.includes("ALL")
            ? ["Tâm lý", "Tài chính", "Gia đình", "Sức khỏe", "Giao tiếp", "Tôn giáo"]
            : expertData.specialty.map((specialty) => {
                switch (specialty) {
                    case "TAMLY":
                        return "Tâm lý";
                    case "TAICHINH":
                        return "Tài chính";
                    case "GIADINH":
                        return "Gia đình";
                    case "SUCKHOE":
                        return "Sức khỏe";
                    case "GIAOTIEP":
                        return "Giao tiếp";
                    case "TONGIAO":
                        return "Tôn giáo";
                    default:
                        return "";
                }
            })
        : []; // Default to an empty array if expertData or specialty is not available

    if (error) return <p className={styles.error}>{error}</p>;
    if (!expertData) return <p>Đang tải...</p>;

    return (
        <div className={styles.expertProfileContainer}>
            <h2 className={styles.expertProfiletitle}>Hồ sơ chuyên gia</h2>
            <div className={styles.profileFormExpertProfile}>
                <label>Ảnh đại diện:</label>
                <div className={styles.avatarContainerExpertProfile}>
                    {expertData.avatar ? (
                        <img src={expertData.avatar} alt="Avatar" className={styles.avatarExpertProfile} />
                    ) : (
                        <div className={styles.avatarPlaceholderExpertProfile}>Chưa có ảnh</div>
                    )}
                    {isEditing && (
                        <>
                            
                            <input type="text" name="avatar" value={expertData.avatar} onChange={handleChange} />
                        </>
                    )}
                </div>

                {["name", "phone", "address", "email"].map((field) => (
                    <div key={field} className={styles.inputContainerExpertProfile}>
                        <label>{field === "specialty" ? "Chuyên môn" : field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        {isEditing ? (
                            <input type="text" name={field} value={expertData[field]} onChange={handleChange} />
                        ) : (
                            <p className={styles.textExpertProfile}>{expertData[field]}</p>
                        )}
                    </div>
                ))}

                <label>Chuyên môn:</label>
                <p className={styles.textExpertProfile}>
                    {displaySpecialty.length > 0 ? displaySpecialty.join(", ") : "Chưa cập nhật"}
                </p>

                <label>Chứng chỉ:</label>
                <ul className={styles.certificatesListExpertProfile}>
                    {expertData.certificates?.map((certificate, index) => (
                        <li key={index} className={styles.certificateItemExpertProfile}>
                            {isEditing ? (
                                <>
                                    <input type="text" name="certificateName" value={certificate.certificateName} onChange={(e) => handleChange(e, index, "certificates")} />
                                    <input type="text" name="certificateUrl" value={certificate.certificateUrl} onChange={(e) => handleChange(e, index, "certificates")} />
                                    <button type="button" onClick={() => handleRemoveItem(index, "certificates")} className={styles.cancelBtnExpertProfile}>Xóa</button>
                                </>
                            ) : (
                                <>
                                    <span>{certificate.certificateName}</span>
                                    {certificate.certificateUrl && <a href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLinkExpertProfile}>Xem chứng chỉ</a>}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                {isEditing && <button type="button" onClick={() => handleAddItem("certificates")} className={styles.addCertificateBtnExpertProfile}>+ Thêm chứng chỉ</button>}

                <div className={styles.buttonGroup}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className={styles.saveBtnExpertProfile}>
                                Lưu thay đổi
                            </button>
                            <button onClick={handleCancel} className={styles.cancelBtnExpertProfile}>
                                Hủy
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className={styles.editBtnExpertProfile}>
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpertProfile;