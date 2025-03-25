import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WaitingPayment = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const bookingId = localStorage.getItem("bookingId");
    const success = queryParams.get("vnp_ResponseCode") === "00";

    if (!bookingId) {
      setStatus("Lỗi: Không tìm thấy Booking ID!");
      setLoading(false);
      return;
    }

    const processPayment = async () => {
      try {
        const response = await fetch("/api/payments/response", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ bookingId, success }),
        });

        if (!response.ok) throw new Error("Lỗi xử lý thanh toán!");

        setStatus(success ? "Thanh toán thành công!" : "Thanh toán thất bại!");
      } catch (error) {
        console.error("Lỗi:", error);
        setStatus("Lỗi khi xử lý thanh toán.");
      } finally {
        setLoading(false);
        setTimeout(() => navigate("/my-booking"), 3000);
      }
    };

    processPayment();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", backgroundColor: "#ffffff", color: "#000000", padding: "20px", borderRadius: "8px" }}>
    <h2>Đang xử lý thanh toán...</h2>
    {loading ? <p>Vui lòng chờ...</p> : <p>{status}</p>}
  </div>
  );
};

export default WaitingPayment;
