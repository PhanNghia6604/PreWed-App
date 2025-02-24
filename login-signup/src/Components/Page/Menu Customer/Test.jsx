import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const testCategories = [
  { id: "marriage_psychology", name: "Tâm lý hôn nhân" },
  { id: "family_finance", name: "Tài chính gia đình" },
  { id: "marriage_law", name: "Pháp lý hôn nhân" },
  { id: "reproductive_health", name: "Sức khỏe sinh sản" },
  { id: "communication_conflict", name: "Giao tiếp và quản lý xung đột" },
  { id: "family_values", name: "Giá trị gia đình" },
];

const testQuestions = {
  marriage_psychology: [
    { id: 1, text: "Bạn cảm thấy ổn định về mặt tâm lý trong mối quan hệ?" },
    { id: 2, text: "Bạn có thể chia sẻ cảm xúc của mình với đối phương dễ dàng?" },
  ],
  family_finance: [
    { id: 3, text: "Bạn và đối phương có chung quan điểm về tài chính?" },
    { id: 4, text: "Bạn cảm thấy thoải mái với cách quản lý tiền bạc của đối phương?" },
  ],
  marriage_law: [
    { id: 5, text: "Bạn hiểu rõ về quyền lợi và trách nhiệm pháp lý trong hôn nhân?" },
    { id: 6, text: "Bạn và đối phương đã bàn luận về các vấn đề pháp lý liên quan?" },
  ],
  reproductive_health: [
    { id: 7, text: "Bạn có quan tâm đến sức khỏe sinh sản của bản thân và đối phương?" },
    { id: 8, text: "Bạn có hiểu biết về kế hoạch hóa gia đình?" },
  ],
  communication_conflict: [
    { id: 9, text: "Bạn cảm thấy hài lòng với cách giao tiếp của hai người?" },
    { id: 10, text: "Bạn và đối phương giải quyết xung đột hiệu quả?" },
  ],
  family_values: [
    { id: 11, text: "Bạn và đối phương có chung quan điểm về các giá trị gia đình?" },
    { id: 12, text: "Bạn cảm thấy hài lòng với cách đối phương đối xử với gia đình bạn?" },
  ],
};

const responseLevels = ["Không ổn", "Bình thường", "Rất ổn"];

const Test = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setResponses({});
  };

  const handleResponseChange = (questionId, response) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleCompletion = () => {
    console.log("User Responses:", responses);
    navigate("/result");
  };

  return (
    <div className={styles.container}>
      {!selectedCategory ? (
        <>
          <h1 className={styles.title}>Chọn chủ đề kiểm tra</h1>
          <div className={styles.categoryList}>
            {testCategories.map((cat) => (
              <button
                key={cat.id}
                className={styles.categoryBtn}
                onClick={() => handleCategorySelection(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className={styles.title}>{testCategories.find((c) => c.id === selectedCategory).name}</h1>
          <div className={styles.testSection}>
            {testQuestions[selectedCategory].map((q) => (
              <div key={q.id} className={styles.questionBox}>
                <p className={styles.questionText}>{q.text}</p>
                <div className={styles.options}>
                  {responseLevels.map((level) => (
                    <label key={level} className={styles.option}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={level}
                        onChange={() => handleResponseChange(q.id, level)}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button className={styles.submitBtn} onClick={handleCompletion}>
              Kết thúc kiểm tra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Test;
