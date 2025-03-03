import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MyBookings.module.css";

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState({});
  const [ratings, setRatings] = useState({});
  const [openFeedback, setOpenFeedback] = useState({});
  const [reviewedExperts, setReviewedExperts] = useState({});



  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || null;
      if (storedUser) {
        setUser(storedUser);
        const userBookings = JSON.parse(localStorage.getItem(`bookings_${storedUser.id}`)) || [];
        setBookings(userBookings);

        // Lấy feedbacks từ localStorage
        const savedFeedbacks = JSON.parse(localStorage.getItem(`feedbacks_${storedUser.id}`)) || {};
        setFeedbacks(savedFeedbacks);

        // ✅ Lấy trạng thái đánh giá theo từng bookingId
        const savedReviewedBookings = JSON.parse(localStorage.getItem("reviewedBookings")) || {};
        console.log("Dữ liệu đánh giá đã lưu:", savedReviewedBookings); // 🛠 Debug
        setReviewedExperts(savedReviewedBookings);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
    }
  }, []);



  const handleCancelBooking = (index) => {
    if (!user) return;
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;

    setBookings((prevBookings) => {
      const updatedBookings = prevBookings.map((b, i) =>
        i === index ? { ...b, status: "Đã hủy & Hoàn tiền" } : b
      );
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  };

  const handlePayment = (booking) => {
    navigate(`/booking-payment/${booking.expertId}/${booking.id}`);
  };

  const getDayOfWeek = (dateString) => {
    const daysMap = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const date = new Date(dateString);
    return daysMap[date.getDay()];
  };
  const handleFeedbackSubmit = (bookingId, expertId) => {
    if (!feedbacks[bookingId]?.comment) {
      alert("Vui lòng nhập phản hồi trước khi gửi!");
      return;
    }

    if (!feedbacks[bookingId]?.rating) {
      alert("Vui lòng chọn số sao trước khi gửi đánh giá!");
      return;
    }

    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const alreadyReviewed = storedFeedbacks.some((feedback) => feedback.bookingId === bookingId);

    if (alreadyReviewed) {
      alert("Bạn đã đánh giá lịch hẹn này trước đó!");
      return;
    }

    const newFeedback = {
      bookingId,
      expertId,
      user: user.fullName,
      date: new Date().toLocaleString(),
      rating: feedbacks[bookingId].rating,
      comment: feedbacks[bookingId].comment,
    };

    localStorage.setItem("feedbacks", JSON.stringify([...storedFeedbacks, newFeedback]));

    const reviewedBookings = JSON.parse(localStorage.getItem("reviewedBookings")) || {};
    reviewedBookings[bookingId] = true;
    localStorage.setItem("reviewedBookings", JSON.stringify(reviewedBookings));

    alert("Cảm ơn bạn đã gửi đánh giá!");

    setFeedbacks((prev) => ({
      ...prev,
      [bookingId]: { rating: 5, comment: "" },
    }));

    setOpenFeedback((prev) => ({
      ...prev,
      [bookingId]: false,
    }));

    setReviewedExperts(reviewedBookings);
  };

  const toggleFeedbackForm = (bookingId) => {
    setOpenFeedback((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  if (!user) {
    return <div className={style.notFound}>Bạn chưa đăng nhập!</div>;
  }

  return (
    <div className={style.container}>
      <h2>Lịch đặt của tôi</h2>
      {bookings.length === 0 ? (
        <p>Bạn chưa có lịch đặt nào.</p>
      ) : (
        <ul className={style.bookingList}>
          {bookings.map((b, index) => {
            const experts = JSON.parse(localStorage.getItem("experts")) || [];
            const expert = experts.find(e => e.id === Number(b.expertId));

            return (
              <li key={index} className={style.bookingItem}>
                {expert ? (
                  <>
                    <img src={expert.avatar} alt={expert.name} className={style.expertAvatar} />
                    <div className={style.bookingInfo}>
                      <strong className={style.expertName}>{expert.name}</strong>
                      <p className={style.specialty}>🛠 {expert.specialty}</p>
                      <p className={style.dateTime}>📅 Ngày: {b.date} ({getDayOfWeek(b.date)}) - ⏰ Giờ: {b.time} | Gói dịch vụ: {b.packageName}</p>
                      <p className={style.status}>📌 Trạng thái: <strong>{b.status}</strong></p>
                      {b.status === "Đang tư vấn" && (
                        <div className={style.consultationLink}>
                          <a href="https://meet.google.com/new" className={style.link} target="_blank" rel="noopener noreferrer">
                            🌐 Vào phòng tư vấn qua Google Meet
                          </a>
                        </div>
                      )}
                    </div>

                    {b.status === "Chờ chuyên gia xác nhận" && (
                      <p className={style.pendingText}>⏳ Đang chờ chuyên gia xác nhận...</p>
                    )}

                    {b.status === "Chờ thanh toán" && (
                      <button className={style.payButton} onClick={() => handlePayment(b)}>
                        💳 Thanh toán
                      </button>
                    )}

                    {b.status === "Chờ chuyên gia xác nhận" || b.status === "Chờ thanh toán" ? (
                      <button className={style.cancelButton} onClick={() => handleCancelBooking(index)}>
                        ❌ Hủy lịch
                      </button>
                    ) : null}
                    {b.status === "Đã hoàn thành" && (
                      <div className={style.feedbackSection}>
                        <button
                          className={style.toggleFeedbackButton}
                          onClick={() => toggleFeedbackForm(b.id)}
                          disabled={reviewedExperts[b.id]} // ✅ Kiểm tra theo bookingId
                        >
                          {reviewedExperts[b.id] ? "Đã đánh giá" : "Đánh giá"}
                        </button>


                        {openFeedback[b.id] && (

                          <div className={style.feedbackForm}>
                            <p>⭐ Đánh giá chuyên gia:</p>
                            <select
                              value={feedbacks[b.id]?.rating || ""}
                              onChange={(e) => {
                                setFeedbacks((prev) => ({
                                  ...prev,
                                  [b.id]: { ...prev[b.id], rating: Number(e.target.value) },
                                }));
                              }}
                            >
                              <option value="" disabled>Chọn số sao</option>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <option key={star} value={star}>{star} ⭐</option>
                              ))}
                            </select>



                            <textarea
                              className={style.feedbackInput}
                              placeholder="Nhập phản hồi của bạn..."
                              value={feedbacks[b.id]?.comment || ""}
                              onChange={(e) =>
                                setFeedbacks((prev) => ({
                                  ...prev,
                                  [b.id]: { ...prev[b.id], comment: e.target.value },
                                }))
                              }
                            />

                            <button
                              className={style.submitFeedbackButton}
                              onClick={() => handleFeedbackSubmit(b.id, b.expertId)}
                            >
                              Gửi phản hồi
                            </button>
                          </div>
                        )}
                      </div>
                    )}


                  </>
                ) : (
                  <p className={style.missingExpert}>⚠ Chuyên gia không tồn tại! (ID: {b.expertId})</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};