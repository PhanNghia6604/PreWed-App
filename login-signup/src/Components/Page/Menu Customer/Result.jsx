import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import styles from "./Result.module.css";
import { Link } from "react-router-dom";


// Hàm chuyển đổi chuyên môn thành dạng viết tắt
const convertToShortForm = (category) => {
  switch (category) {
    case "Tâm Lý":
      return "TAMLY";
    case "Giao tiếp":
      return "GIAOTIEP";
    case "Tài chính":
      return "TAICHINH";
    case "Gia đình":
      return "GIADINH";
    case "Sức khỏe":
      return "SUCKHOE";
    case "Tôn giáo":
      return "TONGIAO";
    // Thêm các chuyên môn khác nếu có
    default:
      return category; // Trả về nguyên gốc nếu không tìm thấy
  }
};

const specialtyMap = {
  TAMLY: "Tâm lý",
  TAICHINH: "Tài chính",
  GIADINH: "Gia đình",
  SUCKHOE: "Sức khỏe",
  GIAOTIEP: "Giao tiếp",
  TONGIAO: "Tôn giáo",
}
;const getSpecialtyDisplay = (specialty) => {
    // Kiểm tra nếu chuyên gia có tất cả các chuyên môn
    if (specialty.length === Object.keys(specialtyMap).length) {
      return ["Chuyên gia toàn diện"];
    } else {
      return specialty.map(code => specialtyMap[code] || code);
    }
  };
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const testResult = location.state?.testResult;

  // Chắc chắn rằng có dữ liệu trả về
  const categoriesToImprove = testResult?.categoriesToImprove || [];
  const reasons = testResult?.reasons || [];
  const consultations = testResult?.consultations || [];
  const diagnosisResult = testResult?.diagnosisResult || "Không có dữ liệu chẩn đoán";

  // Biến để điều khiển hiệu ứng hiển thị
  const [isVisible, setIsVisible] = useState(false);
  const [recommendedExperts, setRecommendedExperts] = useState([]); // State để lưu chuyên gia gợi ý
  const [allExperts, setAllExperts] = useState([]); // Lưu tất cả các chuyên gia
  const [loading, setLoading] = useState(false);
    // Phân trang: Số chuyên gia mỗi trang
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6; // Số chuyên gia hiển thị trên mỗi trang
   
    useEffect(() => {
      // Đảm bảo khi `currentPage` thay đổi, `displayedExperts` cũng thay đổi
      console.log("Chuyển sang trang", currentPage + 1);
    }, [currentPage]); // Chạy lại khi `currentPage` thay đổi
    
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);

    // Gọi API lấy tất cả chuyên gia khi có categories cần cải thiện
    if (categoriesToImprove.length > 0) {
      fetchAllExperts(); // Lấy tất cả chuyên gia
    }
  }, [categoriesToImprove]);

  const fetchAllExperts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/expert/all");  // Lấy tất cả chuyên gia
      const data = await response.json();
      if (response.ok) {
        setAllExperts(data);  // Lưu vào state
        filterExperts(data, categoriesToImprove);  // Lọc chuyên gia theo categories
      } else {
        console.error("Error fetching experts:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = (experts, categories) => {
    // Chuyển đổi categoriesToImprove thành dạng viết tắt
    const convertedCategories = categories.map(convertToShortForm);

    // Lọc chuyên gia theo chuyên môn
    const filteredExperts = experts.filter((expert) =>
      expert.specialty.some((category) => convertedCategories.includes(category))  // So sánh sau khi chuyển đổi
    );

    setRecommendedExperts(filteredExperts);  // Lưu kết quả lọc vào state
  };

  const handleViewDetail = (expertId) => {
    navigate(`/expert-profile/${expertId}`); // Navigate đến trang chi tiết của chuyên gia
  };

   // Xử lý phân trang
   const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Hiển thị chuyên gia cho trang hiện tại
  const displayedExperts = recommendedExperts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className={`${styles.container} ${isVisible ? styles.show : ""}`}>
      <h1 className={styles.title}>Kết quả Bài Kiểm Tra</h1>

      <div className={styles.message}>
        {/* Nếu có các chuyên môn cần cải thiện */}
        {categoriesToImprove.length > 0 ? (
          <div className={styles.categories}>
            <h2>Cần cải thiện: {categoriesToImprove.join(", ")}</h2>
          </div>
        ) : (
          <h2>Chúc mừng! Không có vấn đề nào đáng lo.</h2>
        )}

        {/* Hiển thị lý do cần cải thiện */}
        {reasons.length > 0 && (
          <div className={styles.reasons}>
            <h3>Lý do:</h3>
            <p>{reasons.join(" ")}</p>
          </div>
        )}

        {/* Hiển thị tư vấn */}
        {consultations.length > 0 && (
          <div className={styles.consultations}>
            <h3>Tư vấn:</h3>
            <p>{consultations.join(" ")}</p>
          </div>
        )}

        {/* Hiển thị kết quả chẩn đoán */}
        <div className={styles.diagnosisResult}>
          <h3>Kết luận:</h3>
          <p>{diagnosisResult}</p>
        </div>

         {/* Hiển thị chuyên gia gợi ý */}
         <div className={styles.recommendedExperts}>
          <h3>Chuyên gia tư vấn gợi ý:</h3>
          {loading ? (
            <p>Đang tải chuyên gia...</p>
          ) : displayedExperts.length > 0 ? (
            <div className={styles.expertList}>
              {displayedExperts.map((expert) => (
                <div key={expert.id} className={styles.expertCard}>
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className={styles.expertAvatar}
                  />
                  <div>
                    <h4>
                      <Link to={`/expert/${expert.name}`} className={styles.expertLink}>
                        {expert.name}
                      </Link>
                    </h4>
                    <p className={`${styles.specialty} ${expert.specialty.length > 20 ? styles.multiLine : ''}`}>
                      {getSpecialtyDisplay(expert.specialty).join(", ") || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có chuyên gia nào phù hợp với các lĩnh vực cần cải thiện của bạn.</p>
          )}
        </div>
<ReactPaginate
          previousLabel={"‹"}
          nextLabel={"›"}
          pageCount={Math.ceil(recommendedExperts.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={styles.paginationContainer}
          pageClassName={styles.page}
          previousClassName={styles.previous}
          nextClassName={styles.next}
          activeClassName={styles.active}
        />
      </div>

      <div className={styles.navigationButtons}>
        <button className={styles.expertBtn} onClick={() => navigate("/expert")}>
          📅 Chọn chuyên gia tư vấn
        </button>
        <button className={styles.historyBtn} onClick={() => navigate("/history-test")}>
          📜 Xem lại lịch sử trắc nghiệm
        </button>
      </div>
    </div>
  );
};

export default Result;
