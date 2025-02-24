import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicePackages } from "../../fake data/data"; // Import danh sách chuyên gia
import style from "./BookingPayment.module.css";

export const BookingPayment = () => {
  const { expertId, date, calculatedEndDate, sessionCount } = useParams();
  console.log("Received endDate from URL:", calculatedEndDate);
  console.log("Received sessionCount from URL:", sessionCount);
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
  
      // Tìm lịch đặt của người dùng
      const foundBooking = userBookings.find(
        (b) => Number(b.expertId) === Number(expertId) && b.date === date && b.endDate === calculatedEndDate
      );
  
      if (foundBooking) {
        setBooking(foundBooking);
  
        // Lấy giá của gói dịch vụ
        const selectedPackage = servicePackages.find(pkg => pkg.name === foundBooking.packageName);
        const packagePrice = selectedPackage ? selectedPackage.price : 0;
        
        console.log("Selected Package:", selectedPackage);
        console.log("Final Price:", packagePrice);
        
        setTotalAmount(packagePrice); // Không nhân với sessionNum
        
      }
    }
  }, [expertId, date, calculatedEndDate, sessionCount]);
  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (!booking) {
      alert("Không tìm thấy lịch đặt.");
      return;
    }

    if (booking.status !== "Chờ thanh toán" && booking.status !== "Chờ chấp nhận") {
      alert("Lịch hẹn chưa được chuyên gia chấp nhận hoặc đã thanh toán.");
      return;
    }

    const updatedBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
    const newBookings = updatedBookings.map((b) =>
      Number(b.expertId) === Number(booking.expertId) && b.date === booking.date && b.endDate === booking.endDate
        ? { ...b, status: "Đã thanh toán", amountPaid: totalAmount }
        : b
    );

    localStorage.setItem(`bookings_${user.id}`, JSON.stringify(newBookings));

    alert(`Thanh toán thành công ${totalAmount.toLocaleString()} VNĐ bằng ${paymentMethod}!`);
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
            value="Thẻ tín dụng"
            checked={paymentMethod === "Thẻ tín dụng"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          💳 Thẻ tín dụng / Ghi nợ
        </label>
        <label>
          <input
            type="radio"
            value="MoMo"
            checked={paymentMethod === "MoMo"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          📱 Ví MoMo
        </label>
        <label>
          <input
            type="radio"
            value="Chuyển khoản ngân hàng"
            checked={paymentMethod === "Chuyển khoản ngân hàng"}
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
