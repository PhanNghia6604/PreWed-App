import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./RescheduleBooking.module.css";

const RescheduleBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Bạn cần đăng nhập để tiếp tục!");
      navigate("/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [slotsResponse, bookingsResponse] = await Promise.all([
          fetch("/api/slots", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/booking", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!slotsResponse.ok || !bookingsResponse.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const slotsData = await slotsResponse.json();
        const bookingsData = await bookingsResponse.json();

        setSlots(slotsData);
        setBookings(bookingsData);

        const currentBooking = bookingsData.find((booking) => booking.id === Number(bookingId));
        if (!currentBooking) throw new Error("Không tìm thấy lịch hẹn!");

        setBookingData(currentBooking);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        alert(err.message);
        setError(err.message);
        navigate("/my-booking", { replace: true });
      }
    };

    fetchData();
  }, [bookingId, navigate, token]);

  const validateSlotSelection = (selectedSlot) => {
    let errors = [];

    if (!selectedSlot) {
      errors.push("Vui lòng chọn một slot mới!");
    }

    const selectedSlotData = slots.find((slot) => slot.id === Number(selectedSlot));
    if (!selectedSlotData) {
      errors.push("Slot không hợp lệ, vui lòng thử lại!");
    }

    const now = new Date();
    const slotDateTime = selectedSlotData ? new Date(`${selectedSlotData.date}T${selectedSlotData.startTime}`) : null;
    if (slotDateTime && slotDateTime <= now) {
      errors.push("Không thể chọn slot đã qua thời gian hiện tại!");
    }

    const isBookedByOther = bookings.some(
      (booking) =>
        booking.slotExpert.slot.id === Number(selectedSlot) &&
        booking.user.id !== bookingData?.user?.id
    );

    if (isBookedByOther) {
      errors.push("Slot này đã được đặt bởi người khác. Vui lòng chọn slot khác!");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return errors[0];
    }
    return null;
  };

  const handleReschedule = async () => {
    if (!bookingData) return;

    setError("");
    try {
      setLoading(true);

      const validationError = validateSlotSelection(selectedSlot);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      const updateResponse = await fetch(`/api/booking/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: Number(selectedSlot),
          expertId: bookingData.slotExpert.expert.id,
          bookingDate: bookingData.slotExpert.date,
          serviceIds: bookingData.services.map((s) => s.id),
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }

      alert("Cập nhật lịch hẹn thành công!");
      navigate("/my-booking", { replace: true });
    } catch (err) {
      console.error("Lỗi cập nhật lịch:", err);
      alert(err.message || "Không thể cập nhật lịch, vui lòng thử lại!");
      setError(err.message || "Không thể cập nhật lịch, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) return <div className={styles["reschedule-container"]}>Loading...</div>;

  return (
    <div className={styles["reschedule-container"]}>
      <h2>Đổi lịch hẹn</h2>
      <p>Lịch hẹn hiện tại: {bookingData.slotExpert.slot.date} {bookingData.slotExpert.slot.startTime} - {bookingData.slotExpert.slot.endTime}</p>
      
      <label>Chọn thời gian mới:</label>
      <select
  className={styles["reschedule-select"]}
  onChange={(e) => setSelectedSlot(e.target.value)}
  value={selectedSlot || ""}
>
  <option value="">-- Chọn --</option>
  {slots.map((slot) => {
   const today = new Date().toISOString().split("T")[0]; // Lấy ngày hôm nay
   const slotDateTime = new Date(`${today}T${slot.startTime}`);
   const now = new Date();
   const isPast = slotDateTime.getTime() <= now.getTime();


    // Cắt bỏ phần ":00" cuối cùng
    const startTimeFormatted = slot.startTime.slice(0, 5);
    const endTimeFormatted = slot.endTime.slice(0, 5);

    return (
      <option key={slot.id} value={slot.id} disabled={isPast}>
        {startTimeFormatted} - {endTimeFormatted} {isPast ? "(Hết hạn)" : ""}
      </option>
    );
  })}
</select>
<p>Danh sách lịch hẹn</p>
<ul className={styles["slot-status-list"]}>
  {slots.map((slot) => {
    const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
    const now = new Date();
    const isPast = slotDateTime.getTime() <= now.getTime();

    // Cắt bỏ phần ":00" cuối cùng
    const startTimeFormatted = slot.startTime.slice(0, 5);
    const endTimeFormatted = slot.endTime.slice(0, 5);

    return (
      <li key={slot.id} className={styles["slot-status-item"]}>
        {slot.date} {startTimeFormatted} - {endTimeFormatted}
        {isPast && <span className={styles["status-text"]}> (Hết hạn)</span>}
        {slot.isBooked && <span className={styles["status-text"]}> (Đã được đặt)</span>}
      </li>
    );
  })}
</ul>


      {error && <p className={styles.error}>{error}</p>}

      <div className={styles["reschedule-button-group"]}>
        <button className={`${styles.button} ${styles["reschedule-back-button"]}`} onClick={() => navigate("/my-booking")} disabled={loading}>
          Quay lại
        </button>
        <button className={`${styles.button} ${styles["reschedule-button"]}`} onClick={handleReschedule} disabled={loading || !selectedSlot}>
          {loading ? "Đang cập nhật..." : "Cập nhật lịch hẹn"}
        </button>
      </div>
    </div>
  );
};

export default RescheduleBooking;
