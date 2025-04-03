import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

const testQuestions = [
  { id: 1, text: "Khi đối diện với thử thách trong cuộc sống, bạn sẽ làm gì?", category: "Tâm lý", options: ["A. Tôi thường tìm cách giải quyết vấn đề một cách nhanh chóng và hiệu quả, bất kể khó khăn.", "B. Tôi sẽ tự hỏi bản thân và người thân xem liệu tôi có thể tìm giải pháp hợp lý hơn không.", "C. Tôi sẽ cố gắng tránh các tình huống khó khăn và tìm cách bảo vệ bản thân khỏi căng thẳng."] },
  { id: 2, text: "Khi cảm thấy lo lắng về một điều gì đó, bạn thường phản ứng như thế nào?", category: "Tâm lý", options: ["A. Tôi giải quyết ngay bằng cách tìm hiểu, phân tích vấn đề và lên kế hoạch hành động.", "B. Tôi chia sẻ với đối tác hoặc bạn bè để nhận lời khuyên, nhưng cũng cần thời gian để suy nghĩ riêng.", "C. Tôi cảm thấy khó khăn khi bày tỏ cảm xúc và thường tự mình giải quyết mọi thứ."] },
  { id: 3, text: "Bạn nghĩ sao về việc lập ngân sách tài chính cho gia đình?", category: "Tài chính", options: ["A. Ngân sách tài chính là yếu tố quan trọng trong việc duy trì cuộc sống ổn định, và tôi sẽ cùng đối tác lập kế hoạch chi tiêu cẩn thận.", "B. Tôi nghĩ chúng ta có thể lập ngân sách, nhưng đôi khi cần linh hoạt để đối phó với những tình huống phát sinh.", "C. Tôi nghĩ mỗi người nên tự chịu trách nhiệm về tài chính của mình và không cần quá nhiều kế hoạch chung."] },
  { id: 4, text: "Khi có sự khác biệt về cách chi tiêu giữa bạn và đối tác, bạn sẽ giải quyết như thế nào?", category: "Tài chính", options: ["A. Tôi sẽ thảo luận để hiểu rõ lý do của cả hai bên và tìm ra giải pháp hợp lý.", "B. Tôi sẽ giải thích quan điểm của mình và tìm một phương án hòa hợp, nhưng tôi vẫn tôn trọng lựa chọn của đối tác.", "C. Tôi thường sẽ nhượng bộ hoặc để đối tác quyết định, miễn là vấn đề không quá lớn."] },
  { id: 5, text: "Bạn nghĩ sao về việc có con ngay sau khi kết hôn?", category: "Gia đình", options: ["A. Tôi muốn có con ngay khi kết hôn, vì tôi nghĩ đó là một phần quan trọng trong việc xây dựng gia đình.", "B. Tôi nghĩ chúng ta nên ổn định về tài chính và sự nghiệp trước khi quyết định có con.", "C. Tôi không chắc chắn về việc có con ngay sau khi kết hôn, vì tôi còn nhiều thứ cần hoàn thiện trong cuộc sống cá nhân."] },
  { id: 6, text: "Bạn nghĩ gì về việc sống gần gia đình hai bên sau khi kết hôn?", category: "Gia đình", options: ["A. Tôi nghĩ việc sống gần gia đình hai bên sẽ giúp chúng ta duy trì mối quan hệ tốt đẹp và hỗ trợ nhau.", "B. Tôi nghĩ chúng ta nên sống gần gia đình, nhưng cần có không gian riêng để duy trì sự độc lập.", "C. Tôi muốn tạo dựng một không gian riêng biệt và không sống gần gia đình hai bên, để tránh những xung đột không đáng có."] },
  { id: 7, text: "Bạn có thói quen duy trì lối sống lành mạnh không?", category: "Sức khỏe", options: ["A. Tôi tập thể dục đều đặn và luôn quan tâm đến chế độ ăn uống và giấc ngủ để duy trì sức khỏe.", "B. Tôi cố gắng duy trì một thói quen lành mạnh nhưng đôi khi công việc hoặc cuộc sống bận rộn khiến tôi thiếu thời gian.", "C. Tôi ít quan tâm đến việc duy trì sức khỏe và thường chỉ tập thể dục khi có thời gian rảnh."] },
  { id: 8, text: "Bạn nghĩ sao về việc chăm sóc sức khỏe tâm lý trong mối quan hệ?", category: "Sức khỏe", options: ["A. Tôi cho rằng chăm sóc sức khỏe tâm lý rất quan trọng trong mối quan hệ, giúp cả hai hiểu và hỗ trợ nhau tốt hơn.", "B. Tôi nghĩ chăm sóc sức khỏe tâm lý là quan trọng nhưng không phải lúc nào cũng cần thiết, tùy thuộc vào tình huống.", "C. Tôi không nghĩ việc chăm sóc sức khỏe tâm lý là điều quan trọng trong mối quan hệ của chúng ta."] },
  { id: 9, text: "Khi bạn và đối tác có mâu thuẫn, bạn sẽ làm gì?", category: "Giao tiếp", options: ["A. Tôi sẽ giải quyết ngay lập tức và cố gắng hiểu quan điểm của đối phương.", "B. Tôi sẽ bình tĩnh lắng nghe và để đối tác chia sẻ, sau đó chúng tôi sẽ thảo luận để tìm cách giải quyết.", "C. Tôi thường tránh nói về mâu thuẫn và đợi mọi thứ tự ổn định."] },
  { id: 10, text: "Bạn cảm thấy thế nào khi nói về những vấn đề khó khăn trong mối quan hệ?", category: "Giao tiếp", options: ["A. Tôi cảm thấy thoải mái khi nói về vấn đề khó khăn vì tôi tin rằng giao tiếp là cách giải quyết tốt nhất.", "B. Tôi sẽ chia sẻ khi cảm thấy cần thiết và khi tôi và đối tác có thể cùng tìm ra giải pháp.", "C. Tôi cảm thấy khó khăn khi phải mở lòng và chia sẻ về những vấn đề phức tạp."] },
  { id: 11, text: "Bạn và đối phương có chia sẻ cùng một tôn giáo không?", category: "Tôn giáo", options: ["A. Tôi nghĩ việc tham gia các hoạt động tôn giáo cùng nhau sẽ tăng cường mối quan hệ và mang lại sự gắn kết sâu sắc hơn.", "B. Tôi nghĩ đôi khi tham gia cùng nhau là tốt, nhưng chúng tôi cũng cần tôn trọng các quan điểm cá nhân của nhau.", "C. Tôi không nghĩ rằng tham gia các hoạt động tôn giáo là cần thiết trong mối quan hệ của chúng tôi."] },
  { id: 12, text: "Bạn có sẵn sàng chấp nhận các khác biệt tôn giáo trong mối quan hệ không?", category: "Tôn giáo", options: ["A. Tôi không có vấn đề gì với việc đối tác có tôn giáo khác, miễn là chúng tôi tôn trọng sự khác biệt.", "B. Tôi có thể tìm cách thỏa hiệp nếu có sự khác biệt về tôn giáo.", "C. Tôi cảm thấy khó khăn khi đối tác có tôn giáo khác."] }
];

const responseLevels = ["A", "B", "C"];
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
      
      // Xác định score cho từng câu trả lời (giả sử là: A = 3, B = 2, C = 1)
      let score = 0;
      if (answerText.startsWith('A')) {
        score = 3;
      } else if (answerText.startsWith('B')) {
        score = 2;
      } else if (answerText.startsWith('C')) {
        score = 1;
      }
    
      return {
        userId: user.id,
        questionId: Number(questionId),
        score,  // Thay vì answerText, bạn gửi score
        category: question?.category || "UNKNOWN"
      };
    });
    const requestBody = { userId: user.userId, answers };

    console.log("📩 Dữ liệu gửi lên API:", JSON.stringify(requestBody, null, 2));
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
            <div className={styles.questionBox}>
              {/* Câu hỏi in đậm */}
              <p className={styles.questionText}><strong>{q.text}</strong></p>
              <div className={styles.options}>
                {/* Các câu trả lời */}
                {q.options.map((level, i) => (
                  <label key={i} className={styles.option}>
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