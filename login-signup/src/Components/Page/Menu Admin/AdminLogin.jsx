import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

export const AdminLogin = ({ setIsLoggedIn,setUserRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");
  
    const existingUsers = JSON.parse(localStorage.getItem("adminUsers")) || [];
  
    const user = existingUsers.find(user => user.username === username && user.password === password);
  
    if (!user) {
      setError("Invalid username or password!");
      return;
    }
  
    // Lưu thông tin đăng nhập
    localStorage.setItem("adminSession", JSON.stringify(user));
    localStorage.setItem("token", "admin-Token"); 
    localStorage.setItem("userRole", "admin");
  
    setIsLoggedIn(true);
    setUserRole("admin");
    console.log("Login successful! Redirecting...");
    
    
    
    // Chuyển hướng sau khi đăng nhập
    navigate("/admin-dashboard");
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
