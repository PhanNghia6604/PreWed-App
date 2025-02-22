import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { experts } from "../../fake data/data";
import style from "./ExpertDetail.module.css";

export const ExpertDetail = () => {
  const { id } = useParams();
  const expert = experts.find((exp) => exp.id === Number(id));
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [user, setUser] = useState(null);
  const [sessionCount, setSessionCount] = useState(1);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  if (!expert) {
    return <div className={style.notFound}>Chuyên gia không tồn tại!</div>;
  }

  const handleBooking = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt lịch!");
      return;
    }
    setShowForm(true);
  };

  const handleConfirmBooking = () => {
    if (!date || !time) {
      alert("Vui lòng chọn ngày và giờ!");
      return;
    }
  
    const booking = {
      id: new Date().getTime(),
      expertId: id,
      expertName: expert.fullName,
      date,
      time,
      sessionCount, // Lưu số buổi vào booking
      status: "Chờ thanh toán",
    };
  
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify([...userBookings, booking]));
  
    setShowForm(false);
    alert("Đặt lịch thành công! Chuyển đến trang thanh toán...");
  
    // Điều hướng đến trang thanh toán (chuyển thêm sessionCount)
    navigate(`/booking-payment/${id}/${date}/${time}/${sessionCount}`);
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <img src={expert.avatar} alt={expert.fullName} className={style.avatar} />
        <h2>{expert.fullName}</h2>
        <p className={style.specialty}>{expert.specialty}</p>
        <p className={style.experience}>{expert.experience} năm kinh nghiệm</p>

        <p className={style.description}>{expert.description}</p>

        <div className={style.certifications}>
          <h3>Bằng cấp & Chứng chỉ:</h3>
          <ul>
            {expert.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>

        {user ? <p>Xin chào, {user.name}!</p> : <p>Bạn chưa đăng nhập.</p>}

        <button className={style.bookButton} onClick={handleBooking}>Đặt lịch tư vấn</button>

        {showForm && (
          <div className={style.bookingForm}>
            <h3>Đặt lịch tư vấn với {expert.fullName}</h3>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <label>Chọn số buổi:</label>
            <input
              type="number"
              min="1"
              value={sessionCount}
              onChange={(e) => setSessionCount(Number(e.target.value))}
            />
            <button onClick={handleConfirmBooking}>Xác nhận & Thanh toán</button>
          </div>
        )}
      </div>
    </div>
  );
};
