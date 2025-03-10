import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const testQuestions = [
  // Tâm lý
  { id: 1, text: "Bạn cảm thấy ổn định về mặt tâm lý trong mối quan hệ không?" },
  { id: 2, text: "Bạn có thể chia sẻ cảm xúc của mình với đối phương dễ dàng không?" },
  // Tài chính
  { id: 3, text: "Bạn và đối phương có chung quan điểm về việc quản lý tài chính không?" },
  { id: 4, text: "Bạn cảm thấy thoải mái với cách quản lý tài chính trong gia đình tương lai không?" },
  // Gia đình
  { id: 5, text: "Bạn có thể giao tiếp một cách hiệu quả với gia đình của đối phương không?" },
  { id: 6, text: "Bạn có cảm thấy quan điểm về gia đình của mình và đối phương không phù hợp trong một số tình huống?" },
  // Sức khỏe
  { id: 7, text: "Bạn và đối phương có thói quen chăm sóc sức khỏe giống nhau không?" },
  { id: 8, text: "Bạn có tin rằng việc chăm sóc sức khỏe chung sẽ giúp duy trì một mối quan hệ lâu dài?" },
  // Giao tiếp
  { id: 9, text: "Bạn cảm thấy dễ dàng trong việc giao tiếp về các vấn đề quan trọng trong mối quan hệ?" },
  { id: 10, text: "Bạn có thể thảo luận về các chủ đề nhạy cảm mà không cảm thấy lo lắng?" },
  // Tôn giáo
  { id: 11, text: "Bạn và đối phương có chia sẻ cùng một tôn giáo không?" },
  { id: 12, text: "Bạn có sẵn sàng chấp nhận các khác biệt tôn giáo trong mối quan hệ không?" }
];

const responseLevels = ["Không ổn", "Rất ổn"];
const questionsPerPage = 4;

const Test = () => {
  const [responses, setResponses] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);

  const handleResponseChange = (questionId, response) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCompletion = () => {
    console.log("User Responses:", responses);
    navigate("/result");
  };

  const startIndex = currentPage * questionsPerPage;
  const displayedQuestions = testQuestions.slice(startIndex, startIndex + questionsPerPage);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bài kiểm tra tư vấn tiền hôn nhân</h1>
      <div className={styles.testSection}>
        {displayedQuestions.map((q) => (
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
        <div className={styles.navigationButtons}>
          {currentPage > 0 && (
            <button className={styles.navBtn} onClick={handlePrevPage}>
              Quay lại
            </button>
          )}
          {currentPage < totalPages - 1 ? (
            <button className={styles.navBtn} onClick={handleNextPage}>
              Tiếp theo
            </button>
          ) : (
            <button className={styles.submitBtn} onClick={handleCompletion}>
              Kết thúc kiểm tra
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
