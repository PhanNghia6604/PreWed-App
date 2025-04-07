import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./MyBookings.module.css";
const getStatusText = (status, isReviewed = false, hasMeetLink = false) => {
  switch (status) {
    case "PENDING":
      return "Chờ chuyên gia xác nhận, vui lòng đợi";
    case "PENDING_PAYMENT":
      return "Chuyên gia đã xác nhận, hãy thanh toán cho hệ thống";
    case "AWAIT":
      return (
        <>
          Cảm ơn bạn đã thanh toán. Bạn sẽ được tư vấn trong thời gian tới<br />
          <br style={{ marginBottom: "8px", display: "block" }} />
          Hoặc bạn có thể thay đổi lịch lại nếu lịch hiện tại không phù hợp với bạn hoặc trong lúc tư vấn có vấn đề
        </>
      );
    case "PROCESSING":
      return hasMeetLink
        ? "Đang tư vấn - Link đã sẵn sàng"
        : "Đang tư vấn - Chưa có link, vui lòng báo cáo tư vấn có vấn đề";
    case "FINISHED":
      return isReviewed ? "Tư vấn đã hoàn thành và đã được đánh giá" : "Tư vấn đã hoàn thành,vui lòng hãy để lại đánh giá cho chuyên gia";
    case "CANCELLED":
      return "Lịch hẹn đã bị hủy";
    default:
      return "Không xác định";
  }
};


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
    // const token = localStorage.getItem("token"); 

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
      const order = {
        PENDING: 0,
        PENDING_PAYMENT: 1,
        PROCESSING: 2,
        FINISHED: 3,
        CANCELLED: 4
      };

      // Sắp xếp theo trạng thái ưu tiên
      const statusOrder = order[a.status] - order[b.status];

      // Nếu trạng thái giống nhau, ưu tiên lịch sớm hơn
      if (statusOrder === 0) {
        const dateA = new Date(a.appointmentDate).getTime();
        const dateB = new Date(b.appointmentDate).getTime();

        if (dateA !== dateB) {
          return dateA - dateB; // Sớm hơn lên trước
        }
      }

      // Nếu cùng trạng thái và cùng ngày, ưu tiên ID mới nhất
      return b.id - a.id;
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
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }

      // Sửa URL để truyền status qua query parameter như API yêu cầu
      const url = `/api/booking/${bookingId}?status=${newStatus}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json" // Thêm header Accept
        }
        // KHÔNG gửi body vì status đã truyền qua URL
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          return;
        }
        throw new Error(`Cập nhật trạng thái thất bại: ${await response.text()}`);
      }

      const updatedBooking = await response.json();
      console.log("✅ Cập nhật booking thành công:", updatedBooking);

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại!");
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      localStorage.setItem("bookingId", bookingId);
      const token = localStorage.getItem("token");

      // First update status to PENDING_PAYMENT
      await updateBookingStatus(bookingId, "PENDING_PAYMENT");

      // Then create payment request
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const errorDetail = await response.json(); // ← Log chi tiết lỗi từ backend
        console.error("Backend error:", errorDetail);
        throw new Error("Lỗi tạo payment");
      }

      const paymentUrl = await response.text();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Không thể tạo yêu cầu thanh toán, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const bookingId = localStorage.getItem("bookingId");
        if (!bookingId) return;

        const token = localStorage.getItem("token");
        if (!token) {
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          return;
        }

        // Get all bookings
        const response = await fetch(`/api/booking`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            return;
          }
          throw new Error(`Lỗi API: ${await response.text()}`);
        }

        const allBookings = await response.json();

        // Find the specific booking we're interested in
        const currentBooking = allBookings.find(b => b.id === parseInt(bookingId));

        if (!currentBooking) {
          console.warn("Không tìm thấy booking với ID:", bookingId);
          return;
        }

        if (currentBooking.status === "AWAIT") {
          console.log("💰 Expert Payment:", currentBooking.expertPayment);
          alert(`Thanh toán thành công! Số tiền chuyên gia nhận: ${currentBooking.expertPayment}`);
          clearInterval(intervalId);
          localStorage.removeItem("bookingId"); // Clean up
        }

        // Don't automatically update to AWAIT - let the backend handle this
      } catch (error) {
        console.error("❌ Lỗi kiểm tra trạng thái thanh toán:", error);
      }
    };

    const intervalId = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);


  // key reviewedBookings được lưu vào localStorage để dùng đóng form đánh giá
  const handleReview = (bookingId) => {
    setReviewedBookings((prev) => {
      const updatedReviews = { ...prev, [bookingId]: true };
      localStorage.setItem("reviewedBookings", JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };
  const [reviewedBookings, setReviewedBookings] = useState(() => {
    const storedReviews = localStorage.getItem("reviewedBookings");
    return storedReviews ? JSON.parse(storedReviews) : {};
  });
  const checkAndCancelExpiredBookings = async () => {
    try {
      const now = new Date();
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const bookingsToCheck = bookings.filter(b => 
        ['PENDING', 'PENDING_PAYMENT'].includes(b.status)
      );
  
      for (const booking of bookingsToCheck) {
        try {
          // Parse ngày từ "yyyy-MM-dd" và thời gian từ "HH:mm:ss"
          const [year, month, day] = booking.slotExpert.date.split('-').map(Number);
          const [startHour, startMinute] = booking.slotExpert.slot.startTime.split(':').map(Number);
  
          // Kiểm tra giá trị hợp lệ
          if ([year, month, day, startHour, startMinute].some(isNaN)) {
            console.error('Dữ liệu thời gian không hợp lệ:', booking);
            continue;
          }
  
          const bookingTime = new Date(year, month - 1, day, startHour, startMinute);
          const expiryTime = new Date(bookingTime.getTime() + 15 * 60 * 1000);
  
          if (now > expiryTime) {
            console.log(`Tự động hủy booking ${booking.id} do quá hạn`);
            const response = await fetch(`/api/booking/${booking.id}?status=CANCELLED`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });
  
            if (response.ok) {
              const updatedBooking = await response.json();
              setBookings(prev => 
                prev.map(b => b.id === booking.id ? updatedBooking : b)
              );
            } else {
              console.error('Lỗi khi hủy booking:', await response.text());
            }
          }
        } catch (error) {
          console.error(`Lỗi xử lý booking ${booking.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Lỗi hệ thống khi kiểm tra lịch hẹn quá hạn:', error);
    }
  };
  useEffect(() => {
    // Kiểm tra ngay khi component load
    checkAndCancelExpiredBookings();

    // Thiết lập interval kiểm tra mỗi phút
    const intervalId = setInterval(checkAndCancelExpiredBookings, 60000);

    // Clear interval khi component unmount
    return () => clearInterval(intervalId);
  }, [bookings]); // Chạy lại khi bookings thay đổi
  const getExpiryInfo = (booking) => {
    if (!['PENDING', 'PENDING_PAYMENT'].includes(booking.status)) return null;
  
    try {
      // Parse ngày từ "yyyy-MM-dd" (ví dụ: "2025-04-07")
      const [year, month, day] = booking.slotExpert.date.split('-').map(Number);
      
      // Parse giờ từ "HH:mm:ss" (ví dụ: "14:00:00")
      const [startHour, startMinute] = booking.slotExpert.slot.startTime.split(':').map(Number);
  
      // Kiểm tra giá trị số hợp lệ
      if ([day, month, year, startHour, startMinute].some(isNaN)) {
        throw new Error("Dữ liệu thời gian không hợp lệ");
      }
  
      const bookingTime = new Date(year, month - 1, day, startHour, startMinute);
      const expiryTime = new Date(bookingTime.getTime() + 15 * 60 * 1000);
      const now = new Date();
  
      if (now > expiryTime) {
        return <span className={style.expiredText}>⚠️ Đã quá hạn (tự động hủy)</span>;
      }
  
      const remainingMinutes = Math.round((expiryTime - now) / (60 * 1000));
      return (
        <span className={style.expiryText}>
          ⏳ Tự động hủy sau: {remainingMinutes} phút
        </span>
      );
    } catch (error) {
      console.error("Lỗi tính thời gian hủy:", error);
      return <span className={style.errorText}>⚠️ Lỗi tính thời gian</span>;
    }
  };

  // useEffect(() => {
  //   const storedReviews = JSON.parse(localStorage.getItem("reviewedBookings")) || {};
  //   setReviewedBookings(storedReviews);
  // }, []);



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
        <table className={style.bookingTable}>
          <thead>
            <tr>
              <th>Chuyên gia</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Dịch vụ</th>
              <th>Giá tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((b) => {
              const expert = b.slotExpert.expert;
              const meetLink = localStorage.getItem(`meetLink-${b.id}`);
              return (
                <tr key={b.id}>
                  <td className={style.expertColumn}>
                    <img
                      src={expert.avatar && expert.avatar.includes("/") ? expert.avatar : `/images/experts/${expert.avatar}`}
                      alt={expert.name}
                      className={style.expertAvatar}
                      onError={(e) => (e.target.src = "/images/experts/default-avatar.png")}
                    />
                    <span>{expert.name}</span>
                  </td>

                  <td>{b.slotExpert.date}</td>
                  <td>{b.slotExpert.slot.startTime} - {b.slotExpert.slot.endTime}</td>
                  <td>
                    {b.services.length > 0 ? b.services[0].name : 'Không có'}
                  </td>
                  <td>
                    {b.services.length > 0 ? `${b.services[0].price.toLocaleString()} VND` : 'Không có'}
                  </td>
                  <td><strong>{getStatusText(b.status, reviewedBookings?.[b.id], !!meetLink)}</strong></td>

                  <td>
                    {b.status === "PENDING" && (
                      <div>
                        <p className={style.pendingText}>⏳ Đang chờ chuyên gia xác nhận...</p>
                        {getExpiryInfo(b)}
                      </div>
                    )}{b.status === "PENDING_PAYMENT" && (
                      <div>
                        <button className={style.payButton} onClick={() => handlePayment(b.id)}>
                          💳 Thanh toán
                        </button>
                        {getExpiryInfo(b)}
                      </div>
                    )}
                    {b.status === "AWAIT" && (
                      <div className={style.awaitContainer}>
                        <p className={style.awaitText}>⏳ Bạn đã thanh toán. Vui lòng đợi đến giờ tư vấn!</p>
                        <button className={style.rescheduleButton} onClick={() => navigate(`/reschedule/${b.id}`)}>
                          🔄 Thay đổi lịch
                        </button>
                      </div>
                    )}
                    {b.status === "PROCESSING" && (
                      <>
                        {meetLink ? (
                          <p>
                            🔗 <a
                              href={meetLink.startsWith("http") ? meetLink : `https://${meetLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={style.link}
                            >
                              Link tư vấn
                            </a>
                          </p>
                        ) : (
                          <p className={style.noLink}>⏳ Chưa có link tư vấn</p>
                        )}
                        <button
                          className={style.completeButton}
                          onClick={() => {
                            if (window.confirm("Bạn có chắc muốn đánh dấu hoàn thành tư vấn?")) {
                              updateBookingStatus(b.id, "FINISHED");
                            }
                          }}
                        >
                          ✅ Hoàn thành tư vấn
                        </button>
                        <button
                          className={style.problemButton}
                          onClick={() => {
                            if (window.confirm("Bạn có muốn thay đổi lịch tư vấn so với hiện tại hay không.")) {
                              updateBookingStatus(b.id, "AWAIT");
                            }
                          }}
                        >
                          ⚠️ Tư vấn có vấn đề
                        </button>
                      </>
                    )}

                    {b.status === "FINISHED" && (
                      reviewedBookings?.[b.id] ? (
                        <p className={style.reviewedText}>✅ Đã đánh giá</p>
                      ) : (
                        <button
                          className={style.feedbackButton}
                          onClick={() => {
                            handleReview(b.id); // Cập nhật trạng thái đánh giá
                            navigate(`/feedback/${b.id}/${expert.id}`);
                          }}
                        >
                          ✩ Đánh giá chuyên gia
                        </button>
                      )
                    )}

                    {b.status === "CANCELLED" && <p className={style.cancelledText}>❌ Lịch hẹn đã bị hủy.</p>}
                    {["PENDING", "PENDING_PAYMENT"].includes(b.status) && (
                      <button className={style.cancelButton} onClick={() => handleCancelBooking(b.id)}>
                        ❌ Hủy lịch
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
  );

}