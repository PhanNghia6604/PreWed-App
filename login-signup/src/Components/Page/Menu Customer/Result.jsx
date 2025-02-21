import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Result.module.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0; 

  const getResultClass = (score) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const getResultMessage = (score) => {
    if (score >= 80) return "🎉 Excellent! You did an amazing job!";
    if (score >= 50) return "😊 Good job! Keep improving!";
    return "💪 Don't give up! Try again!";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Test Result</h1>
      <div className={`${styles.resultBox} ${styles[getResultClass(score)]}`}>
        <h2>{getResultMessage(score)}</h2>
        <p>Your Score: <strong>{score}</strong>/100</p>
      </div>
      <button className={styles.retryBtn} onClick={() => navigate("/")}>
        <i className="fas fa-redo"></i> Try Again
      </button>
    </div>
  );
};

export default Result;
