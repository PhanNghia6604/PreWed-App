import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MyBookings.module.css";
import { experts } from "../../fake data/data"; // Import danh sách chuyên gia giả lập

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);

    if (storedUser) {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${storedUser.id}`)) || [];
      setBookings(userBookings);
    }
  }, []);

  // Hủy lịch đặt
  const handleCancelBooking = (index) => {
    if (!user) return;

    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);

    localStorage.setItem(`bookings_${user.id}`, JSON.stringify(updatedBookings));
  };

  // Điều hướng đến trang thanh toán
  const handlePayment = (booking) => {
    console.log("Booking data:", booking);
    console.log("Session Count:", booking.sessionCount);
  
    // Encode endDate để tránh lỗi URL
    const encodedEndDate = encodeURIComponent(booking.endDate);
  
    navigate(`/booking-payment/${booking.expertId}/${booking.date}/${encodedEndDate}/${booking.sessionCount}`);
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
            const expert = experts.find(e => e.id === Number(b.expertId));

            return (
              <li key={index} className={style.bookingItem}>
                {expert ? (
                  <>
                    <img src={expert.avatar} alt={expert.fullName} className={style.expertAvatar} />
                    <div className={style.bookingInfo}>
                      <strong className={style.expertName}>{expert.fullName}</strong>
                      <p className={style.specialty}>🛠 {expert.specialty}</p>
                      <p className={style.dateTime}>📅 Ngày bắt đầu: {b.date} | 🕒 Ngày kết thúc: {b.endDate}</p>
                      <p className={style.status}>📌 Trạng thái: <strong>{b.status}</strong></p>
                    </div>

                    {/* Nút hủy lịch nếu chưa được chấp nhận */}
                    {b.status === "Chờ xác nhận" && (
                      <button className={style.cancelButton} onClick={() => handleCancelBooking(index)}>
                        ❌ Hủy lịch
                      </button>
                    )}

                    {/* Nút thanh toán nếu chuyên gia đã chấp nhận */}
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
