import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Component: BookingPayment

const BookingPayment = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await fetch(`/api/booking/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch booking");
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await fetch("/api/payment/vnpay", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId }),
      });
      if (!response.ok) throw new Error("Failed to initiate payment");
      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl; // Chuyển hướng đến VNPay
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Thanh toán lịch hẹn</h2>
      <p>Dịch vụ: {booking.services[0].name}</p>
      <p>Giá: {booking.services[0].price.toLocaleString()} VND</p>
      <p>Chuyên gia: {booking.slotExpert.expert.name}</p>
      <p>Ngày: {booking.slotExpert.date}</p>
      <p>Giờ: {booking.slotExpert.slot.startTime} - {booking.slotExpert.slot.endTime}</p>
      <button onClick={handlePayment}>Thanh toán ngay</button>
    </div>
  );
};

export default BookingPayment;
