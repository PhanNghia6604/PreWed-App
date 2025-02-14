import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import styles from "./Login.module.css"; // ✅ Import CSS module

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");


  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password cannot be empty!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email! ");
      return;
    }

    setError(""); // Xóa lỗi nếu nhập đúng
    console.log("Email:", email, "Password:", password);
  };







  return (
    <section className={styles.login}>

      <div className={styles.container}>
        <Heading title="Login" />

        {error && <div className={styles["error-box"]}>{error}</div>}
        <div className={styles.content}>
          <form onSubmit={handleLogin} className="login-form">
            <div className={styles["input-box"]}>
              <label>Email</label>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}

              />
            </div>

            <div className={styles["input-box"]}>
              <label>Password</label>
              <input
                type="text"
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
              <span onClick={() => navigate("/register")}>Register</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};