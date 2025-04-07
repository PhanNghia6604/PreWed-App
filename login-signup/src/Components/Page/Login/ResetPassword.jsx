import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./ForgotPassword.module.css";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // State để lưu mã xác nhận

  // Lấy mã xác nhận từ localStorage (hoặc context, hoặc qua props)
  useEffect(() => {
    const storedCode = localStorage.getItem("verificationCode");  // Giả sử mã xác nhận được lưu trong localStorage
    if (storedCode) {
      setVerificationCode(storedCode);
    } else {
      navigate("/verify-code"); // Nếu không có mã, điều hướng đến trang nhập mã xác nhận
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(8, "Password must be at least 8 characters").required("New password is required"),
      confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], "Passwords must match").required("Confirm password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: verificationCode,  // Sử dụng mã xác nhận đã lưu
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setServerError(errorData.message || "Failed to reset password.");
          alert("Đổi mật khẩu không thành công. Vui lòng thử lại.");
          return;
        }
        alert("Mật khẩu đã được thay đổi thành công.");
        navigate("/login"); // Điều hướng đến trang login sau khi đổi mật khẩu thành công
      } catch (error) {
        setServerError("An error occurred. Please try again.");
        alert("Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div id="reset-password-page" className={styles.container}>
      <h2>Reset Password</h2>
      {serverError && <div className={styles.error}>{serverError}</div>}
      <form onSubmit={formik.handleSubmit}>
        {/* Input cho mật khẩu mới */}
        <div className={styles.inputBox}>
          <label id="Colorlabel">New Password</label>
          <input
            type="password"
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            placeholder="Enter new password"
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div className={styles.errorText}>{formik.errors.newPassword}</div>
          )}
        </div>

        {/* Input cho mật khẩu xác nhận */}
        <div className={styles.inputBox}>
          <label id="Colorlabel">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            placeholder="Confirm new password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className={styles.errorText}>{formik.errors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" disabled={formik.isSubmitting}>Reset Password</button>
      </form>
    </div>
  );
};
