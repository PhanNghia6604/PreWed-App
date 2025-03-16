import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

export const AdminLogin = ({ setIsLoggedIn, setUserRole }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Dữ liệu nhận từ API:", data);

      if (response.ok) {
        // 🔹 Lưu token và thông tin admin vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("adminId", data.id); // Lưu ID admin vào localStorage

        // 🔹 Cập nhật state
        setIsLoggedIn(true);
        setUserRole("admin");

        // 🔹 Chuyển hướng đến Admin Dashboard
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      setError("Lỗi kết nối! Vui lòng thử lại.");
      console.error("Login error:", error);
    }
  };

  return (
    <section className={styles["admin-login"]}>
      <div className={styles.container}>
        <h2>Admin Login</h2>
        {error && <div className={styles["error-box"]}>{error}</div>}
        <form onSubmit={handleLogin} className={styles["admin-login-form"]}>
          <div className={styles["input-box"]}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className={styles["input-box"]}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.btn}>Login</button>
        </form>
      </div>
    </section>
  );
};
