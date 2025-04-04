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
  const [selectedDate, setSelectedDate] = useState("");

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
        // Set ngày mặc định là ngày hiện tại của booking
        setSelectedDate(currentBooking.slotExpert.date);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        alert(err.message);
        setError(err.message);
        navigate("/my-booking", { replace: true });
      }
    };

    fetchData();
  }, [bookingId, navigate, token]);

  // Hàm kiểm tra slot có phải là quá khứ không (theo ngày được chọn)
  const isPastSlot = (slot) => {
    const dateToCheck = selectedDate || bookingData?.slotExpert?.date || new Date().toISOString().split("T")[0];
    const slotDateTime = new Date(`${dateToCheck}T${slot.startTime}`);
    const now = new Date();
    
    // So sánh chính xác cả ngày và giờ
    return slotDateTime <= now;
  };
  const isSelectableSlot = (slot) => {
    // Slot phải không quá khứ và không bị booked bởi người khác
    return !isPastSlot(slot) && !isBookedByOthers(slot.id);
  };
  const isBeforeCurrentSlot = (slot) => {
    if (!bookingData?.slotExpert) return false;
    
    const currentSlotTime = new Date(`${bookingData.slotExpert.date}T${bookingData.slotExpert.slot.startTime}`);
    const newSlotTime = new Date(`${selectedDate}T${slot.startTime}`);
    
    return newSlotTime < currentSlotTime && selectedDate === bookingData.slotExpert.date;
  };

 
  // Hàm lấy thông tin người đã đặt slot (nếu có)
  const getBookedByInfo = (slotId) => {
    const booking = bookings.find(
      (b) => b.slotExpert.slot.id === Number(slotId) && b.user.id !== bookingData?.user?.id
    );
    return booking ? ` (Đã đặt bởi ${booking.user.name})` : "";
  };
// Hàm kiểm tra slot đã được đặt bởi người khác
const isBookedByOthers = (slotId) => {
  return bookings.some(
    (booking) =>
      booking.slotExpert.slot.id === Number(slotId) &&
      booking.user.id !== bookingData?.user?.id &&
      booking.slotExpert.date === (selectedDate || bookingData.slotExpert.date)
  );
};

