import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ExpertContext } from "./ExpertContext";
import expertDescriptions from "../Consultant/ExpertDescription";
import { useNavigate } from "react-router-dom";

import styles from "./ExpertDetail.module.css";

const getRandomExperience = () => Math.floor(Math.random() * 10) + 1;

const ExpertDetail = () => {
  const { name } = useParams();
  const { experts } = useContext(ExpertContext);
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
    if (!experts || experts.length === 0) return;
    const expert = experts.find((e) => e.name === decodeURIComponent(name));
    if (!expert) return;

    const storedExperience = localStorage.getItem(`experience_${expert.name}`);
    if (storedExperience) {
      setExperience(parseInt(storedExperience, 10));
    } else {
      const newExperience = expert.experience || getRandomExperience();
      setExperience(newExperience);
      localStorage.setItem(`experience_${expert.name}`, newExperience);
    }
  }, [experts, name]);

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

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch("/api/booking");
      if (!response.ok) throw new Error("Lỗi khi tải lịch trống");
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    fetchAvailableSlots();
  };

  const handleBooking = async () => {
    if (!selectedPackage || !selectedSlot) {
      setMessage("Vui lòng chọn đầy đủ thông tin.");
      return;
    }

    setIsBooking(true);
    try {
      const expert = experts.find((e) => e.name === decodeURIComponent(name));
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          expertId: expert.id,
          serviceIds: [selectedPackage.id],
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Đặt lịch thành công!");
      } else {
        setMessage(result.message || "Đặt lịch thất bại.");
      }
    } catch (error) {
      setMessage("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setIsBooking(false);
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
            <ul>
              {availableSlots.map((slot) => (
                <li key={slot.id}>
                  <button onClick={() => setSelectedSlot(slot)}>
                    {slot.time} {selectedSlot?.id === slot.id ? "✅" : ""}
                  </button>
                </li>
              ))}
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
