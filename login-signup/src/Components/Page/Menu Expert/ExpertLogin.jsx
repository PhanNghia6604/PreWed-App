import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Menu Expert/ExpertLogin.module.css";
import { Heading } from "../../Common/Heading"; 

export const ExpertLogin = ({ setIsLoggedIn, setUserRole }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Dữ liệu nhận từ API:", data);

      if (response.ok) {
        // Lưu token vào localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username); // ✅ Lưu username
        localStorage.setItem("userRole", "expert");
        localStorage.setItem("expertId", data.id); // Lưu ID chuyên gia vào localStorage


        // Cập nhật state
        setIsLoggedIn(true);
        setUserRole("expert");

        navigate("/expert-dashboard");
      } else {
        setError(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      setError("Lỗi kết nối! Vui lòng thử lại.");
      console.error("Login error:", error);
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <Heading title="Expert Login" />
        {error && <div className={styles["error-box"]}>{error}</div>}
        <div className={styles.content}>
          <form onSubmit={handleLogin} className="login-form">
            <div className={styles["input-box"]}>
              <label>User Name</label>
              <input
                type="text"
                placeholder="User Name"
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
            <div className={styles["forgot-password"]}>
              <span onClick={() => alert("Redirect to Forgot Password")}>
                Forgot Password?
              </span>
            </div>
            <button type="submit" className={styles.btn}>
              Login
            </button>
            <div className={styles["register-link"]}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/expert-register")}>Register</span>
            </div>
          </form>
          <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "transparent",
            color: "#ffcc00",
            border: "none",
            fontSize: "12px",
            fontWeight: "normal",
            textTransform: "none",
            cursor: "pointer",
            padding: "5px 10px"
          }}
        >
          Back
        </button>
        </div>
      </div>
    </section>
  );
};
