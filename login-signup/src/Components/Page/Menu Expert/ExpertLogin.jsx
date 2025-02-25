import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Menu Expert/ExpertLogin.module.css";
import { Heading } from "../../Common/Heading"; // Import nếu chưa có

export const ExpertLogin = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để hiển thị lỗi
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi trước đó

    // Giả lập dữ liệu expert (thực tế bạn sẽ gọi API)
    const mockExpert = { username: "expert", password: "123456" };

    if (username === mockExpert.username && password === mockExpert.password) {
      localStorage.setItem("token", "expert-token"); // Lưu token
      localStorage.setItem("userRole", "expert"); // Đánh dấu vai trò là Expert
      navigate("/expert-dashboard"); // Chuyển đến Dashboard Expert
      window.location.reload(); // Refresh trang để cập nhật header
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!"); // Hiển thị lỗi
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
