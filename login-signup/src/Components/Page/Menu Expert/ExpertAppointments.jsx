import React, { useEffect, useState } from "react";
import styles from "./ExpertAppointments.module.css"; // Import CSS Module

const ExpertAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const expertId = Number(localStorage.getItem("expertId")); // Lấy expertId của chuyên gia hiện tại
    
    fetch("/api/booking", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Dữ liệu từ API:", data); // Kiểm tra dữ liệu trả về từ API
        // Lọc các lịch hẹn chỉ dành cho chuyên gia hiện tại
        const filteredByExpert = data.filter(appt => appt.slotExpert.expert.id === expertId);
        console.log("Lịch hẹn của chuyên gia:", filteredByExpert); // Kiểm tra dữ liệu đã lọc
        setAppointments(filteredByExpert);
        setFilteredAppointments(filteredByExpert);
      })
      .catch((error) => console.error("Lỗi khi tải lịch hẹn:", error));
  }, []); // Chạy lần đầu tiên khi component mount

// Xử lý bộ lọc khi có sự thay đổi
useEffect(() => {
  let filtered = appointments;

  if (statusFilter) {
    filtered = filtered.filter(appt => appt.status === statusFilter);
  }

  if (dateFilter) {
    filtered = filtered.filter(appt => appt.slotExpert.date === dateFilter);
  }

  if (searchTerm) {
    filtered = filtered.filter(appt =>
      appt.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredAppointments(filtered);
  setCurrentPage(1);
}, [statusFilter, dateFilter, searchTerm, appointments]); // Thêm appointments vào dependency array

  // Phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  // Chuyển trang
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredAppointments.length / itemsPerPage)));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Cập nhật trạng thái lịch hẹn
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/booking/${bookingId}?status=${newStatus}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Lỗi: ${response.statusText}`);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === bookingId ? { ...appt, status: newStatus } : appt
        )
      );

      alert("✅ Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái!");
    }
  };

  // Lưu link Google Meet vào localStorage
  const saveMeetLink = (bookingId, meetLink) => {
    localStorage.setItem(`meetLink-${bookingId}`, meetLink);
    alert("✅ Link Google Meet đã được lưu!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Danh sách lịch hẹn</h2>

      {/* Bộ lọc */}
      <div className={styles.filters}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Đang chờ được chấp nhận lịch hẹn</option>
          <option value="PENDING_PAYMENT">Chờ thanh toán</option>
          <option value="AWAIT">Đang chờ được bắt đầu tư vấn</option>
          <option value="PROCESSING">Đang diễn ra</option>
          <option value="FINISHED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />

        <input
          type="text"
          placeholder="Tìm khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Danh sách lịch hẹn */}
      <ul className={styles.list}>
        {displayedAppointments.map((appointment) => (
          <li key={appointment.id} className={styles.listItem}>
            <p>
              <strong>ID:</strong> {appointment.id} |
              <strong> Ngày:</strong> {appointment.slotExpert.date} |
              <strong> Giờ:</strong> {appointment.slotExpert.slot.startTime} - {appointment.slotExpert.slot.endTime} |
              <strong> Trạng thái:</strong> {appointment.status}
            </p>
            <p><strong>Khách hàng:</strong> {appointment.user?.name} ({appointment.user?.email})</p>

            {/* Dịch vụ */}
            <p><strong>Dịch vụ:</strong></p>
            <ul>
              {appointment.services.length > 0 ? (
                appointment.services.map(service => (
                  <li key={service.id}>
                    {service.name} - {service.price.toLocaleString()} VND ({service.duration} phút)
                  </li>
                ))
              ) : (
                <li>Không có dịch vụ</li>
              )}
            </ul>

            {/* Các nút thao tác */}
            {appointment.status === "PENDING" && (
              <>
                <button className={styles.acceptButton} onClick={() => updateStatus(appointment.id, "PENDING_PAYMENT")}>Chấp nhận</button>
                <button className={styles.rejectButton} onClick={() => updateStatus(appointment.id, "CANCELLED")}>Từ chối</button>
              </>
            )}

            {appointment.status === "AWAIT" && (
              <>
                <button className={styles.startButton} onClick={() => updateStatus(appointment.id, "PROCESSING")}>Bắt đầu tư vấn</button>
                
                {/* Ô nhập link Google Meet */}
                <div className={styles.meetContainer}>
                  <input
                    type="text"
                    placeholder="Nhập link Google Meet"
                    className={styles.meetInput}
                    value={appointment.meetLink || ""}
                    onChange={(e) => {
                      const newLink = e.target.value;
                      setAppointments((prev) =>
                        prev.map((appt) =>
                          appt.id === appointment.id ? { ...appt, meetLink: newLink } : appt
                        )
                      );
                    }}
                  />
                  <button className={styles.saveButton} onClick={() => saveMeetLink(appointment.id, appointment.meetLink)}>💾 Lưu Link</button>
                </div>
              </>
            )}

            {appointment.status === "PROCESSING" && (
              <button className={styles.finishButton} onClick={() => updateStatus(appointment.id, "FINISHED")}>Hoàn tất tư vấn</button>
            )}
          </li>
        ))}
      </ul>

      {/* Phân trang */}
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅️ Trang trước</button>
        <span>Trang {currentPage} / {Math.ceil(filteredAppointments.length / itemsPerPage)}</span>
        <button onClick={nextPage} disabled={startIndex + itemsPerPage >= filteredAppointments.length}>Trang sau ➡️</button>
      </div>
    </div>
  );
};

export default ExpertAppointment;