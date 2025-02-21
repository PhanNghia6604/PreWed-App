import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const questions = [
  { id: 1, text: "How well do you and your partner discuss financial matters?" },
  { id: 2, text: "How comfortable are you with your partner's spending habits?" },
  { id: 3, text: "Do you and your partner align on future family planning?" },
  { id: 4, text: "How well do you handle conflicts with your partner?" },
  { id: 5, text: "Are you both clear about each other's life goals?" },
  { id: 6, text: "How satisfied are you with your partner's communication style?" },
  { id: 7, text: "Do you trust your partner with major life decisions?" },
  { id: 8, text: "How do you feel about your partner's approach to responsibilities?" },
  { id: 9, text: "Are you and your partner aligned on career expectations?" },
  { id: 10, text: "How confident are you about your emotional compatibility?" },
];

const levels = ["Not Good", "Neutral", "Good", "Very Good"];

export const Test = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("User Answers:", answers);
    navigate("/result"); // Navigate to result page
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pre-Marital Compatibility Test</h1>
      <div className={styles.testSection}>
        {questions.map((q) => (
          <div key={q.id} className={styles.questionBox}>
            <p className={styles.questionText}>{q.text}</p>
            <div className={styles.options}>
              {levels.map((level) => (
                <label key={level} className={styles.option}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={level}
                    onChange={() => handleAnswerChange(q.id, level)}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Submit Test
        </button>
      </div>
    </div>
  );
};
