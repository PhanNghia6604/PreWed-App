import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const testQuestions = [
  { id: 1, text: "Bạn cảm thấy ổn định về mặt tâm lý trong mối quan hệ?" },
  { id: 2, text: "Bạn có thể chia sẻ cảm xúc của mình với đối phương dễ dàng?" },
  { id: 3, text: "Bạn và đối phương có chung quan điểm về tài chính?" },
  { id: 4, text: "Bạn cảm thấy thoải mái với cách quản lý tiền bạc của đối phương?" },
  { id: 5, text: "Bạn hiểu rõ về quyền lợi và trách nhiệm pháp lý trong hôn nhân?" },
  { id: 6, text: "Bạn và đối phương đã bàn luận về các vấn đề pháp lý liên quan?" },
  { id: 7, text: "Bạn có quan tâm đến sức khỏe sinh sản của bản thân và đối phương?" },
  { id: 8, text: "Bạn có hiểu biết về kế hoạch hóa gia đình?" },
  { id: 9, text: "Bạn cảm thấy hài lòng với cách giao tiếp của hai người?" },
  { id: 10, text: "Bạn và đối phương giải quyết xung đột hiệu quả?" }
];

const responseLevels = ["Không ổn", "Bình thường", "Rất ổn"];

const Test = () => {
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();

  const handleResponseChange = (questionId, response) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleCompletion = () => {
    console.log("User Responses:", responses);
    navigate("/result");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bài kiểm tra tư vấn tiền hôn nhân</h1>
      <div className={styles.testSection}>
        {testQuestions.map((q) => (
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
    </div>
  );
};

export default Test;