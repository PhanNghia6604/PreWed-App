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
    if (!selectedSlot) {
        alert("Vui lòng chọn khung giờ mới!");
        return;
    }

    try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const currentUserId = localStorage.getItem("userId");

        if (!token) {
            alert("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
            navigate("/login");
            return;
        }

        // 1️⃣ Kiểm tra trạng thái booking
        if (bookingData.status !== "AWAIT") {
            throw new Error("Chỉ có thể thay đổi lịch hẹn khi ở trạng thái chờ xác nhận");
        }

        // 2️⃣ Lấy thông tin slot mới
        const newSlot = slots.find(s => s.id === Number(selectedSlot));
        if (!newSlot) {
            throw new Error("Khung giờ không hợp lệ!");
        }

        // 3️⃣ Kiểm tra xem có đổi lịch với cùng slot không
        if (newSlot.id === bookingData.slotExpert.slot.id) {
            throw new Error("Bạn đang chọn lại cùng một khung giờ, vui lòng chọn khung giờ khác.");
        }

        // 4️⃣ Kiểm tra thời gian slot mới
        const today = new Date().toISOString().split("T")[0];
        const slotStartTime = new Date(`${today}T${newSlot.startTime}`).getTime();
        const slotEndTime = new Date(`${today}T${newSlot.endTime}`).getTime();
        const now = new Date().getTime();

        if (slotStartTime <= now) {
            throw new Error("Không thể chọn khung giờ trong quá khứ");
        }

        // 5️⃣ Kiểm tra xung đột lịch hẹn (loại bỏ booking cũ)
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

            const bookedStart = new Date(`${booking.slotExpert.date}T${booking.slotExpert.slot.startTime}`).getTime();
            const bookedEnd = new Date(`${booking.slotExpert.date}T${booking.slotExpert.slot.endTime}`).getTime();

            if (isTimeOverlap(slotStartTime, slotEndTime, bookedStart, bookedEnd)) {
                if (booking.slotExpert.expert.id === bookingData.slotExpert.expert.id) {
                    throw new Error(`Bạn đã có lịch với chuyên gia này vào ${booking.slotExpert.slot.startTime}-${booking.slotExpert.slot.endTime}`);
                } else {
                    throw new Error(`Bạn đã có lịch với chuyên gia ${booking.slotExpert.expert.name} vào khung giờ này`);
                }
            }
        }

        // 6️⃣ Gọi API cập nhật
        const response = await fetch(`/api/booking/${bookingData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                slotId: newSlot.id,
                expertId: bookingData.slotExpert.expert.id,
                bookingDate: today,
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
