import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

export const AdminLogin = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed, please check your credentials.");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      setIsLoggedIn(true);
      navigate("/admin-dashboard");
    } catch (error) {
      setError("Login failed, please try again.");
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
              placeholder="Admin Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <span onClick={() => navigate("/admin-register")}>Register</span>
          </div>
        </form>
      </div>
    </section>
  );
};
