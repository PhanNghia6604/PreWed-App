import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ExpertContext } from "./ExpertContext";
import expertDescriptions from "../Consultant/ExpertDescription";
import { useNavigate } from "react-router-dom";

import styles from "./ExpertDetail.module.css";

const getRandomExperience = () => Math.floor(Math.random() * 10) + 1;

const ExpertDetail = () => {
  const { name } = useParams();
  
  const [experts, setExperts] = useState([]);
  const [experience, setExperience] = useState(null);
  const [servicePackages, setServicePackages] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const [reviewsPerPage] = useState(3); // Số lượng đánh giá hiển thị trên mỗi trang

 
  const [reviews, setReviews] = useState([]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


const nextPage = () => {
  if (currentPage < Math.ceil(reviews.length / reviewsPerPage)) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};
const indexOfLastReview = currentPage * reviewsPerPage;
const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/expert"); // Đường dẫn tới trang danh sách chuyên gia
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const expert = experts.find((e) => e.name === decodeURIComponent(name));
        if (!expert) return;
  
        // Gọi API để lấy tất cả feedback
        const response = await fetch(`/api/feedback`, {
          method: "GET",
          headers: {
            // "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error("Không thể lấy bình luận");
  
        const data = await response.json();
        console.log("📌 Bình luận chuyên gia:", data);
  
        // Lọc feedback chỉ lấy những feedback có expert.id trùng với ID của chuyên gia hiện tại
        const filteredReviews = data.filter((review) => review.expert.id === expert.id);
        setReviews(filteredReviews);
      } catch (error) {
        console.error("❌ Lỗi khi tải bình luận:", error);
      }
    };
  
    fetchReviews();
  }, [experts, name]);
  


  
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch("/api/get");
        if (!response.ok) throw new Error("Lỗi khi tải danh sách chuyên gia");
        
        const data = await response.json();
        console.log("📌 Dữ liệu chuyên gia từ API:", data);
  
        // Lọc chỉ lấy các chuyên gia có roleEnum là "EXPERT"
        const expertList = data.filter((user) => user.roleEnum === "EXPERT");
        setExperts(expertList);
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách chuyên gia:", error);
      }
    };
  
    fetchExperts();
  }, []);
  useEffect(() => {
    const expert = experts.find((e) => e.name === decodeURIComponent(name));
    if (expert) {
      // Tạo key duy nhất cho từng chuyên gia
      const experienceKey = `experience_${expert.id}`;
      const storedExperience = localStorage.getItem(experienceKey);
  
      if (storedExperience) {
        setExperience(parseInt(storedExperience, 10)); // Lấy từ localStorage
      } else {
        const newExperience = getRandomExperience();
        localStorage.setItem(experienceKey, newExperience); // Lưu vào localStorage
        setExperience(newExperience);
      }
    }
  }, [experts, name]);
  
  
  const fetchServicePackages = async () => {
    const token = localStorage.getItem("token"); 
    try {
      const response = await fetch("/api/servicepackage",   {
        method: "Get",
        headers:{
          "Authorization": `Bearer ${token}`, // Gửi token trong headers
        }
      });
      
      if (!response.ok) throw new Error("Lỗi khi tải gói tư vấn");
      const data = await response.json();
      setServicePackages(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

 const fetchAvailableSlots = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/slots", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        console.log("📌 API Response:", response);

        if (!response.ok) {
            // Thử lấy phản hồi dạng text vì không phải JSON
            const errorText = await response.text();
            console.log("📨 Phản hồi từ server (raw text):", errorText);

            if (errorText.includes("Selected staff is not available for the chosen slot")) {
                throw new Error("Slot này đã có người đặt, vui lòng chọn slot khác!");
            } else {
                throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
            }
        }

        const data = await response.json();
        console.log("📌 Lịch trống nhận được:", data);

        if (data.length === 0) {
            throw new Error("Không có lịch trống nào!");
        }

        setAvailableSlots(data);
    } catch (error) {
        console.error("❌ Lỗi khi tải lịch trống:", error);
        alert(error.message); // Hiển thị lỗi trên giao diện
    }
};




  
  

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    const expert = experts.find((e) => e.name === decodeURIComponent(name));
    if (expert) {
      fetchAvailableSlots(expert.id, pkg.id); // Gọi API slots với chuyên gia & gói dịch vụ
    }
  };
  const getUserBookings = async () => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.error("Không tìm thấy userId!");
            return [];
        }

        const response = await fetch("/api/booking", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Không thể lấy lịch đặt của người dùng.");
        }

        return await response.json(); // Trả về toàn bộ lịch đặt
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lịch đặt:", error);
        return [];
    }
};

  
  
