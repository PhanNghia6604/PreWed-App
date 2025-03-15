import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

const categoryMap = {
  TAMLY: "Tâm lý",
  TAICHINH: "Tài chính",
  GIADINH: "Gia đình",
  SUCKHOE: "Sức khỏe",
  GIAOTIEP: "Giao tiếp",
  TONGIAO: "Tôn giáo",
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testResult = location.state?.testResult;
  const uniqueCategories = [...new Set(testResult?.categoriesToImprove || [])];

  const translatedCategories = uniqueCategories.map((category) => categoryMap[category] || category);
  let resultClass = translatedCategories.length > 0 ? styles.warning : styles.success;
  if (!testResult) resultClass = styles.error;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  return (
    <div className={`${styles.container} ${isVisible ? styles.show : ""}`}>
      <h1 className={styles.title}> Kết quả Bài Kiểm Tra</h1>
      <div className={`${styles.message} ${resultClass}`}>
        {testResult ? (
          translatedCategories.length > 0 ? (
            <h2> Cần cải thiện: {translatedCategories.join(", ")}</h2>
          ) : (
            <h2> Chúc mừng! Không có vấn đề nào đáng lo.</h2>
          )
        ) : (
          <h2> Không có dữ liệu bài kiểm tra.</h2>
        )}
      </div>
      <button className={styles.expertBtn} onClick={() => navigate("/expert")}>
        📅 Chọn chuyên gia tư vấn
      </button>
      <button className={styles.historyBtn} onClick={() => navigate("/history-test")}>
        📜 Xem lại lịch sử trắc nghiệm
      </button>
    </div>
  );
};

export default Result;
