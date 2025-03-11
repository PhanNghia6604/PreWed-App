import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testResult = location.state?.testResult;
  const uniqueCategories = [...new Set(testResult?.categoriesToImprove || [])];

  // Xác định class CSS phù hợp
  let resultClass = uniqueCategories.length > 0 ? styles.warning : styles.success;
  if (!testResult) resultClass = styles.error;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎯 Kết quả Bài Kiểm Tra</h1>
      <div className={`${styles.message} ${resultClass}`}>
        {testResult ? (
          uniqueCategories.length > 0 ? (
            <h2>⚠️ Cần cải thiện các chuyên môn: {uniqueCategories.join(", ")}</h2>
          ) : (
            <h2>🎉 Chúc mừng! Bạn không cần cải thiện chuyên môn nào.</h2>
          )
        ) : (
          <h2>❌ Không có dữ liệu bài kiểm tra.</h2>
        )}
      </div>
      <button className={styles.expertBtn} onClick={() => navigate("/expert")}>
        📅 Chọn chuyên gia tư vấn
      </button>
    </div>
  );
};

export default Result;
