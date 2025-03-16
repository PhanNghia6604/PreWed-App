import React, { useEffect, useState } from "react";
import styles from "./ExpertDashboard.module.css"; // Import CSS

const ExpertDashboard = () => {
  const [newExpertBookings, setNewExpertBookings] = useState(0);
  const [newCustomerPayments, setNewCustomerPayments] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
const [totalFeedbacks, setTotalFeedbacks] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const feedbacksPerPage = 5; // Số feedback mỗi trang

useEffect(() => {
    const token = localStorage.getItem("token");

    // 📌 Gọi API lấy danh sách booking
    fetch(`/api/booking`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Booking API response:", data);

        if (Array.isArray(data)) {
          // 🔍 Đếm số lịch hẹn mới (trạng thái PENDING)
          const pendingBookings = data.filter(
            (booking) => booking.status === "PENDING"
          ).length;

          // 💰 Đếm số lịch đã thanh toán (trạng thái PENDING_PAYMENT)
          const pendingPayments = data.filter(
            (booking) => booking.status === "PENDING_PAYMENT"
          ).length;

          // ⏫ Cập nhật state
          setNewExpertBookings(pendingBookings);
          setNewCustomerPayments(pendingPayments);
        } else {
          console.error("❌ API trả về dữ liệu không hợp lệ:", data);
        }
      })
      .catch((error) => console.error("❌ Lỗi khi tải booking:", error));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expertId = localStorage.getItem("expertId");

    fetch(`/api/feedback`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Feedback API response:", data);

        if (Array.isArray(data)) {
          const filteredFeedbacks = data.filter(
            (feedback) => feedback.expert.id.toString() === expertId
          );
          setFeedbackList(filteredFeedbacks);
        } else {
          console.error("❌ API trả về dữ liệu không hợp lệ:", data);
        }
      })
      .catch((error) => console.error("❌ Lỗi khi tải feedback:", error));
  }, []);
  
  
  
    // 📌 Tính toán index cho phân trang
    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbackList.slice(indexOfFirstFeedback, indexOfLastFeedback);
  
    // 📌 Chuyển trang
    const totalPages = Math.ceil(feedbackList.length / feedbacksPerPage);
    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  
  
  return (
    <div className={styles.container}>
      <h1>📊 Dashboard Chuyên Gia</h1>

      {/* 🔔 Thông báo lịch hẹn mới */}
      {newExpertBookings > 0 && (
        <div className={styles.notification}>
          🔔 Bạn có <strong>{newExpertBookings}</strong> lịch hẹn mới cần xác nhận!
        </div>
      )}

      {/* 💰 Thông báo lịch hẹn đã thanh toán */}
      {newCustomerPayments > 0 && (
        <div className={styles.notification}>
          💰 Có <strong>{newCustomerPayments}</strong> lịch hẹn đã được thanh toán!
        </div>
      )}

     {/* ⭐ Danh sách feedback từ khách hàng */}
     
     {feedbackList.length > 0 && (
        <div className={styles.feedbackSection}>
          <h2>⭐ Đánh giá từ khách hàng</h2>
          <ul className={styles.feedbackList}>
            {currentFeedbacks.map((feedback, index) => (
              <li key={index} className={styles.feedbackItem}>
                <p><strong>Khách hàng:</strong> {feedback.user?.name || "Ẩn danh"}</p>
                <p><strong>Đánh giá:</strong> {feedback.rating} ⭐</p>
                <p><strong>Bình luận:</strong> {feedback.comments}</p>
              </li>
            ))}
          </ul>

          {/* 🔹 Nút chuyển trang */}
          <div className={styles.pagination}>
            <button onClick={prevPage} disabled={currentPage === 1}>
              ◀ Trang trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Trang sau ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;