// Hàm kiểm tra slot đã được đặt bởi người khác từ cùng chuyên gia
const isBookedByOthersFromSameExpert = (slotId) => {
  return bookings.some(
    (booking) =>
      booking.slotExpert.slot.id === Number(slotId) &&
      booking.user.id !== bookingData?.user?.id &&
      booking.slotExpert.expert.id === bookingData?.slotExpert?.expert?.id &&
      booking.slotExpert.date === (selectedDate || bookingData.slotExpert.date)
  );
};
// Hàm lấy thông tin người đã đặt slot từ cùng chuyên gia
const getBookedBySameExpertInfo = (slotId) => {
  const booking = bookings.find(
    (b) => 
      b.slotExpert.slot.id === Number(slotId) && 
      b.user.id !== bookingData?.user?.id &&
      b.slotExpert.expert.id === bookingData?.slotExpert?.expert?.id &&
      b.slotExpert.date === (selectedDate || bookingData.slotExpert.date)
  );
  return booking ? ` (Đã đặt bởi ${booking.user.name} - cùng chuyên gia)` : "";
};
const validateSlotSelection = (selectedSlot) => {
  if (!selectedSlot) return "Vui lòng chọn slot mới!";

  const selectedSlotData = slots.find((slot) => slot.id === Number(selectedSlot));
  if (!selectedSlotData) return "Slot không hợp lệ!";

  // 1. Kiểm tra slot không phải quá khứ
  if (isPastSlot(selectedSlotData)) {
    return "Không thể chọn slot đã qua!";
  }

  // 2. Kiểm tra buffer time (ít nhất 30 phút so với hiện tại)
  const now = new Date();
  const slotTime = new Date(`${selectedDate}T${selectedSlotData.startTime}`);
  const minBufferMinutes = 30; // Có thể điều chỉnh tùy yêu cầu

  if (slotTime <= new Date(now.getTime() + minBufferMinutes * 60000)) {
    return `Vui lòng chọn slot sau ${minBufferMinutes} phút kể từ bây giờ`;
  }

  // 3. Kiểm tra slot không bị người khác đặt
  if (isBookedByOthers(selectedSlotData.id)) {
    return "Slot đã được đặt bởi người khác!";
  }

  // 4. Bỏ kiểm tra "slot trước slot hiện tại" (cho phép đổi tự do)
  return null; // Hợp lệ
};
  const handleReschedule = async () => {
    if (!bookingData) return;
  
    const validationError = validateSlotSelection(selectedSlot);
    if (validationError) return;
  
    try {
      setLoading(true);
      setError("");
  
      const token = localStorage.getItem("token");
      
  
      if (!token) {
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
  
      // Kiểm tra trạng thái booking
      if (bookingData.status !== "AWAIT") {
        throw new Error("Chỉ có thể thay đổi lịch hẹn khi ở trạng thái chờ xác nhận");
      }
  
      // Lấy thông tin slot mới
      const newSlot = slots.find(s => s.id === Number(selectedSlot));
      
      // Kiểm tra thời gian slot mới
      const slotDateTime = new Date(`${selectedDate || bookingData.slotExpert.date}T${newSlot.startTime}`);
      const now = new Date();
      if (slotDateTime <= now) {
        throw new Error("Không thể chọn khung giờ trong quá khứ");
      }
  
      // Kiểm tra xung đột lịch hẹn
      const currentUserId = localStorage.getItem("userId");
      const userBookings = bookings.filter(
        (booking) => ["PENDING", "PENDING_PAYMENT", "PROCESSING", "AWAIT"].includes(booking.status) &&
                    booking.user.id === currentUserId &&
                    booking.id !== bookingData.id
      );
  
      const isTimeOverlap = (start1, end1, start2, end2) => {
        return start1 < end2 && end1 > start2;
      };
  
      for (const booking of userBookings) {
        if (!booking.slotExpert?.slot) continue;
  
        const bookedStart = new Date(`${booking.slotExpert.date}T${booking.slotExpert.slot.startTime}`);
        const bookedEnd = new Date(`${booking.slotExpert.date}T${booking.slotExpert.slot.endTime}`);
  
        if (isTimeOverlap(slotDateTime, new Date(`${selectedDate || bookingData.slotExpert.date}T${newSlot.endTime}`), bookedStart, bookedEnd)) {
          if (booking.slotExpert.expert.id === bookingData.slotExpert.expert.id) {
            throw new Error(`Bạn đã có lịch với chuyên gia này vào ${booking.slotExpert.slot.startTime.slice(0, 5)}-${booking.slotExpert.slot.endTime.slice(0, 5)}`);
          } else {
            throw new Error(`Bạn đã có lịch với chuyên gia ${booking.slotExpert.expert.name} vào khung giờ này`);
          }
        }
      }
  
      // Gọi API cập nhật
      const response = await fetch(`/api/booking/${bookingData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: newSlot.id,
          expertId: bookingData.slotExpert.expert.id, // Luôn gửi expertId
          bookingDate: selectedDate || bookingData.slotExpert.date, // Dùng ngày mới nếu có
          serviceIds: bookingData.services.map(s => s.id),
        }),
      });
  
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Cập nhật thất bại, vui lòng thử lại sau!");
      }
  
      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thất bại");
      }
  
      // 7️⃣ Thông báo thành công & cập nhật giao diện
      alert("Đổi lịch thành công! Hệ thống sẽ thông báo cho chuyên gia biết.");
      navigate("/my-booking");
  
    } catch (error) {
      console.error("❌ Lỗi khi đổi lịch:", error);
      setError(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!bookingData) return <div className={styles["reschedule-container"]}>Loading...</div>;

  return (
    <div className={styles["reschedule-container"]}>
      <h2 className={styles["h2-reschedule"]}>Đổi lịch hẹn</h2>
      <p className={styles["p-reschedule"]}>Lịch hẹn hiện tại: {bookingData.slotExpert.date} {bookingData.slotExpert.slot.startTime.slice(0, 5)} - {bookingData.slotExpert.slot.endTime.slice(0, 5)}</p>
  
      <label>Chọn ngày mới:</label>
      <input
        type="date"
        className={styles["reschedule-date"]}
        value={selectedDate}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setSelectedSlot(null); // Reset lựa chọn slot khi thay đổi ngày
        }}
        min={new Date().toISOString().split("T")[0]}
      />
  
  <label>Chọn thời gian mới:</label>
<div className={styles["time-select-container"]}>
  <select
    className={styles["reschedule-select"]}
    onChange={(e) => setSelectedSlot(e.target.value)}
    value={selectedSlot || ""}
  >
    <option value="">-- Chọn khung giờ --</option>
    {slots.map((slot) => {
      const isPast = isPastSlot(slot);
      const isBooked = isBookedByOthers(slot.id);
      const isBookedSameExpert = isBookedByOthersFromSameExpert(slot.id);
      const bookedInfo = isBookedSameExpert 
        ? ` (Chuyên gia bận - ${getBookedBySameExpertInfo(slot.id)})`
        : isBooked 
          ? ` (Đã đặt bởi người khác)`
          : "";
      
      const startTimeFormatted = slot.startTime.slice(0, 5);
      const endTimeFormatted = slot.endTime.slice(0, 5);

      return (
        <option 
          key={slot.id} 
          value={slot.id} 
          disabled={isPast || isBooked}
          className={`${styles["slot-item"]} ${
            isPast ? styles["slot-past"] : ""
          } ${
            isBookedSameExpert 
              ? styles["slot-expert-busy"] 
              : isBooked 
                ? styles["slot-booked"] 
                :  isSelectableSlot(slot)
                  ? styles["slot-available"]
                  : styles["slot-unavailable"]
          }`}
        >
          {startTimeFormatted} - {endTimeFormatted}
          {isPast && " ✗ Hết hạn"}
          {isBookedSameExpert && bookedInfo}
          {isBooked && !isBookedSameExpert && bookedInfo}
          {!isPast && !isBooked && " ✓ Có thể đặt"}
        </option>
      );
    })}
  </select>
  <span className={styles["select-arrow"]}>▼</span>
</div>
  
<p className={styles["slot-list-title"]}>Tình trạng các khung giờ ngày {selectedDate || "hôm nay"}</p>
<div className={styles["slot-grid"]}>
  {slots.map((slot) => {
   const isPast = isPastSlot(slot);
   const isBooked = isBookedByOthers(slot.id);
   const isBookedSameExpert = isBookedByOthersFromSameExpert(slot.id);
   
   // Thêm dòng này để lấy thông tin booking
   const booking = isBookedSameExpert 
     ? bookings.find(
         b => b.slotExpert.slot.id === slot.id && 
              b.slotExpert.date === (selectedDate || bookingData.slotExpert.date)
       )
     : null;
   
   const startTimeFormatted = slot.startTime.slice(0, 5);
   const endTimeFormatted = slot.endTime.slice(0, 5);

    return (
      <div
        key={slot.id}
        className={`${styles["slot-item"]} ${
          isPast ? styles["slot-past"] : ""
        } ${
          isBookedSameExpert 
            ? styles["slot-expert-busy"] 
            : isBooked 
              ? styles["slot-booked"] 
              : styles["slot-available"]
        }`}
      >
        <div className={styles["slot-time"]}>
          {startTimeFormatted} - {endTimeFormatted}
        </div>
        <div className={styles["slot-status"]}>
          {isPast ? (
            <span className={styles["status-badge"]} style={{background: '#ccc'}}>
              <i className="fas fa-ban"></i> Hết hạn
            </span>
          ) : isBookedSameExpert ? (
            <span className={styles["status-badge"]} style={{background: '#ff6b6b'}}>
              <i className="fas fa-user-clock"></i> Chuyên gia bận
            </span>
          ) : isBooked ? (
            <span className={styles["status-badge"]} style={{background: '#ffb347'}}>
              <i className="fas fa-user-lock"></i> Đã đặt
            </span>
          ) : (
            <span className={styles["status-badge"]} style={{background: '#77dd77'}}>
              <i className="fas fa-check"></i> Có thể đặt
            </span>
          )}
        </div>
        {isBookedSameExpert && booking && (
        <div className={styles["slot-detail"]}>
          <i className="fas fa-info-circle"></i> Đã đặt vào {booking.slotExpert.date}
        </div>
      )}
      
      {isBooked && !isBookedSameExpert && (
        <div className={styles["slot-detail"]}>
          <i className="fas fa-info-circle"></i> Đã có người đặt
        </div>
      )}
    </div>
    );
  })}
</div>
  
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
}  
export default RescheduleBooking;
