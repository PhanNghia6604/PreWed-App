import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./AdminLogin.module.css";

export const AdminLogin = ({ setIsLoggedIn, setUserRole }) => {
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

        if (!response.ok) {
          const errorData = await response.json();
          setErrors({ server: errorData.message || "Login failed." });
          return;
        }

        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("adminId", data.id);
          localStorage.setItem("userRole", "admin");

          setIsLoggedIn(true);
          setUserRole("admin");
          navigate("/admin-dashboard");
        }
      } catch (error) {
        setErrors({ server: "Invalid username or password" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className={styles["admin-login"]}>
      <div className={styles.container}>
        <h2>Admin Login</h2>
        {formik.errors.server && <div className={styles["error-text"]}>{formik.errors.server}</div>}
        <form onSubmit={formik.handleSubmit} className={styles["admin-login-form"]}>
          <div className={styles["input-box"]}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className={styles["error-text"]}>{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className={styles["register-link"]}>
          <span onClick={() => navigate("/login")}>Back</span>
        </div>
      </div>
    </section>
  );
};