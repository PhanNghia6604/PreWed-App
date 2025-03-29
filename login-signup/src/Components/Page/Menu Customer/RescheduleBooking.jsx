import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./RescheduleBooking.module.css";

const RescheduleBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch("/api/slots", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch slots");
        const data = await response.json();
        setSlots(data);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("Không thể tải danh sách slot. Vui lòng thử lại sau.");
      }
    };

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch booking");
        const data = await response.json();
        const filteredBooking = data.find(
          (booking) => booking.id === Number(bookingId)
        );
        if (!filteredBooking) throw new Error("Booking not found");
        setBookingData(filteredBooking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Không thể tải thông tin đặt lịch. Vui lòng thử lại sau.");
        navigate("/my-booking", { replace: true });
      }
    };

    fetchSlots();
    fetchBooking();
  }, [bookingId, navigate]);

  const validateSlotSelection = () => {
    if (!selectedSlot) {
      return "Vui lòng chọn một slot mới!";
    }
  
    const selectedSlotData = slots.find((slot) => slot.id === Number(selectedSlot));
    if (!selectedSlotData) {
      return "Slot không hợp lệ, vui lòng thử lại!";
    }
  
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const [slotHours, slotMinutes] = selectedSlotData.startTime.split(':').map(Number);
    
    const isPastSlot = (slotHours < currentHours) || 
                      (slotHours === currentHours && slotMinutes <= currentMinutes);
  
    if (isPastSlot) {
      return "Không thể chọn slot đã qua thời gian hiện tại!";
    }
  
    if (selectedSlotData.isBooked) {
      return "Slot này đã được đặt. Vui lòng chọn slot khác!";
    }
  
    if (bookingData && Number(selectedSlot) === bookingData.slotExpert.slot.id) {
      return "Bạn đang chọn cùng một slot. Vui lòng chọn slot khác!";
    }
  
    return null;
  };

  const handleReschedule = async () => {
    setError("");
    const validationError = validateSlotSelection();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/booking/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          slotId: Number(selectedSlot),
          expertId: bookingData.slotExpert.expert.id,
          bookingDate: bookingData.slotExpert.date,
          serviceIds: bookingData.services.map((s) => s.id),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }

      alert("Cập nhật lịch hẹn thành công!");
      navigate("/my-booking", { replace: true });
    } catch (err) {
      console.error("Lỗi cập nhật lịch:", err);
      setError(err.message || "Không thể cập nhật lịch, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (slot) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const [slotHours, slotMinutes] = slot.startTime.split(':').map(Number);
    
    const isPastSlot = (slotHours < currentHours) || 
                      (slotHours === currentHours && slotMinutes <= currentMinutes);
  
    if (slot.isBooked) return " (Đã được đặt)";
    if (isPastSlot) return " (Đã qua)";
    if (bookingData && slot.id === bookingData.slotExpert.slot.id) return " (Slot hiện tại)";
    return "";
  };

  const isSlotDisabled = (slot) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Tách giờ và phút từ slot.startTime
    const [slotHours, slotMinutes] = slot.startTime.split(':').map(Number);
    
    // So sánh với thời gian hiện tại
    const isPastSlot = (slotHours < currentHours) || 
                      (slotHours === currentHours && slotMinutes <= currentMinutes);
  
    return (
      slot.isBooked ||
      isPastSlot ||
      (bookingData && slot.id === bookingData.slotExpert.slot.id)
    );
  };
  if (!bookingData) {
    return <div className={styles["reschedule-container"]}>Loading...</div>;
  }

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
        {slots.map((slot) => (
          <option
            key={slot.id}
            value={slot.id}
            disabled={isSlotDisabled(slot)}
            className={isSlotDisabled(slot) ? styles["reschedule-disabled-slot"] : ""}
          >
            {slot.date} {slot.startTime} - {slot.endTime}
            {getSlotStatus(slot)}
          </option>
        ))}
      </select>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles["reschedule-button-group"]}>
        <button
          className={`${styles.button} ${styles["reschedule-back-button"]}`}
          onClick={() => navigate("/my-booking")}
          disabled={loading}
        >
          Quay lại
        </button>
        <button
          className={`${styles.button} ${styles["reschedule-button"]}`}
          onClick={handleReschedule}
          disabled={loading || !selectedSlot}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật lịch hẹn"}
        </button>
      </div>
    </div>
  );
};

export default RescheduleBooking;