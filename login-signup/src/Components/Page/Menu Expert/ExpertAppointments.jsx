import React, { useEffect, useState } from "react";
import styles from "./ExpertAppointments.module.css";  // Import CSS Module

export const ExpertAppointments = () => {
    const [expert, setExpert] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Lấy thông tin chuyên gia từ LocalStorage và chọn phần tử đầu tiên nếu là mảng
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || null;
        const expertData = Array.isArray(storedExperts) ? storedExperts[0] : storedExperts;
        setExpert(expertData);
    
        if (expertData) {
            // Lấy danh sách lịch hẹn từ tất cả user
            const allBooking = Object.keys(localStorage)
                .filter((key) => key.startsWith("bookings_"))
                .flatMap((key) => JSON.parse(localStorage.getItem(key)));
    
            console.log("Expert từ LocalStorage:", expertData);
            console.log("ID của expert:", expertData.id, typeof expertData.id);
            console.log("Danh sách tất cả lịch hẹn:", allBooking);
    
            allBooking.forEach((booking, index) => {
                console.log(`Lịch hẹn ${index + 1}:`, booking);
                console.log("Expert ID trong lịch hẹn:", booking.expertId, typeof booking.expertId);
            });
    
            // So sánh ID sau khi đảm bảo cùng kiểu dữ liệu
            const expertAppointments = allBooking.filter(
                (booking) => String(booking.expertId) === String(expertData.id)
            );
    
            console.log("Lịch hẹn sau khi lọc:", expertAppointments);
    
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
                            <th>Gói dịch vụ</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>{appt.userName}</td>
                                <td>{appt.date}</td>
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
