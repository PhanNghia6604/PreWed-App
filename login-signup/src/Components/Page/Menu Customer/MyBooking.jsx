import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MyBookings.module.css";

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user")) || null;
      setUser(storedUser);

      if (storedUser) {
        const userBookings = JSON.parse(localStorage.getItem(`bookings_${storedUser.id}`)) || [];
        setBookings(userBookings);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
    }
  }, []);

  const handleCancelBooking = (index) => {
    if (!user) return;

    setBookings((prevBookings) => {
      const updatedBookings = prevBookings.filter((_, i) => i !== index);
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
                      {b.status === "Đã thanh toán" && (
                        <div className={style.consultationLink}>
                          <a href="https://meet.google.com/new" className={style.link} target="_blank" rel="noopener noreferrer">
                            🌐 Vào phòng tư vấn qua Google Meet
                          </a>
                        </div>
                      )}
                    </div>

                    {b.status === "Chờ xác nhận" && (
                      <button className={style.cancelButton} onClick={() => handleCancelBooking(index)}>
                        ❌ Hủy lịch
                      </button>
                    )}

                    {b.status === "Chờ thanh toán" && (
                      <button className={style.payButton} onClick={() => handlePayment(b)}>
                        💳 Thanh toán
                      </button>
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