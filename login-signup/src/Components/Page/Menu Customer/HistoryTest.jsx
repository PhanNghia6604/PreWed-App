import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HistoryTest.module.css";

const categoryMap = {
  TAMLY: "Tâm lý",
  TAICHINH: "Tài chính",
  GIADINH: "Gia đình",
  SUCKHOE: "Sức khỏe",
  GIAOTIEP: "Giao tiếp",
  TONGIAO: "Tôn giáo",
};

const HistoryTest = () => {
  const [history, setHistory] = useState([]);
  const [filterCategory, setFilterCategory] = useState(""); // Lọc theo danh mục
  const [filterDate, setFilterDate] = useState(""); // Lọc theo ngày
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.token;
      if (!user || !token) {
        alert("Bạn chưa đăng nhập, vui lòng đăng nhập lại!");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`/api/test/history/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi khi lấy lịch sử bài kiểm tra");
        }
        const data = await response.json();

        // Xử lý dữ liệu: Chỉ lấy categoriesToImprove và consultations
        const processedData = data.map((test, index) => ({
          ...test,
          testNumber: index + 1,
          diagnosResults: test.diagnosResults.map((diagnos) => ({
            categoriesToImprove: diagnos.categoriesToImprove, // Chỉ lấy categoriesToImprove
            consultations: diagnos.consultations, // Chỉ lấy consultations
          })),
        }));

        setHistory(processedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch sử:", error);
      }
    };

    fetchHistory();
  }, [navigate]);

  // 🔎 Lọc danh sách theo danh mục hoặc ngày
  const filteredHistory = history.filter((test) => {
    const matchCategory = filterCategory ? test.diagnosResults.some(diagnos => diagnos.categoriesToImprove.includes(filterCategory)) : true;
    const matchDate = filterDate ? test.testDate.startsWith(filterDate) : true;
    return matchCategory && matchDate;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>📜 Lịch Sử Bài Kiểm Tra (đã làm {history.length} lần)</h1>

        {/* 🎯 Bộ lọc */}
        <div className={styles.filterContainer}>
          <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory} className={styles.filter}>
            <option value="">📌 Chọn danh mục</option>
            {Object.values(categoryMap).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="date"
            onChange={(e) => setFilterDate(e.target.value)}
            className={styles.filter}
          />
        </div>

        {/* 📝 Bảng lịch sử */}
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ngày làm bài</th>
              <th>Kết quả</th>
              <th>Ghi chú</th> {/* Thêm cột ghi chú */}
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((test) => {
                // Lấy dữ liệu từ diagnosResults
                const diagnos = test.diagnosResults[0];
                const note = diagnos.consultations.length > 0 
                  ? `${diagnos.consultations.join(", ")}`
                  : "Bạn không cần tư vấn";
                
                return (
                  <tr key={test.id}>
                    <td>{test.testNumber}</td>
                    <td>{new Date(test.testDate).toLocaleDateString("vi-VN")}</td>
                    <td>{diagnos.categoriesToImprove.join(", ")}</td>
                    <td>{note}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className={styles.noData}>Không có dữ liệu phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 🔘 Nút thao tác */}
        <div className={styles.buttonContainer}>
          <button onClick={() => navigate("/test")} className={styles.testButton}>🔄 Làm lại bài kiểm tra</button>
          <button onClick={() => navigate("/statistics")} className={styles.statButton}>📊 Xem thống kê</button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTest;
