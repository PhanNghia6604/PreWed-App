import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./PendingExpert.module.css"; // Import CSS module
const specialtyMap = {
    TAMLY: "Tâm lý",
    TAICHINH: "Tài chính",
    GIADINH: "Gia đình",
    SUCKHOE: "Sức khỏe",
    GIAOTIEP: "Giao tiếp",
    TONGIAO: "Tôn giáo",
};

const PendingExperts = () => {
    const [pendingExperts, setPendingExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    useEffect(() => {
        fetchPendingExperts();
    }, []);

    const fetchPendingExperts = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
            return;
        }

        try {
            const response = await fetch("/api/expert/pending", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Lỗi khi tải dữ liệu");

            const data = await response.json();
            console.log("Pending Experts:", data);
            setPendingExperts(data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };
    const approveExpert = (id) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
            return;
        }
    
        alert("Phê duyệt thành công!");
        const originalExperts = [...pendingExperts]; // Lưu danh sách cũ để khôi phục nếu lỗi
        setPendingExperts((prev) => prev.filter((expert) => expert.id !== id));
    
        fetch(`/api/expert/approve/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Có lỗi xảy ra khi phê duyệt.");
                    setPendingExperts(originalExperts); // Khôi phục danh sách nếu lỗi
                }
            })
            .catch((error) => {
                console.error("Lỗi khi phê duyệt:", error);
                setPendingExperts(originalExperts); // Khôi phục nếu lỗi
            });
    };
    
    const rejectExpert = (id) => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
            return;
        }
    
        alert("Từ chối thành công!"); 
        const originalExperts = [...pendingExperts]; // Lưu danh sách cũ để khôi phục nếu lỗi
        setPendingExperts((prev) => prev.filter((expert) => expert.id !== id));
    
        fetch(`/api/expert/reject/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Có lỗi xảy ra khi từ chối.");
                    setPendingExperts(originalExperts); // Khôi phục danh sách nếu lỗi
                }
            })
            .catch((error) => {
                console.error("Lỗi khi từ chối:", error);
                setPendingExperts(originalExperts); // Khôi phục nếu lỗi
            });
    };
    
    if (loading) return <p>Đang tải danh sách...</p>;

    return (
        <div className={styles.container}>
            <h2>Danh sách chuyên gia chờ phê duyệt</h2>

            {pendingExperts.length === 0 ? (
                <p className={styles.noExperts}>Không có chuyên gia nào đang chờ phê duyệt.</p>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Chuyên môn</th>
                                <th>Chứng chỉ</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingExperts.map((expert) => (
                                <tr key={expert.id}>
                                    <td>
                                        <img src={expert.avatar} alt={expert.name} className={styles.avatar} />
                                    </td>
                                    <td>{expert.name}</td>
                                    <td>{expert.email}</td>
                                    <td>{expert.phone}</td>
                                    <td>{expert.address}</td>
                                    <td>{specialtyMap[expert.specialty] || "Không xác định"}</td>
                                    <td>
                                        <ul className={styles.certList}>
                                            {expert.certificates.map((cert) => (
                                                <li key={cert.id}>
                                                    <strong>{cert.certificateName}</strong> <br />
                                                    <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                                                        [Xem chứng chỉ]
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className={styles.actionButtons}>
                                        <button className={styles.approveBtn} onClick={() => approveExpert(expert.id)}>
                                            ✔ Duyệt
                                        </button>
                                        <button className={styles.rejectBtn} onClick={() => rejectExpert(expert.id)}>
                                            ✖ Từ chối
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className={styles.backButtonContainer}>
                <button className={styles.backButton} onClick={() => navigate("/admin-users")}>
                    ⬅ Quay lại
                </button>
            </div>
        </div>
    );
};

export default PendingExperts;