const handleBooking = async () => {
  if (!selectedSlot) {
      alert("Vui lòng chọn một khung giờ trước khi đặt lịch!");
      return;
  }

  const expert = experts.find((e) => e.name === decodeURIComponent(name));
  if (!expert) {
      alert("Không tìm thấy chuyên gia!");
      return;
  }

  const today = new Date().toISOString().split("T")[0];
  const slotStartTime = new Date(today + "T" + selectedSlot.startTime);
  const slotEndTime = new Date(today + "T" + selectedSlot.endTime);

  // 📌 1. Lấy toàn bộ lịch đặt của user
  const userBookings = await getUserBookings();

  // 📌 2. Kiểm tra trùng lịch
  let conflictWithSameExpert = false;
  let conflictWithOtherExpert = null;
  const isTimeOverlap = (start1, end1, start2, end2) => {
    return (
        (start1 >= start2 && start1 < end2) || // Bắt đầu trong khoảng đã đặt
        (end1 > start2 && end1 <= end2) || // Kết thúc trong khoảng đã đặt
        (start1 <= start2 && end1 >= end2) // Trùng hoàn toàn khoảng thời gian
    );
};

userBookings.forEach((booking) => {
    const bookedStartTime = new Date(booking.slotStartTime).getTime();
    const bookedEndTime = new Date(booking.slotEndTime).getTime();

    if (isTimeOverlap(slotStartTime.getTime(), slotEndTime.getTime(), bookedStartTime, bookedEndTime)) {
        if (booking.expertId === expert.id) {
            conflictWithSameExpert = true;
        } else {
            conflictWithOtherExpert = booking.expertName;
        }
    }
  });

  // 📌 3. Hiển thị thông báo phù hợp
  if (conflictWithSameExpert) {
      alert("Bạn đã có lịch hẹn với chuyên gia này trong khoảng thời gian này!");
      return;
  }

  if (conflictWithOtherExpert) {
      alert(`Bạn đã đặt lịch vào khung giờ này với chuyên gia ${conflictWithOtherExpert}!`);
      return;
  }

  // 📌 4. Nếu không trùng, tiếp tục gửi request đặt lịch
  const bookingData = {
      expertId: expert.id,
      slotId: selectedSlot.id,
      bookingDate: today,
      serviceIds: selectedPackage?.id ? [selectedPackage.id] : [],
  };

  try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/booking", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
      });

      const responseText = await response.text();
      console.log("Server Response:", responseText); // Debug API trả về gì
      
      let data;
