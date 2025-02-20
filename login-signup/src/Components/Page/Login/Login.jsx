import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import styles from "./Login.module.css";

export const Login = ({setIsLoggedIn}) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState('');  // Ensure setMessage is defined
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status && data.token) {
        alert(data.message);
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setMessage('Login succeeded');
        navigate('/');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Login failed, please try again.');
      console.error('Error during login:', error);
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <Heading title="Login" />
        {error && <div className={styles["error-box"]}>{error}</div>}
        {message && <div className={styles["message-box"]}>{message}</div>} {/* Display message */}
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
                type="password" // Changed to password type for security
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