import React, { useEffect, useState } from "react";
import styles from "./AdminReportPage.module.css";

const AdminReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await fetch("/api/booking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu booking");
        }
        

        const bookings = await response.json();
        
        // Lọc chỉ lấy booking có status "finished"
        const finishedBookings = bookings.filter(
          (booking) => booking.status === "FINISHED"
        );
        

        // Nhóm dữ liệu theo expertId và tính toán số lượng & tổng thu nhập
        const report = finishedBookings.reduce((acc, booking) => {
          // Kiểm tra dữ liệu hợp lệ trước khi xử lý
          if (!booking.slotExpert || !booking.slotExpert.expert) {
              console.warn("Dữ liệu không hợp lệ:", booking);
              return acc;
          }
      
          const expert = booking.slotExpert.expert; // Lấy chuyên gia từ slotExpert.expert
          const expertId = expert.id;
          console.log(expertId);
          
          if (!acc[expertId]) {
              acc[expertId] = {
                  expertId,
                  expertName: expert.name,
                  expertEmail: expert.email,
                  totalBookings: 0,
                  totalIncome: 0, // Kiểm tra xem API có cung cấp price không
              };
          }
      
          acc[expertId].totalBookings += 1;
          acc[expertId].totalIncome += booking.price || 0; // Nếu không có price, mặc định là 0
      
          return acc;
      }, {});
      
    
        // Chuyển object thành array để render
        setReportData(Object.values(report));
        
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy báo cáo:", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className={styles.container} style={{ padding: "100px" }}>
    <h2 className={styles.title}>Báo cáo thu nhập chuyên gia</h2>

    {loading ? (
      <p>Đang tải...</p>
    ) : error ? (
      <p className={styles.error}>⚠️ {error}</p>
    ) : reportData.length === 0 ? (
      <p>Không có dữ liệu.</p>
    ) : (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Chuyên gia</th>
            <th>Email</th>
            <th>Số lượng booking</th>
            <th>Tổng thu nhập</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((expert) => (
            <tr key={expert.expertId}>
              <td>{expert.expertName}</td>
              <td>{expert.expertEmail}</td>
              <td>{expert.totalBookings}</td>
              <td>
                {expert.totalIncome.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
};

export default AdminReportPage;
