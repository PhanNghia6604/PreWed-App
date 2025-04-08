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
      username: Yup.string().required("Tên người dùng là bắt buộc"),
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .required("Mật khẩu là bắt buộc"),
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
          setErrors({ server: errorData.message || "Đăng nhập thất bại." });
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
        setErrors({ server: "Tên người dùng hoặc mật khẩu không hợp lệ" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className={styles["admin-login"]}>
      <div className={styles.container}>
        <h2>Đăng nhập Admin</h2>
        {formik.errors.server && <div className={styles["error-text"]}>{formik.errors.server}</div>}
        <form onSubmit={formik.handleSubmit} className={styles["admin-login-form"]}>
          <div className={styles["input-box"]}>
            <label>Tên người dùng</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên người dùng của bạn"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className={styles["error-text"]}>{formik.errors.username}</div>
            )}
          </div>
          <div className={styles["input-box"]}>
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className={styles["error-text"]}>{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <div className={styles["register-link"]}>
          <span onClick={() => navigate("/login")}>Quay lại</span>
        </div>
      </div>
    </section>
  );
};
