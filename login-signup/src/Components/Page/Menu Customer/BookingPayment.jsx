import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { experts } from "../../fake data/data"; // Import danh sách chuyên gia
import style from "./BookingPayment.module.css";

export const BookingPayment = () => {
  const { expertId, date, endDate, sessionCount } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);

    if (storedUser) {
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${storedUser.id}`)) || [];
      const foundBooking = userBookings.find(
        (b) => b.expertId === expertId && b.date === date && b.endDate === endDate
      );
      setBooking(foundBooking);

      // Lấy giá chuyên gia từ danh sách
      const expert = experts.find((exp) => exp.id === Number(expertId));

      // Kiểm tra dữ liệu hợp lệ trước khi tính toán
      const sessionNum = Number(sessionCount) || 1; // Chuyển đổi sessionCount thành số, mặc định là 1 nếu lỗi
      const pricePerSession = expert?.pricePerSession || 0; // Đảm bảo có giá hợp lệ

      setTotalAmount(sessionNum * pricePerSession); // Tính tổng tiền
    }
  }, [expertId, date, endDate, sessionCount]);

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (!booking) {
      alert("Không tìm thấy lịch đặt.");
      return;
    }

    const updatedBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
    const newBookings = updatedBookings.map((b) =>
      b.expertId === booking.expertId && b.date === booking.date && b.endDate === booking.endDate
        ? { ...b, status: "Đã thanh toán", amountPaid: totalAmount }
        : b
    );

    localStorage.setItem(`bookings_${user.id}`, JSON.stringify(newBookings));

    alert(`Thanh toán thành công ${totalAmount.toLocaleString()} VNĐ!`);
    navigate("/my-booking");
  };

  if (!user) {
    return <div className={style.notFound}>Bạn chưa đăng nhập!</div>;
  }

  if (!booking) {
    return <div className={style.notFound}>Lịch đặt không tồn tại!</div>;
  }

  return (
    <div className={style.container}>
      <h2>Thanh toán lịch hẹn</h2>
      <div className={style.bookingInfo}>
        <p><strong>Chuyên gia:</strong> {booking.expertName}</p>
        <p><strong>Ngày:</strong> {booking.date}</p>
        <p><strong>Ngày kết thúc:</strong> {booking.endDate}</p>
        <p><strong>Số buổi:</strong> {sessionCount}</p>
        <p><strong>Trạng thái:</strong> {booking.status || "Chưa thanh toán"}</p>
        <p className={style.totalAmount}>
          <strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VNĐ
        </p>
      </div>

      <h3>Chọn phương thức thanh toán:</h3>
      <div className={style.paymentOptions}>
        <label>
          <input
            type="radio"
            value="creditCard"
            checked={paymentMethod === "creditCard"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          💳 Thẻ tín dụng / Ghi nợ
        </label>
        <label>
          <input
            type="radio"
            value="momo"
            checked={paymentMethod === "momo"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          📱 Ví MoMo
        </label>
        <label>
          <input
            type="radio"
            value="bankTransfer"
            checked={paymentMethod === "bankTransfer"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          🏦 Chuyển khoản ngân hàng
        </label>
      </div>

      <button className={style.payButton} onClick={handlePayment}>
        Xác nhận & Thanh toán
      </button>
    </div>
  );
};
