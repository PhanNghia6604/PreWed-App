import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./FeedbackPage.module.css";

const FeedbackPage = () => {
  const { bookingId, expertId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });
  const [reviewedExperts, setReviewedExperts] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
    const reviewedBookings = JSON.parse(localStorage.getItem("reviewedBookings")) || {};
    setReviewedExperts(reviewedBookings);
  }, []);

  const handleFeedbackSubmit = () => {
    if (!feedback.comment) {
      alert("Vui lòng nhập phản hồi trước khi gửi!");
      return;
    }
    if (!feedback.rating) {
      alert("Vui lòng chọn số sao trước khi gửi đánh giá!");
      return;
    }

    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const newFeedback = {
      bookingId,
      expertId,
      user: user?.fullName || "Ẩn danh",
      date: new Date().toLocaleString(),
      rating: feedback.rating,
      comment: feedback.comment,
    };

    localStorage.setItem("feedbacks", JSON.stringify([...storedFeedbacks, newFeedback]));
    const updatedReviewedExperts = { ...reviewedExperts, [bookingId]: true };
    localStorage.setItem("reviewedBookings", JSON.stringify(updatedReviewedExperts));
    setReviewedExperts(updatedReviewedExperts);

    alert("Cảm ơn bạn đã gửi đánh giá!");
    navigate("/my-booking");
  };

  if (!user) {
    return <div className={style.notFound}>Bạn chưa đăng nhập!</div>;
  }

  return (
    <div className={style.container}>
      <h2>Gửi đánh giá</h2>
      {reviewedExperts[bookingId] ? (
        <p>Bạn đã đánh giá lịch hẹn này trước đó!</p>
      ) : (
        <div className={style.feedbackForm}>
          <label>⭐ Đánh giá chuyên gia:</label>
          <select
            value={feedback.rating}
            onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>{star} ⭐</option>
            ))}
          </select>

          <textarea
            className={style.feedbackInput}
            placeholder="Nhập phản hồi của bạn..."
            value={feedback.comment}
            onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
          />

          <button className={style.submitFeedbackButton} onClick={handleFeedbackSubmit}>
            Gửi phản hồi
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;