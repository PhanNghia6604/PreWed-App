import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./PendingExpert.module.css"; // Import CSS module

const PendingExperts = () => {
    const [pendingExperts, setPendingExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    useEffect(() => {
        fetchPendingExperts();
    }, []);

    const fetchPendingExperts = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
            return;
        }

        fetch("/api/expert/pending", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Pending Experts:", data);
                setPendingExperts(data);
            })
            .catch((error) => console.error("Lỗi khi tải dữ liệu:", error))
            .finally(() => setLoading(false));
    };

    const approveExpert = (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
            return;
        }

        fetch(`/api/expert/approve/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.ok) {
                    alert("Phê duyệt thành công!");
                    setPendingExperts((prev) => prev.filter((expert) => expert.id !== id));
                } else {
                    alert("Có lỗi xảy ra khi phê duyệt.");
                }
            })
            .catch((error) => console.error("Lỗi khi phê duyệt:", error));
    };

    if (loading) return <p>Đang tải danh sách...</p>;

    return (
        <div className={styles.container}>
            <h2>Danh sách chuyên gia chờ phê duyệt</h2>


            {pendingExperts.length === 0 ? (
                <p>Không có chuyên gia nào đang chờ phê duyệt.</p>
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
                                        <img src={expert.avatar} alt={expert.name} />
                                    </td>
                                    <td>{expert.name}</td>
                                    <td>{expert.email}</td>
                                    <td>{expert.phone}</td>
                                    <td>{expert.address}</td>
                                    <td>{expert.specialty}</td>
                                    <td>
                                        <ul>
                                            {expert.certificates.map((cert, index) => (
                                                <li key={index}>{cert}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className={styles.actionButtons}>
                                        <button className={styles.approveBtn} onClick={() => approveExpert(expert.id)}>
                                            Duyệt
                                        </button>
                                        <button className={styles.rejectBtn}>Từ chối</button>
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
