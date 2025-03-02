import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicePackages } from "../../fake data/data"; // Import danh sách gói dịch vụ
import style from "./BookingPayment.module.css";

export const BookingPayment = () => {
  const { expertId, bookingId } = useParams();
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
      const foundBooking = userBookings.find((b) => Number(b.id) === Number(bookingId));
  
      if (foundBooking) {
        setBooking(foundBooking);
  
        // 🔹 Dùng regex để lấy số tiền từ packageName
        const priceMatch = foundBooking.packageName.match(/(\d+)\s*Đồng/);
        const extractedPrice = priceMatch ? Number(priceMatch[1]) : 0;
  
        setTotalAmount(extractedPrice);
      }
    }
  }, [expertId, bookingId]); 
  const handlePayment = () => {
    if (!paymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }

    if (!booking) {
        alert("Không tìm thấy lịch đặt.");
        return;
    }

    if (booking.status !== "Chờ thanh toán") {
        alert("Lịch hẹn chưa được chuyên gia chấp nhận hoặc đã thanh toán.");
        return;
    }

    // ✅ Cập nhật trạng thái cho user (đặt lịch)
    const updatedBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
    const newBookings = updatedBookings.map((b) =>
        Number(b.id) === Number(booking.id) ? { ...b, status: "Đã thanh toán", amountPaid: totalAmount } : b
    );
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify(newBookings));

    // ✅ Cập nhật trạng thái trong danh sách chuyên gia
    Object.keys(localStorage)
        .filter((key) => key.startsWith("bookings_")) // Lấy danh sách đặt lịch từ tất cả user
        .forEach((key) => {
            const userBookings = JSON.parse(localStorage.getItem(key)) || [];
            const updatedUserBookings = userBookings.map((b) =>
                Number(b.id) === Number(booking.id) ? { ...b, status: "Chưa bắt đầu tư vấn" } : b
            );
            localStorage.setItem(key, JSON.stringify(updatedUserBookings));
        });

    alert(`Thanh toán thành công ${totalAmount.toLocaleString()} VNĐ bằng ${paymentMethod}!`);
    navigate("/my-booking");
};

  if (!user) return <div className={style.notFound}>Bạn chưa đăng nhập!</div>;
  if (!booking) return <div className={style.notFound}>Lịch đặt không tồn tại!</div>;

  return (
    <div className={style.container}>
      <h2>Thanh toán lịch hẹn</h2>
      <div className={style.bookingInfo}>
        <p><strong>Chuyên gia:</strong> {booking.expertName}</p>
        <p><strong>Ngày:</strong> {booking.date}</p>
        <p><strong>Gói dịch vụ:</strong> {booking.packageName}</p>
        <p><strong>Trạng thái:</strong> {booking.status || "Chưa thanh toán"}</p>
        <p className={style.totalAmount}><strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VNĐ</p>
      </div>

      <h3>Chọn phương thức thanh toán:</h3>
      <div className={style.paymentOptions}>
        {["Thẻ tín dụng", "MoMo", "Chuyển khoản ngân hàng"].map((method) => (
          <label key={method}>
            <input
              type="radio"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method === "Thẻ tín dụng" ? "💳" : method === "MoMo" ? "📱" : "🏦"} {method}
          </label>
        ))}
      </div>

      <button className={style.payButton} onClick={handlePayment}>Xác nhận & Thanh toán</button>
    </div>
  );
};
