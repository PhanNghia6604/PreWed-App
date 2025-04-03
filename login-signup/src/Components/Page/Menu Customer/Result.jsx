import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

// Hàm chuyển đổi chuyên môn thành dạng viết tắt
const convertToShortForm = (category) => {
  switch (category) {
    case "Tâm Lý":
      return "TAMLY";
    case "Giao tiếp":
      return "GIAOTIEP";
    case "Tài chính":
      return "TAICHINH";
    case "Gia đình":
      return "GIADINH";
    case "Sức khỏe":
      return "SUCKHOE";
    case "Tôn giáo":
      return "TONGIAO";
    // Thêm các chuyên môn khác nếu có
    default:
      return category; // Trả về nguyên gốc nếu không tìm thấy
  }
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testResult = location.state?.testResult;

  // Chắc chắn rằng có dữ liệu trả về
  const categoriesToImprove = testResult?.categoriesToImprove || [];
  const reasons = testResult?.reasons || [];
  const consultations = testResult?.consultations || [];
  const diagnosisResult = testResult?.diagnosisResult || "Không có dữ liệu chẩn đoán";

  // Biến để điều khiển hiệu ứng hiển thị
  const [isVisible, setIsVisible] = useState(false);
  const [recommendedExperts, setRecommendedExperts] = useState([]); // State để lưu chuyên gia gợi ý
  const [allExperts, setAllExperts] = useState([]); // Lưu tất cả các chuyên gia
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);

    // Gọi API lấy tất cả chuyên gia khi có categories cần cải thiện
    if (categoriesToImprove.length > 0) {
      fetchAllExperts(); // Lấy tất cả chuyên gia
    }
  }, [categoriesToImprove]);

  const fetchAllExperts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/expert/all");  // Lấy tất cả chuyên gia
      const data = await response.json();
      if (response.ok) {
        setAllExperts(data);  // Lưu vào state
        filterExperts(data, categoriesToImprove);  // Lọc chuyên gia theo categories
      } else {
        console.error("Error fetching experts:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = (experts, categories) => {
    // Chuyển đổi categoriesToImprove thành dạng viết tắt
    const convertedCategories = categories.map(convertToShortForm);

    // Lọc chuyên gia theo chuyên môn
    const filteredExperts = experts.filter((expert) =>
      expert.specialty.some((category) => convertedCategories.includes(category))  // So sánh sau khi chuyển đổi
    );

    setRecommendedExperts(filteredExperts);  // Lưu kết quả lọc vào state
  };

  const handleViewDetail = (expertId) => {
    navigate(`/expert-profile/${expertId}`); // Navigate đến trang chi tiết của chuyên gia
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.show : ""}`}>
      <h1 className={styles.title}>Kết quả Bài Kiểm Tra</h1>

      <div className={styles.message}>
        {/* Nếu có các chuyên môn cần cải thiện */}
        {categoriesToImprove.length > 0 ? (
          <div className={styles.categories}>
            <h2>Cần cải thiện: {categoriesToImprove.join(", ")}</h2>
          </div>
        ) : (
          <h2>Chúc mừng! Không có vấn đề nào đáng lo.</h2>
        )}

        {/* Hiển thị lý do cần cải thiện */}
        {reasons.length > 0 && (
          <div className={styles.reasons}>
            <h3>Lý do:</h3>
            <p>{reasons.join(" ")}</p>
          </div>
        )}

        {/* Hiển thị tư vấn */}
        {consultations.length > 0 && (
          <div className={styles.consultations}>
            <h3>Tư vấn:</h3>
            <p>{consultations.join(" ")}</p>
          </div>
        )}

        {/* Hiển thị kết quả chẩn đoán */}
        <div className={styles.diagnosisResult}>
          <h3>Kết luận:</h3>
          <p>{diagnosisResult}</p>
        </div>

        {/* Hiển thị chuyên gia gợi ý */}
        <div className={styles.recommendedExperts}>
          <h3>Chuyên gia tư vấn gợi ý:</h3>
          {loading ? (
            <p>Đang tải chuyên gia...</p>
          ) : recommendedExperts.length > 0 ? (
            recommendedExperts.map((expert) => (
              <div key={expert.id} className={styles.expertCard}>
                <img src={expert.avatar} alt={expert.name} className={styles.expertAvatar} />
                <div>
                  <h4>{expert.name}</h4>
                  <p>{expert.specialty.join(", ")}</p>
                  
                </div>
              </div>
            ))
          ) : (
            <p>Không có chuyên gia nào phù hợp với các lĩnh vực cần cải thiện của bạn.</p>
          )}
        </div>
      </div>

      <div className={styles.navigationButtons}>
        <button className={styles.expertBtn} onClick={() => navigate("/expert")}>
          📅 Chọn chuyên gia tư vấn
        </button>
        <button className={styles.historyBtn} onClick={() => navigate("/history-test")}>
          📜 Xem lại lịch sử trắc nghiệm
        </button>
      </div>
    </div>
  );
};

export default Result;
