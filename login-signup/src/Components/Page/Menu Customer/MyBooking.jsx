import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MyBookings.module.css";

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/booking", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Lỗi lấy danh sách lịch hẹn:", error));
  }, []);

  // Xử lý hủy lịch hẹn
  const handleCancelBooking = (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;

    fetch(`/api/booking/${id}?status=CANCELLED`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
        );
      })
      .catch((error) => console.error("Lỗi hủy lịch:", error));
  };

  return (
    <div className={style.container}>
      <h2>Lịch đặt của tôi</h2>
      {bookings.length === 0 ? (
        <p>Bạn chưa có lịch đặt nào.</p>
      ) : (
        <ul className={style.bookingList}>
          {bookings.map((b) => {
            const expert = b.slotExpert.expert;
            return (
              <li key={b.id} className={style.bookingItem}>
                <img src={expert.avatar} alt={expert.name} className={style.expertAvatar} />
                <div className={style.bookingInfo}>
                  <strong>{expert.name}</strong>
                  <p>📅 Ngày: {b.slotExpert.date}</p>
                  <p>⏰ Giờ: {b.slotExpert.slot.startTime} - {b.slotExpert.slot.endTime}</p>
                  <p>📌 Trạng thái: <strong>{b.status}</strong></p>

                  {/* 🟡 Chờ chuyên gia xác nhận */}
                  {b.status === "PENDING" && (
                    <p className={style.pendingText}>⏳ Đang chờ chuyên gia xác nhận...</p>
                  )}

                  {/* 💳 Chờ thanh toán */}
                  {b.status === "PENDING_PAYMENT" && (
                    <button
                      className={style.payButton}
                      onClick={() => navigate(`/booking-payment/${expert.id}/${b.id}`)}
                    >
                      💳 Thanh toán
                    </button>
                  )}

                  {/* ⏳ Đang chờ đến giờ tư vấn */}
                  {b.status === "AWAIT" && (
                    <p className={style.awaitText}>⏳ Bạn đã thanh toán. Vui lòng đợi đến giờ tư vấn!</p>
                  )}

                  {/* 🔵 Đang tư vấn */}
                  {b.status === "PROCESSING" && (
                    <a
                      href="https://meet.google.com/new"
                      className={style.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      🌐 Vào phòng tư vấn qua Google Meet
                    </a>
                  )}

                  {/* ✅ Đã hoàn thành */}
                  {b.status === "FINISHED" && (
                    <button
                      className={style.feedbackButton}
                      onClick={() => navigate(`/feedback/${b.id}/${expert.id}`)}
                    >
                      ✍️ Đánh giá chuyên gia
                    </button>
                  )}

                  {/* ❌ Đã hủy */}
                  {b.status === "CANCELLED" && (
                    <p className={style.cancelledText}>❌ Lịch hẹn đã bị hủy.</p>
                  )}

                  {/* Nút hủy lịch cho các trạng thái PENDING và PENDING_PAYMENT */}
                  {["PENDING", "PENDING_PAYMENT"].includes(b.status) && (
                    <button
                      className={style.cancelButton}
                      onClick={() => handleCancelBooking(b.id)}
                    >
                      ❌ Hủy lịch
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
