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
        console.log("Dữ liệu từ API:", data);
        const filteredByExpert = data.filter(appt => appt.slotExpert.expert.id === expertId);
        
        // Xếp hạng mức độ ưu tiên của status
        const statusPriority = {
          "PENDING": 1,  // Ưu tiên cao nhất
          "PENDING_PAYMENT": 3,
          "AWAIT": 2,
          "PROCESSING": 2,
          "FINISHED": 4,
          "CANCELLED": 5  // Ưu tiên thấp nhất
        };
  
        // Sắp xếp lịch hẹn theo `status` trước, sau đó theo `id` giảm dần
        const sortedAppointments = filteredByExpert.sort((a, b) => {
          if (statusPriority[a.status] !== statusPriority[b.status]) {
            return statusPriority[a.status] - statusPriority[b.status]; // Sắp xếp theo status
          }
          return b.id - a.id; // Nếu cùng status, sắp xếp theo id giảm dần
        });
  
        console.log("Lịch hẹn đã sắp xếp:", sortedAppointments);
        setAppointments(sortedAppointments);
        setFilteredAppointments(sortedAppointments);
      })
      .catch((error) => console.error("Lỗi khi tải lịch hẹn:", error));
  }, []);
  
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
  
      {/* Bảng danh sách lịch hẹn */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày</th>
            <th>Giờ</th>
            <th>Trạng thái</th>
            <th>Khách hàng</th>
            <th>Dịch vụ</th>
            <th>Giá tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
  {displayedAppointments.map((appointment) => (
    <tr key={appointment.id}>
      <td>{appointment.id}</td>
      <td>{appointment.slotExpert.date}</td>
      <td>{appointment.slotExpert.slot.startTime} - {appointment.slotExpert.slot.endTime}</td>
      <td>{appointment.status}</td>
      <td>{appointment.user?.name} ({appointment.user?.email})</td>
      <td>
        {appointment.services.length > 0 ? (
          <ul className={styles.serviceList}>
            {appointment.services.map(service => (
              <li key={service.id}>{service.name} ({service.duration} phút)</li>
            ))}
          </ul>
        ) : "Không có dịch vụ"}
      </td>
      <td>
        {appointment.services.length > 0 ? (
          appointment.services.reduce((total, service) => total + service.price, 0).toLocaleString() + " VND"
        ) : "0 VND"}
      </td>
      <td>
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
              <button className={styles.saveButton} onClick={() => saveMeetLink(appointment.id, appointment.meetLink)}>💾 Lưu</button>
            </div>
          </>
        )}

        {appointment.status === "PROCESSING" && (
          <button className={styles.finishButton} onClick={() => updateStatus(appointment.id, "FINISHED")}>Hoàn tất tư vấn</button>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>
  
      {/* Phân trang */}
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅️ Trang trước</button>
        <span>Trang {currentPage} / {Math.ceil(filteredAppointments.length / itemsPerPage)}</span>
        <button onClick={nextPage} disabled={startIndex + itemsPerPage >= filteredAppointments.length}>Trang sau ➡️</button>
      </div>
    </div>
  );
}  
export default ExpertAppointment;