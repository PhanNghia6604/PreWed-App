import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ExpertContext } from "./ExpertContext";
import expertDescriptions from "../Consultant/ExpertDescription"; // Import dữ liệu mô tả chuyên môn
import styles from "./ExpertDetail.module.css";

const ExpertDetail = () => {
  const { name } = useParams();
  const { experts } = useContext(ExpertContext);

  if (!experts || experts.length === 0) {
    return <p>Đang tải dữ liệu chuyên gia...</p>;
  }

  const expert = experts.find((e) => e.name === decodeURIComponent(name));

  if (!expert) {
    return <p>Không tìm thấy chuyên gia!</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Avatar chuyên gia */}
        <div className={styles.avatarContainer}>
  <img
    src={expert.avatar || "/images/experts/default-avatar.png"}
    alt={expert.name}
    className={styles.avatar}
    onError={(e) => (e.target.src = "/images/experts/default-avatar.png")}
  />
</div>


        {/* Thông tin chính */}
        <h2>{expert.name}</h2>
        <p><strong>Chuyên môn:</strong> {expert.specialty}</p>
        <p><strong>Kinh nghiệm:</strong> {expert.experience} năm</p>
        <p><strong>Đánh giá:</strong> ⭐ {expert.rating} / 5</p>

        {/* Mô tả theo chuyên môn */}
        {expert.specialty && (
          <p className={styles.description}>
            <strong>Mô tả chuyên môn:</strong> {expertDescriptions[expert.specialty] || "Chưa có mô tả"}
          </p>
        )}

        {/* Danh sách chứng chỉ */}
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

        {/* Gói tư vấn */}
        {expert.packages && expert.packages.length > 0 && (
          <div className={styles.consultingPackages}>
            <h3>Gói tư vấn:</h3>
            <ul>
              {expert.packages.map((pkg, index) => (
                <li key={index}>{pkg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Nút đặt lịch */}
        <button className={styles.bookButton}>Đặt lịch hẹn</button>
      </div>
    </div>
  );
};

export default ExpertDetail;
