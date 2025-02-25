import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Menu Expert/ExpertLogin.module.css";
import { Heading } from "../../Common/Heading"; 

export const ExpertLogin = ({ setIsLoggedIn, setUserRole }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];

    if (!Array.isArray(storedExperts)) {
      console.error("Dữ liệu trong localStorage không hợp lệ!");
      setError("Lỗi hệ thống, vui lòng thử lại!");
      return;
    }

    const expert = storedExperts.find(
      (exp) => exp.username === username && exp.password === password
    );

    if (expert) {
      localStorage.setItem("currentExpert", expert.username); // Lưu username đang đăng nhập
      localStorage.setItem("token", "expert-token");
      localStorage.setItem("userRole", "expert");

      // Cập nhật state ngay lập tức
      setIsLoggedIn(true);
      setUserRole("expert");

      navigate("/expert-dashboard");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
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
        </div>
      </div>
    </section>
  );
};
