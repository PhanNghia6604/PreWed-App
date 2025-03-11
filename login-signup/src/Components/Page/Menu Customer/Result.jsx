import React from "react";
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

  // Chuyển đổi sang tiếng Việt
  const translatedCategories = uniqueCategories.map((category) => categoryMap[category] || category);

  // Xác định class CSS phù hợp
  let resultClass = translatedCategories.length > 0 ? styles.warning : styles.success;
  if (!testResult) resultClass = styles.error;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎯 Kết quả Bài Kiểm Tra</h1>
      <div className={`${styles.message} ${resultClass}`}>
        {testResult ? (
          translatedCategories.length > 0 ? (
            <h2>⚠️ Cần cải thiện các tình trạng sau: {translatedCategories.join(", ")}</h2>
          ) : (
            <h2>🎉 Chúc mừng! Bạn không cần cải thiện tình trạng nào, nhưng bạn vẫn có thể nhờ chuyên gia tư vấn.</h2>
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
