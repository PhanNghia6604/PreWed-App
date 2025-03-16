import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MyBookings.module.css";

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); // 🔹 Lọc theo trạng thái
  const [statusFilter, setStatusFilter] = useState(""); // 🔹 Trạng thái filter
  const [currentPage, setCurrentPage] = useState(1); // 🔹 Phân trang
  const itemsPerPage = 5; // 🔹 Số lượng lịch hẹn mỗi trang
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).userId : null;
    
    if (!userId) {
      console.error("❌ Không tìm thấy userId trong localStorage!");
      return;
    }
    console.log("✅ User ID hiện tại:", userId);
    
  
    
  
    fetch("/api/booking", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("📌 Dữ liệu API trả về:", data);
    
        if (!Array.isArray(data)) {
          console.error("❌ API không trả về mảng dữ liệu hợp lệ!", data);
          return;
        }
    
        console.log("✅ User ID hiện tại:", userId);
    
        // 🔹 Kiểm tra từng phần tử trước khi lọc
        data.forEach((booking, index) => {
          console.log(`📌 Booking ${index}:`, booking);
        });
    
        // 🔹 Lọc danh sách chỉ lấy của user hiện tại
        const filteredData = data.filter(
          (booking) => booking?.user?.id === userId
        );
    
        console.log("✅ Danh sách booking của user hiện tại:", filteredData);
    
        setBookings(filteredData);
        setFilteredBookings(sortBookings(filteredData));
      })
      .catch((error) => console.error("❌ Lỗi lấy danh sách lịch hẹn:", error));
    
  }, []);
  
  

  // Lọc theo trạng thái
  useEffect(() => {
    const filtered = statusFilter
      ? bookings.filter((b) => b.status === statusFilter)
      : bookings;
    setFilteredBookings(sortBookings(filtered)); // 🔹 Cập nhật danh sách đã lọc
    setCurrentPage(1); // 🔹 Reset trang về đầu khi thay đổi filter
  }, [statusFilter, bookings]);

  // 🔹 Hàm sắp xếp: Đưa `CANCELLED` và `FINISHED` xuống cuối
  const sortBookings = (list) => {
    return [...list].sort((a, b) => {
      const order = { CANCELLED: 1, FINISHED: 1 }; // Trạng thái cần đẩy xuống cuối
      return (order[a.status] || 0) - (order[b.status] || 0);
    });
  };

  // Xử lý hủy lịch hẹn
  const handleCancelBooking = (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;

    fetch(`/api/booking/${id}?status=CANCELLED`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
        );
      })
      .catch((error) => console.error("Lỗi hủy lịch:", error));
  };

  const handlePayment = async (bookingId) => {
    try {
      localStorage.setItem("bookingId", bookingId);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) throw new Error("Lỗi tạo yêu cầu thanh toán!");

      const paymentUrl = await response.text(); // Lấy URL trực tiếp từ API
      window.location.href = paymentUrl; // Chuyển hướng đến VNPay
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Không thể tạo yêu cầu thanh toán, vui lòng thử lại!");
    }
  };
  const [reviewedBookings, setReviewedBookings] = useState(() => {
    return JSON.parse(localStorage.getItem("reviewedBookings")) || {};
  });
  
  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviewedBookings")) || {};
    setReviewedBookings(storedReviews);
  }, []);

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={style.container}>
      <h2>Lịch đặt của tôi</h2>

      {/* 🔹 Bộ lọc trạng thái */}
      <div className={style.filterContainer}>
        <label htmlFor="statusFilter">Lọc theo trạng thái:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={style.filterSelect}
        >
          <option value="">Tất cả</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="PENDING_PAYMENT">Chờ thanh toán</option>
          <option value="AWAIT">Chờ tư vấn</option>
          <option value="PROCESSING">Đang tư vấn</option>
          <option value="FINISHED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {currentBookings.length === 0 ? (
        <p>Không có lịch hẹn phù hợp.</p>
      ) : (
        <ul className={style.bookingList}>
          {currentBookings.map((b) => {
            const expert = b.slotExpert.expert;
            const meetLink = localStorage.getItem(`meetLink-${b.id}`);
            return (
              <li key={b.id} className={style.bookingItem}>
                <img src={expert.avatar} alt={expert.name} className={style.expertAvatar} />
                <div className={style.bookingInfo}>
                  <strong>{expert.name}</strong>
                  <p>📅 Ngày: {b.slotExpert.date}</p>
                  <p>⏰ Giờ: {b.slotExpert.slot.startTime} - {b.slotExpert.slot.endTime}</p>
                  {b.services.length > 0 && (
      <p>💼 Dịch vụ: {b.services[0].name} - 💰 {b.services[0].price.toLocaleString()} VND</p>
    )}
                 
                  <p>📌 Trạng thái: <strong>{b.status}</strong></p>

                  {b.status === "PENDING" && <p className={style.pendingText}>⏳ Đang chờ chuyên gia xác nhận...</p>}
                  {b.status === "PENDING_PAYMENT" && <button className={style.payButton} onClick={() => handlePayment(b.id)}>💳 Thanh toán</button>}
                  {b.status === "AWAIT" && <p className={style.awaitText}>⏳ Bạn đã thanh toán. Vui lòng đợi đến giờ tư vấn!</p>}
                  {b.status === "PROCESSING" && meetLink && <p>🔗 Link tư vấn: <a href={meetLink.startsWith("http") ? meetLink : `https://${meetLink}`} target="_blank" rel="noopener noreferrer" className={style.link}>{meetLink}</a></p>}
                  {b.status === "FINISHED" && (
  reviewedBookings[b.id] ? (
    <p className={style.reviewedText}>✅ Đã đánh giá</p>
  ) : (
    <button 
      className={style.feedbackButton} 
      onClick={() => navigate(`/feedback/${b.id}/${expert.id}`)}
    >
      ✍️ Đánh giá chuyên gia
    </button>
  ))}
                  {b.status === "CANCELLED" && <p className={style.cancelledText}>❌ Lịch hẹn đã bị hủy.</p>}
                  {["PENDING", "PENDING_PAYMENT"].includes(b.status) && <button className={style.cancelButton} onClick={() => handleCancelBooking(b.id)}>❌ Hủy lịch</button>}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* 🔹 Phân trang */}
      {totalPages > 1 && (
  <div className={style.pagination}>
    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
      ◀ Trước
    </button>
    <span>Trang {currentPage} / {totalPages}</span>
    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
      Sau ▶
    </button>
  </div>
)}
</div>
  )
}