try {
    data = await response.json(); 
} catch (e) {
    data = { message: responseText }; // Nếu không parse được, giữ nguyên text
}


      if (response.ok) {
        navigate("/my-booking");
        alert("Đặt lịch thành công!");
    } else {
        console.error("Lỗi từ API:", data);
        
        if (data.message.includes("not available")) {
            alert("Bạn đã có 1 lịch hẹn với chuyên gia khác rồi, vui lòng đặt lại khung giờ khác giúp chúng tôi!");
        } else {
            alert(`Lỗi: ${data.message || "Không thể đặt lịch!"}`);
        }
    }
    
    
  } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đặt lịch:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại!");
  }
};
  
  
  
  

  
  
  
  

  if (!experts || experts.length === 0) {
    return <p>Đang tải dữ liệu chuyên gia...</p>;
  }

  const expert = experts.find((e) => e.name === decodeURIComponent(name));
  if (!expert) {
    return <p>Không tìm thấy chuyên gia!</p>;
  }
  console.log("Danh sách gói trước khi đặt lịch:", servicePackages);

  
  return (
    <div className={styles.container}>


      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          <img
            src={expert.avatar || "/images/experts/default-avatar.png"}
            alt={expert.name}
            className={styles.avatar}
            onError={(e) => (e.target.src = "/images/experts/default-avatar.png")}
          />
        </div>
        <h2>{expert.name}</h2>
        <p><strong>Kinh nghiệm:</strong> {experience !== null ? `${experience} năm` : "Đang cập nhật..."}</p>
        <p><strong>Chuyên môn:</strong> {expert.specialty}</p>
        {/* <p><strong>Đánh giá:</strong> ⭐ {rating !== null ? rating : "Chưa có đánh giá"} / 5</p> */}
        {expert.specialty && (
          <p className={styles.description}>
            <strong>Mô tả chuyên môn:</strong> {expertDescriptions[expert.specialty] || "Chưa có mô tả"}
          </p>
        )}
        {expert.certificates && expert.certificates.length > 0 && (
          <div className={styles.certifications}>
            <h3>Chứng chỉ:</h3>
            <ul>
              {expert.certificates.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
       <div className={styles.buttonContainer}>
  <button className={styles.bookButton} onClick={handleGoBack}>
  ← Quay lại danh sách chuyên gia
  </button>
  <button className={styles.backButton} onClick={fetchServicePackages}>
    Đặt lịch hẹn
  </button>
</div>

      </div>


      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Chọn gói tư vấn</h3>
            <ul>
              {servicePackages.map((pkg) => (
                <li key={pkg.id} className={styles.packageItem}>
                  <p><strong>{pkg.name}</strong></p>
                  <p>{pkg.description}</p>
                  <p>⏳ {pkg.duration} phút - 💰 {pkg.price.toLocaleString()} VND</p>
                  <button disabled={!pkg.available} onClick={() => handleSelectPackage(pkg)}>
                    {pkg.available ? "Chọn" : "Hết chỗ"}
                  </button>
                </li>
              ))}
            </ul>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>Đóng</button>
          </div>
        </div>
      )}

{selectedPackage && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>Chọn giờ tư vấn</h3>
      <ul className={styles.slotContainer}>
  {availableSlots.length === 0 ? (
    <p>Không có lịch trống</p>
  ) : (
    availableSlots.map((slot) => {
      // Lấy thời gian hiện tại
      const now = new Date();
      
      // Tạo đối tượng Date với thời gian của slot
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const slotTime = new Date(`${today}T${slot.startTime}`);

      // Kiểm tra xem slot đã qua hay chưa
      const isPast = slotTime < now;

      return (
        <li
          key={slot.id}
          className={`${styles.slotItem} ${selectedSlot?.id === slot.id ? styles.selectedSlot : ""}`}
        >
          <button 
            onClick={() => !isPast && setSelectedSlot(slot)} 
            disabled={isPast} // Disable nếu slot đã qua
          >
            Giờ bắt đầu: {slot.startTime.split(":").slice(0, 2).join(":")} - 
            Giờ kết thúc: {slot.endTime.split(":").slice(0, 2).join(":")}
            {selectedSlot?.id === slot.id ? " ✅" : ""}
            {isPast ? " (Hết hạn)" : ""}
          </button>
        </li>
      );
    })
  )}
</ul>

      <button className={styles.confirmButton} onClick={handleBooking} disabled={isBooking}>
        {isBooking ? "Đang đặt..." : "Xác nhận đặt lịch"}
      </button>
      <p>{message}</p>
      <button className={styles.closeButton} onClick={() => setSelectedPackage(null)}>Quay lại</button>
    </div>
    
  </div>
)}
<div className={styles.reviewsSection}>
  <h3>Đánh giá từ khách hàng</h3>
  {reviews.length > 0 ? (
    <ul className={styles.reviewsList}>
     {currentReviews.map((review, index) => (
  <li key={index} className={styles.reviewItem}>
    <p><strong>{review.user.name}</strong> - ⭐ {review.rating}</p>
    <p>{review.comments}</p>
    <p><small>{review.date ? new Date(review.date).toLocaleDateString() : "Ngày không xác định"}</small></p>
  </li>
))}
    </ul>
  ) : (
    <p>Chưa có đánh giá nào.</p>
  )}
   <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            Trang trước
          </button>
          <span>Trang {currentPage}</span>
          <button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
          >
            Trang sau
          </button>
        </div>
</div>


    </div>
  );
};

export default ExpertDetail;