import React, { useEffect, useState } from "react";
import styles from "./AdminReportPage.module.css";

const AdminReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

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
          (booking) => booking.status === "finished"
        );

        // Nhóm dữ liệu theo expertId và tính toán số lượng & tổng thu nhập
        const report = finishedBookings.reduce((acc, booking) => {
          const expertId = booking.expertId;
          if (!acc[expertId]) {
            acc[expertId] = {
              expertId: expertId,
              expertName: booking.expertName, // Giả sử API trả về expertName
              expertEmail: booking.expertEmail, // Giả sử API trả về expertEmail
              totalBookings: 0,
              totalIncome: 0,
            };
          }
          acc[expertId].totalBookings += 1;
          acc[expertId].totalIncome += booking.price; // Giả sử mỗi booking có price
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
    <div className={styles.container}>
      <h2 className={styles.title}>Báo cáo thu nhập chuyên gia</h2>
      {loading ? (
        <p>Đang tải...</p>
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
                <td>{expert.totalIncome.toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReportPage;
