import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const questions = {
  finance: [
    { id: 1, text: "Do you keep track of your monthly expenses?" },
    { id: 2, text: "Do you have an emergency fund?" },
  ],
  parenting: [
    { id: 1, text: "Do you set clear rules for your children?" },
    { id: 2, text: "Do you encourage open communication with your child?" },
  ],
  communication: [
    { id: 1, text: "Do you feel comfortable expressing your feelings?" },
    { id: 2, text: "Do you listen actively when someone is speaking?" },
  ],
};

export const Test = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setAnswers({});
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("User Answers:", answers);
    navigate("/result"); // Chuyển hướng đến trang kết quả
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select a Test Category</h1>
      <div className={styles.categories}>
        {["finance", "parenting", "communication"].map((category) => (
          <button
            key={category}
            className={`${styles.category} ${
              selectedCategory === category ? styles.active : ""
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className={styles.testSection}>
          <h2 className={styles.sectionTitle}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Test
          </h2>
          {questions[selectedCategory].map((q) => (
            <div key={q.id} className={styles.questionBox}>
              <p className={styles.questionText}>{q.text}</p>
              <div className={styles.options}>
                <label className={styles.option}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="Yes"
                    onChange={() => handleAnswerChange(q.id, "Yes")}
                  />
                  Yes
                </label>
                <label className={styles.option}>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value="No"
                    onChange={() => handleAnswerChange(q.id, "No")}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Submit Test
          </button>
        </div>
      )}
    </div>
  );
};
