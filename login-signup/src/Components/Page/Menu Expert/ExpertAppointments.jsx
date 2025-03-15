import React, { useEffect, useState } from "react";
import styles from "./ExpertAppointments.module.css"; // Import CSS Module

const ExpertAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("/api/booking", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  // Hàm cập nhật trạng thái lịch hẹn
  const updateStatus = (id, status) => {
    fetch(`/api/booking/${id}?status=${status}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized");
        return response.json();
      })
      .then(() => {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === id ? { ...appointment, status } : appointment
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Danh sách lịch hẹn</h2>
      <ul className={styles.list}>
        {appointments.map((appointment) => (
          <li key={appointment.id} className={styles.listItem}>
            <p>
              <strong>ID:</strong> {appointment.id} |
              <strong> Ngày:</strong> {appointment.slotExpert.date} |
              <strong> Giờ:</strong> {appointment.slotExpert.slot.startTime} - {appointment.slotExpert.slot.endTime} |
              <strong> Trạng thái:</strong> {appointment.status}
            </p>

            {/* Hiển thị thông tin người dùng */}
            <p><strong>Khách hàng:</strong> {appointment.user ? `${appointment.user.name} (${appointment.user.email})` : "Chưa có thông tin khách hàng"}</p>

            {/* Hiển thị danh sách dịch vụ */}
            <p><strong>Dịch vụ:</strong></p>
            <ul>
              {appointment.services.length > 0 ? (
                appointment.services.map(service => (
                  <li key={service.id}>
                    {service.name} - {service.price.toLocaleString()} VND ({service.duration} phút)
                  </li>
                ))
              ) : (
                <li>Không có dịch vụ nào</li>
              )}
            </ul>

            {/* Nếu trạng thái là PENDING, hiển thị nút Chấp nhận & Từ chối */}
            {appointment.status === "PENDING" && (
              <>
                <button
                  className={styles.acceptButton}
                  onClick={() => updateStatus(appointment.id, "PENDING_PAYMENT")}
                >
                  Chấp nhận
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => updateStatus(appointment.id, "CANCELLED")}
                >
                  Từ chối
                </button>
              </>
            )}

            {/* Nếu trạng thái là AWAIT, hiển thị nút Bắt đầu tư vấn */}
            {appointment.status === "AWAIT" && (
              <button
                className={styles.startButton}
                onClick={() => updateStatus(appointment.id, "PROCESSING")}
              >
                Bắt đầu tư vấn
              </button>
            )}

            {/* Nếu trạng thái là PROCESSING, hiển thị nút Hoàn tất tư vấn */}
            {appointment.status === "PROCESSING" && (
              <button
                className={styles.finishButton}
                onClick={() => updateStatus(appointment.id, "FINISHED")}
              >
                Hoàn tất tư vấn
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpertAppointment;
