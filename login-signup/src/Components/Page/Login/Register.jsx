import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from '../../Common/Heading';
import styles from "./Register.module.css";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all the required fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format!");
      return;
    }

    setError("");

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, address }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Registration failed');
      }
  
      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
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