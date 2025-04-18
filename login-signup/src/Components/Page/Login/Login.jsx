import React from "react";
import { useNavigate } from "react-router-dom"; // Đảm bảo rằng bạn đã import useNavigate
import { useFormik } from "formik";
import * as Yup from "yup";
import { Heading } from "../../Common/Heading";
import styles from "./Login.module.css";

export const Login = ({ setIsLoggedIn }) => {
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
        .required("Mật khẩu phải có ít nhất 8 ký tự"),
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
          localStorage.setItem("user", JSON.stringify({
            userId: data.id,
            fullName: data.fullName,
            email: data.email,
            role: data.roleEnum,
            phone: data.phone,
            address: data.address,
            token: data.token,
            username: data.username
          }));
          setIsLoggedIn(true);
          navigate("/"); // Redirect to homepage or dashboard
        }
      } catch (error) {
        setErrors({ server: "Tài khoản hoặc mật khẩu bị sai" });
      } finally {
        setSubmitting(false);
      }
    },
  });


  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <Heading title="Đăng nhập" />
        {formik.errors.server && <div className={styles["error-box"]}>{formik.errors.server}</div>}
        <div className={styles.content}>
          <form onSubmit={formik.handleSubmit} className="login-form">
            <div className={styles["input-box"]}>
              <label>Tài khoản</label>
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
              <label>Mật Khẩu</label>
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
              {/* Thay đổi onClick để điều hướng tới trang ForgotPassword */}
              <span onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</span>
            </div>
            <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>
            <div className={styles["register-link"]}>
              Don't have an account? <span onClick={() => navigate("/register")}>Đăng Ký</span>
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
             Quay lại 
          </button>
        </div>
      </div>
    </section>
  );
};
