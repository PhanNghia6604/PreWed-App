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
        console.error("Lỗi đăng nhập:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <Heading title="Đăng nhập Chuyên Gia" />
        {formik.errors.server && <div className={styles["error-box"]}>{formik.errors.server}</div>}
        <div className={styles.content}>
          <form onSubmit={formik.handleSubmit} className="login-form">
            <div className={styles["input-box"]}>
              <label>Tên người dùng</label>
              <input
                type="text"
                name="username"
                placeholder="Tên người dùng"
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
                placeholder="Mật khẩu"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className={styles["error-text"]}>{formik.errors.password}</div>
              )}
            </div>
            <div className={styles["forgot-password"]}>
              <span onClick={() => alert("Chuyển hướng đến trang Quên mật khẩu")}>Quên mật khẩu?</span>
            </div>
            <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <div className={styles["register-link"]}>
              Chưa có tài khoản? <span onClick={() => navigate("/expert-register")}>Đăng ký</span>
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
