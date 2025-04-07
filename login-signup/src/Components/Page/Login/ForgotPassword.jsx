import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./ForgotPassword.module.css";
import { colors } from "@mui/material";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setServerError(errorData.message || "Failed to send verification code.");
          alert("Không thể gửi mã xác nhận. Vui lòng kiểm tra lại email.");
          return;
        }
        alert("Mã xác nhận đã được gửi đến email của bạn.");
        navigate("/verify-code"); // Điều hướng đến trang nhập mã xác nhận
      } catch (error) {
        setServerError("An error occurred. Please try again.");
        alert("Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div id="forgot-password-page" className={styles.container}>
      <h2>Forgot Password</h2>
      {serverError && <div className={styles.error}>{serverError}</div>}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.inputBox}>
          <label id="Colorlabel">Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="Enter your email"
          />
          {formik.touched.email && formik.errors.email && (
            <div className={styles.errorText}>{formik.errors.email}</div>
          )}
        </div>
        <button type="submit" disabled={formik.isSubmitting}>Send Verification Code</button>
      </form>
    </div>
  );
};
