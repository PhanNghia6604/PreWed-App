import React, { useEffect, useState } from "react";
import styles from "./ExpertAppointments.module.css";  // Import CSS Module

export const ExpertAppointments = () => {
    const [expert, setExpert] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        let loggedInExpertId = localStorage.getItem("loggedInExpertId");
    
        if (!loggedInExpertId) {
            console.warn("Không tìm thấy loggedInExpertId, đang kiểm tra lại...");
            return;
        }
    
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
        const expertData = storedExperts.find(exp => String(exp.id) === String(loggedInExpertId));
    
        if (!expertData) {
            console.warn("Không tìm thấy chuyên gia trong danh sách, có thể ID sai.");
            return;
        }
    
        setExpert(expertData);
    
        const allBookings = Object.keys(localStorage)
            .filter((key) => key.startsWith("bookings_"))
            .flatMap((key) => JSON.parse(localStorage.getItem(key)) || []);
    
        const expertAppointments = allBookings.filter(
            (booking) => String(booking.expertId) === String(loggedInExpertId)
        );
    
        const updatedAppointments = expertAppointments.map((appt) => {
            const userData = JSON.parse(localStorage.getItem("user_" + appt.userId)) || {};
            return {
                ...appt,
                status: appt.status === "Đã thanh toán" ? "Chưa bắt đầu tư vấn" : appt.status,
                fullName: userData.fullName || "Không rõ",
            };
        });
    
        setAppointments(updatedAppointments);
    
    }, []);


    const handleUpdateStatus = (id, newStatus) => {
        const updatedAppointments = appointments.map((appt) =>
            appt.id === id ? { ...appt, status: newStatus } : appt
        );
        setAppointments(updatedAppointments);

        // Cập nhật từng userBooking trong localStorage
        Object.keys(localStorage)
            .filter((key) => key.startsWith("bookings_"))
            .forEach((key) => {
                let userBookings = JSON.parse(localStorage.getItem(key)) || [];
                let updatedUserBookings = userBookings.map((b) =>
                    b.id === id ? { ...b, status: newStatus } : b
                );

                // Kiểm tra nếu dữ liệu thực sự thay đổi, thì mới lưu lại
                if (JSON.stringify(userBookings) !== JSON.stringify(updatedUserBookings)) {
                    localStorage.setItem(key, JSON.stringify(updatedUserBookings));
                }
            });

        console.log("Đã cập nhật trạng thái mới:", newStatus);
    };

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
                            <th>Thứ</th>
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Gói dịch vụ</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appt) => (
                            <tr key={appt.id}>
                                <td>{appt.userName || "Không rõ"}</td> {/* ✅ Hiển thị fullName thay vì userName */}
                                <td>{appt.dayOfWeek || "N/A"}</td>
                                <td>{appt.date}</td>
                                <td>{appt.time}</td>
                                <td>{appt.packageName}</td>
                                <td>{appt.status}</td>
                                <td>
                                    {appt.status === "Chờ chuyên gia xác nhận" && (
                                        <>
                                            <button className={styles.confirmButton} onClick={() => handleUpdateStatus(appt.id, "Chờ thanh toán")}>
                                                ✅ Xác nhận
                                            </button>
                                            <button className={styles.rejectButton} onClick={() => handleUpdateStatus(appt.id, "Bị từ chối")}>
                                                ❌ Từ chối
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td>
                                    {appt.status === "Chưa bắt đầu tư vấn" ? (
                                        <>
                                            <span>⏳ Chưa bắt đầu</span>
                                            <button className={styles.startButton} onClick={() => handleUpdateStatus(appt.id, "Đang tư vấn")}>
                                                🚀 Bắt đầu tư vấn
                                            </button>
                                        </>
                                    ) : appt.status === "Đang tư vấn" ? (
                                        <>
                                            <span>🟢 Đang tư vấn</span>
                                            <button className={styles.completeButton} onClick={() => handleUpdateStatus(appt.id, "Đã hoàn thành")}>
                                                ✅ Hoàn thành tư vấn
                                            </button>
                                        </>
                                    ) : (
                                        appt.status
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
