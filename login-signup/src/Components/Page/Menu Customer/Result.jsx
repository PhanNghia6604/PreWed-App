import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const status = location.state?.status || "Tình trạng của bạn có vẻ không ổn. Chúng tôi khuyến khích bạn nên chọn chuyên gia tư vấn về vấn đề của mình !"; 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kết quả </h1>
      <div className={styles.resultBox}>
        <h2>{status}</h2>
      </div>
      <button className={styles.expertBtn} onClick={() => navigate("/expert")}>
        Chọn chuyên gia tư vấn
      </button>
    </div>
  );
};

export default Result;
