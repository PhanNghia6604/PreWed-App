import React, { useEffect, useState } from "react";
import styles from "./ExpertAppointments.module.css";  // Import CSS Module

export const ExpertAppointments = () => {
    const [expert, setExpert] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || null;
        const expertData = Array.isArray(storedExperts) ? storedExperts[0] : storedExperts;
        setExpert(expertData);

        if (expertData) {
            // Lấy danh sách lịch hẹn từ tất cả user
            const allBooking = Object.keys(localStorage)
                .filter((key) => key.startsWith("bookings_"))
                .flatMap((key) => JSON.parse(localStorage.getItem(key)));

            // Lọc lịch hẹn của chuyên gia theo expertId
            const expertAppointments = allBooking.filter(
                (booking) => String(booking.expertId) === String(expertData.id)
            );

            setAppointments(expertAppointments);
        }
    }, []);

    if (!expert) return <div className={styles.notFound}>Bạn chưa đăng nhập</div>;

    return (
        <div className={styles.container}>
            <h2>📅 Lịch hẹn của tôi</h2>
            {appointments.length === 0 ? (
                <p>Không có lịch hẹn nào.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Khách hàng</th>
                            <th>Ngày</th>
                            <th>Thời gian</th>  
                            <th>Gói dịch vụ</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>{appt.userName || "Không rõ"}</td>
                                <td>{appt.date}</td>
                                <td>{appt.time || "Không rõ"}</td> {/* Hiển thị thời gian */}
                                <td>{appt.packageName}</td>
                                <td>{appt.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
