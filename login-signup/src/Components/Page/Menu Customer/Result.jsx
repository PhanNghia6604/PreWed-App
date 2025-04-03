import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

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

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

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
