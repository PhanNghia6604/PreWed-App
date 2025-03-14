import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const testQuestions = [
  { id: 1, text: "Bạn cảm thấy ổn định về mặt tâm lý trong mối quan hệ không?", category: "Tâm lý" },
  { id: 2, text: "Bạn có thể chia sẻ cảm xúc của mình với đối phương dễ dàng không?", category: "Tâm lý" },
  { id: 3, text: "Bạn và đối phương có chung quan điểm về việc quản lý tài chính không?", category: "Tài chính" },
  { id: 4, text: "Bạn cảm thấy thoải mái với cách quản lý tài chính trong gia đình tương lai không?", category: "Tài chính" },
  { id: 5, text: "Bạn có thể giao tiếp một cách hiệu quả với gia đình của đối phương không?", category: "Gia đình" },
  { id: 6, text: "Bạn có cảm thấy quan điểm về gia đình của mình và đối phương không phù hợp trong một số tình huống?", category: "Gia đình" },
  { id: 7, text: "Bạn và đối phương có thói quen chăm sóc sức khỏe giống nhau không?", category: "Sức khỏe" },
  { id: 8, text: "Bạn có tin rằng việc chăm sóc sức khỏe chung sẽ giúp duy trì một mối quan hệ lâu dài?", category: "Sức khỏe" },
  { id: 9, text: "Bạn cảm thấy dễ dàng trong việc giao tiếp về các vấn đề quan trọng trong mối quan hệ?", category: "Giao tiếp" },
  { id: 10, text: "Bạn có thể thảo luận về các chủ đề nhạy cảm mà không cảm thấy lo lắng?", category: "Giao tiếp" },
  { id: 11, text: "Bạn và đối phương có chia sẻ cùng một tôn giáo không?", category: "Tôn giáo" },
  { id: 12, text: "Bạn có sẵn sàng chấp nhận các khác biệt tôn giáo trong mối quan hệ không?", category: "Tôn giáo" }
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

  const handleCompletion = async () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;
    const totalQuestions = testQuestions.length;
    const answeredCount = Object.keys(responses).length;
    if (answeredCount < totalQuestions) {
      alert(`Bạn chưa trả lời hết câu hỏi! (${answeredCount}/${totalQuestions})`);
      return;
    }

    if (!token) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    const answers = Object.entries(responses).map(([questionId, answerText]) => {
      const question = testQuestions.find(q => q.id === Number(questionId));
      return {
        userId: user.id,
        questionId: Number(questionId),
        answerText,
        category: question?.category || "UNKNOWN"
      };
    });
    const requestBody = { userId: user.userId, answers };


console.log("📩 Dữ liệu gửi lên API:", JSON.stringify(requestBody, null, 2));  // Log JSON body
try {
  const response = await fetch("/api/test/submit", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi API ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log("✔ Bài kiểm tra đã gửi thành công:", result);
  alert("Bài kiểm tra đã gửi thành công!");
  navigate("/result", { state: { testResult: result } });

} catch (error) {
  console.error("🚨 Lỗi gửi bài kiểm tra:", error);
  alert("Gửi bài kiểm tra thất bại, vui lòng thử lại!");
}
  };

  const startIndex = currentPage * questionsPerPage;
  const displayedQuestions = testQuestions.slice(startIndex, startIndex + questionsPerPage);
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bài kiểm tra tư vấn tiền hôn nhân</h1>

      <div className={styles.testSection}>
        {displayedQuestions.map((q, index) => (
          <React.Fragment key={q.id}>
            {/* Hiển thị tiêu đề trước mỗi 2 câu hỏi */}
            {index % 2 === 0 && <h2 className={styles.categoryHeader}>{q.category}</h2>}
            <div className={styles.questionBox}>
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
          </React.Fragment>
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
