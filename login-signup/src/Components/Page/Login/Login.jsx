import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Nếu bạn dùng React Router
import { Heading } from "../../Common/Heading"; // Dùng lại Heading để đồng bộ

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Chuyển trang nếu dùng React Router

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <section className="login">
      <div className="container">
        <Heading title="Login" />
        <div className="content">
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot-password">
              <span onClick={() => alert("Redirect to Forgot Password")}>
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="btn">
              Login
            </button>

            <div className="register-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>Sign Up</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
