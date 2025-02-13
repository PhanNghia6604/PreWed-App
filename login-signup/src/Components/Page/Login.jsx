import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "../Common/Heading";
import styles from "./Login.module.css"; // ✅ Import CSS module

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <Heading title="Login" />
        <div className={styles.content}>
          <form onSubmit={handleLogin} className="login-form">
            <div className={styles["input-box"]}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles["input-box"]}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
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
              <span onClick={() => navigate("/register")}>Sign Up</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
