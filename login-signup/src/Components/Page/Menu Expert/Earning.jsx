import React, { useEffect, useState } from "react";
import styles from "./Earnings.module.css";

export const Earnings = () => {
    const [expert, setExpert] = useState(null);
    const [completedAppointments, setCompletedAppointments] = useState([]);
    const [commission, setCommission] = useState(0);
    const [paidCommission, setPaidCommission] = useState(0);
    const COMMISSION_RATE = 0.2; // 20% hoa hồng

    useEffect(() => {
        const loggedInExpertId = localStorage.getItem("loggedInExpertId");
    
        if (!loggedInExpertId) {
            console.warn("Không tìm thấy loggedInExpertId, có thể chưa đăng nhập.");
            return;
        }
    
        const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
        const expertData = storedExperts.find(exp => String(exp.id) === String(loggedInExpertId));
    
        if (!expertData) {
            console.warn("Không tìm thấy chuyên gia trong danh sách.");
            return;
        }
    
        setExpert(expertData);
    
        const allBookings = Object.keys(localStorage)
            .filter((key) => key.startsWith("bookings_"))
            .flatMap((key) => JSON.parse(localStorage.getItem(key)) || []);
    
        const filteredAppointments = allBookings.filter(
            (booking) => String(booking.expertId) === String(loggedInExpertId) && booking.status === "Đã hoàn thành"
        );
    
        setCompletedAppointments(filteredAppointments);
    
        // Tính tổng tiền hoa hồng
        const totalCommission = filteredAppointments.reduce(
            (sum, appt) => sum + appt.amountPaid * COMMISSION_RATE, 0
        );
    
        // Lấy số tiền đã thanh toán từ localStorage
        const storedPaidCommission = parseFloat(localStorage.getItem(`paidCommission_${loggedInExpertId}`)) || 0;
        setPaidCommission(storedPaidCommission);
    
        // Tính tiền hoa hồng còn phải trả
        const remainingCommission = Math.max(totalCommission - storedPaidCommission, 0);
        setCommission(remainingCommission);
    }, []);
    const handlePayCommission = () => {
        const newPaidCommission = paidCommission + commission;
        localStorage.setItem(`paidCommission_${expert.id}`, newPaidCommission); // Lưu lại số tiền đã thanh toán
        setPaidCommission(newPaidCommission);
        setCommission(0);
        alert(`Bạn đã thanh toán hoa hồng: ${commission.toLocaleString()} VND`);
    };

    if (!expert) return <div className={styles.notFound}>Bạn chưa đăng nhập</div>;

    return (
        <div className={styles.container}>
            <h2>💰 Thu nhập của tôi</h2>
            <h3>Tổng thu nhập: {completedAppointments.reduce((sum, appt) => sum + appt.amountPaid, 0).toLocaleString()} VND</h3>
            <h3>🌟 Tiền hoa hồng phải trả: {commission.toLocaleString()} VND</h3>
            <h3>✅ Tiền hoa hồng đã thanh toán: {paidCommission.toLocaleString()} VND</h3>
            {commission > 0 && (
                <button className={styles.payButton} onClick={handlePayCommission}>
                    💳 Thanh toán hoa hồng
                </button>
            )}

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Ngày</th>
                        <th>Thời gian</th>
                        <th>Gói tư vấn</th>
                        <th>Đã thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    {completedAppointments.map((appt) => (
                        <tr key={appt.id}>
                            <td>{appt.userName}</td>
                            <td>{appt.date}</td>
                            <td>{appt.time}</td>
                            <td>{appt.packageName}</td>
                            <td>{appt.amountPaid.toLocaleString()} VND</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
