import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminRegister.module.css"; // Import đúng cách

export const AdminRegister = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
    
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
    
        // Lưu thông tin vào localStorage
        const existingUsers = JSON.parse(localStorage.getItem("adminUsers")) || [];
        
        // Kiểm tra xem email đã tồn tại chưa
        if (existingUsers.some(user => user.email === formData.email)) {
            setError("Email already registered!");
            return;
        }
    
        const newUser = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };
    
        existingUsers.push(newUser);
        localStorage.setItem("adminUsers", JSON.stringify(existingUsers));
    
        setSuccess("Registration successful! Redirecting to login...");
        setMessage("Đăng ký thành công ");
        setTimeout(() => navigate("/admin-login"), 2000);
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.container}>
                <h2>Admin Register</h2>
                {error && <div className={styles.message} style={{ color: "red" }}>{error}</div>}
                {success && <div className={styles.message} style={{ color: "green" }}>{success}</div>}
                <form onSubmit={handleRegister} className={styles.registerForm}>
                    <div className={styles.inputBox}>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className={styles.btn}>Register</button>
                    <div className={styles.loginLink}>
                        Already have an account? <span onClick={() => navigate("/login")}>Login</span>
                    </div>
                </form>
            </div>
        </div>
    );
};
