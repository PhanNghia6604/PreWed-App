import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from '../../Common/Heading';
import styles from "./Register.module.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [username,setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Kiểm tra các trường rỗng
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all the required fields!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format!");
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    // Kiểm tra số điện thoại (chỉ chứa số, tối thiểu 9 số)
    const phoneRegex = /^[0-9]{9,}$/;
    if (!phoneRegex.test(phone)) {
      setError("Invalid phone number! Must be at least 9 digits and contain only numbers.");
      return;
    }

    // Kiểm tra username (không có khoảng trắng, chỉ chữ cái, số, dấu gạch dưới)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setError("Username can only contain letters, numbers, and underscores, without spaces.");
      return;
    }

    setError("");
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password, phone, address }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };


  return (
    <section className={styles.register}>
      <div className={styles.container}>
        <Heading title="Register" />
        {error && <div className={styles["error-box"]}>{error}</div>}
        <div className={styles.content}>
          <form onSubmit={handleRegister} className="register-form">
            <div className={styles["input-box"]}>
              <label>Name</label>
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles["input-box"]}>
              <label>User Name</label>
              <input type="text" placeholder="You User Name" value={username} onChange={(e) => setUserName(e.target.value)}/>
            </div> 
            <div className={styles["input-box"]}>
              <label>Email</label>
              <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles["input-box"]}>
              <label>Password</label>
              <input type="password" placeholder="Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles["input-box"]}>
              <label>Phone</label>
              <input type="text" placeholder="Your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className={styles["input-box"]}>
              <label>Address</label>
              <input type="text" placeholder="Your Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <button type="submit" className={styles.btn}>Register</button>
            <div className={styles["login-link"]}>
              Already have an account? <span onClick={() => navigate("/login")}>Login</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};