import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./ForgotPassword.module.css";

export const VerifyCode = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: Yup.object({
      code: Yup.string().length(6, "Code must be 6 digits").required("Verification code is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setServerError(errorData.message || "Invalid or expired verification code.");
          alert("Mã xác nhận không hợp lệ hoặc đã hết hạn.");
          return;
        }

        // Lưu mã xác nhận vào localStorage để sử dụng trong ResetPassword.jsx
        localStorage.setItem("verificationCode", values.code);
        alert("Mã xác nhận hợp lệ. Bạn có thể thay đổi mật khẩu.");
        navigate("/reset-password"); // Điều hướng đến trang đổi mật khẩu
      } catch (error) {
        setServerError("An error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div id="verify-code-page" className={styles.container}>
      <h2>Enter Verification Code</h2>
      {serverError && <div className={styles.error}>{serverError}</div>}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputBox}>
          <label id="Colorlabel">Verification Code</label>
          <input
            type="text"
            name="code"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.code}
            placeholder="Enter the code sent to your email"
          />
          {formik.touched.code && formik.errors.code && (
            <div className={styles.errorText}>{formik.errors.code}</div>
          )}
        </div>
        <button type="submit" disabled={formik.isSubmitting}>Verify Code</button>
      </form>
    </div>
  );
};
