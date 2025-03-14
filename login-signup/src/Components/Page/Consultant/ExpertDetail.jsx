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
  
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/expert"); // Đường dẫn tới trang danh sách chuyên gia
  };

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
  
  const fetchServicePackages = async () => {
    try {
      const response = await fetch("/api/servicepackage");
      if (!response.ok) throw new Error("Lỗi khi tải gói tư vấn");
      const data = await response.json();
      setServicePackages(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAvailableSlots = async (expertId, serviceId) => {
    try {
      const response = await fetch(`/api/slots?expertId=${expertId}&serviceId=${serviceId}`);
      if (!response.ok) throw new Error("Lỗi khi tải lịch trống");
      const data = await response.json();
      console.log("Dữ liệu slot nhận được:", data); // 🔥 Kiểm tra dữ liệu
      setAvailableSlots(data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    const expert = experts.find((e) => e.name === decodeURIComponent(name));
    if (expert) {
      fetchAvailableSlots(expert.id, pkg.id); // Gọi API slots với chuyên gia & gói dịch vụ
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
  
    console.log("🔍 Kiểm tra dữ liệu trước khi gửi:");
    console.log("Expert ID:", expert.id);
    console.log("Slot ID:", selectedSlot.id);
    console.log("Thời gian:", selectedSlot.startTime, "-", selectedSlot.endTime);
  
    // Nếu ID nào đó bị 0 hoặc undefined, báo lỗi sớm
    if (!expert.id || !selectedSlot.id) {
      console.error("❌ Lỗi: expertId hoặc slotId không hợp lệ!");
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      return;
    }
  
    const bookingData = {
      expertId: expert.id,
      slotId: selectedSlot.id,
      bookingDate: new Date().toISOString().split("T")[0], // Lấy ngày hôm nay
      serviceIds: [selectedPackage?.id || 0], // Đảm bảo serviceId hợp lệ
    };
  
    console.log("📦 Payload gửi lên API:", bookingData);
  
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
  
      const data = await response.json();
      console.log("📨 Phản hồi từ server:", data);
  
      if (response.ok) {
        alert("Đặt lịch thành công!");
      } else {
        alert(`Lỗi: ${data.message || "Không thể đặt lịch"}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi yêu cầu đặt lịch:", error);
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
        <p><strong>Kinh nghiệm:</strong> {experience} năm</p>
        <p><strong>Chuyên môn:</strong> {expert.specialty}</p>
        <p><strong>Đánh giá:</strong> ⭐ {expert.rating} / 5</p>
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
        <button className={styles.bookButton} onClick={fetchServicePackages}>
          Đặt lịch hẹn
        </button>
        <button className={styles.backButton} onClick={handleGoBack}>
          ← Quay lại danh sách chuyên gia
        </button>

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
    availableSlots.map((slot) => (
      <li
        key={slot.id}
        className={`${styles.slotItem} ${
          selectedSlot?.id === slot.id ? styles.selectedSlot : ""
        }`}
      >
        <button onClick={() => setSelectedSlot(slot)}>
          {slot.startTime} - {slot.endTime} {selectedSlot?.id === slot.id ? "✅" : ""}
        </button>
      </li>
    ))
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


    </div>
  );
};

export default ExpertDetail;