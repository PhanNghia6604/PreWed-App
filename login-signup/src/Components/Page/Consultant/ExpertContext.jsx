import { createContext, useState, useEffect } from "react";

export const ExpertContext = createContext();

export const ExpertProvider = ({ children }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/expert/all") // Gọi API lấy danh sách chuyên gia
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tải dữ liệu");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Experts fetched:", data); // Debug
        setExperts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <ExpertContext.Provider value={{ experts, loading, error }}>
      {children}
    </ExpertContext.Provider>
  );
};
