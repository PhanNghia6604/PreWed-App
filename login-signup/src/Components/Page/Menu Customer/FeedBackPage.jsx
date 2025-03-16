import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./FeedbackPage.module.css";

const FeedbackPage = () => {
  const { bookingId, expertId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  
  const handleFeedbackSubmit = async () => {
    if (!feedback.comment || !feedback.rating) {
      alert("Vui lòng nhập đầy đủ đánh giá!");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      return;
    }
  
    const newFeedback = {
      bookingId,
      expertId,
      rating: feedback.rating,
      comment: feedback.comment,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newFeedback),
      });
  
      if (!response.ok) {
        throw new Error("Lỗi khi gửi đánh giá!");
      }
  
      alert("Cảm ơn bạn đã gửi đánh giá!");
      navigate("/my-booking");
    } catch (error) {
      console.error(error);
      alert("Không thể gửi đánh giá, vui lòng thử lại!");
    }
  };
  

  if (!user) {
    return <div className={style.notFound}>Bạn chưa đăng nhập!</div>;
  }

  return (
    <div className={style.container}>
      <h2>Gửi đánh giá</h2>
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
    </div>
  );
};

export default FeedbackPage;
