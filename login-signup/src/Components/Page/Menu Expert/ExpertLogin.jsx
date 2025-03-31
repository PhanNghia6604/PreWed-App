import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../Menu Expert/ExpertLogin.module.css";
import { Heading } from "../../Common/Heading"; 

export const ExpertLogin = ({ setIsLoggedIn, setUserRole }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("User Name is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log("Dữ liệu nhận từ API:", data);

        if (response.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", data.username); 
          localStorage.setItem("userRole", "expert");
          localStorage.setItem("expertId", data.id);

          setIsLoggedIn(true);
          setUserRole("expert");

          navigate("/expert-dashboard");
        } else {
          setErrors({ server: data.message || "Đăng nhập thất bại!" });
        }
      } catch (error) {
        setErrors({ server: "Lỗi kết nối! Vui lòng thử lại." });
        console.error("Login error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <Heading title="Expert Login" />
        {formik.errors.server && <div className={styles["error-box"]}>{formik.errors.server}</div>}
        <div className={styles.content}>
          <form onSubmit={formik.handleSubmit} className="login-form">
            <div className={styles["input-box"]}>
              <label>User Name</label>
              <input
                type="text"
                name="username"
                placeholder="User Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <div className={styles["error-text"]}>{formik.errors.username}</div>
              )}
            </div>
            <div className={styles["input-box"]}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className={styles["error-text"]}>{formik.errors.password}</div>
              )}
            </div>
            <div className={styles["forgot-password"]}>
              <span onClick={() => alert("Redirect to Forgot Password")}>Forgot Password?</span>
            </div>
            <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>
            <div className={styles["register-link"]}>
              Don't have an account? <span onClick={() => navigate("/expert-register")}>Register</span>
            </div>
          </form>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "transparent",
              color: "#ffcc00",
              border: "none",
              fontSize: "12px",
              fontWeight: "normal",
              textTransform: "none",
              cursor: "pointer",
              padding: "5px 10px"
            }}
          >
             Back 
          </button>
        </div>
      </div>
    </section>
  );
};
