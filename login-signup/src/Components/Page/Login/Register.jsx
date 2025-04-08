import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Heading } from "../../Common/Heading";
import styles from "./Register.module.css";

export const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
  name: Yup.string().required("Họ và Tên là bắt buộc"),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9_]+$/, "Chỉ cho phép chữ cái, số và dấu gạch dưới")
    .required("Tên đăng nhập là bắt buộc"),
  email: Yup.string().email("Định dạng email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Mật khẩu là bắt buộc"),
  phone: Yup.string()
    .matches(/^[0-9]{9,}$/, "Số điện thoại không hợp lệ! Phải có ít nhất 9 chữ số")
    .required("Số điện thoại là bắt buộc"),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
}),

onSubmit: async (values, { setSubmitting, setErrors }) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setErrors({ server: errorData.message || "Đăng ký không thành công." });
      return;
    }

    alert("Đăng ký thành công! Đang chuyển hướng tới trang đăng nhập...");
    navigate("/login");
  } catch (error) {
    setErrors({ server: "Đã xảy ra lỗi. Vui lòng thử lại." });
  } finally {
    setSubmitting(false);
  }
},
  });

  return (
    <section className={styles.register} id="Register-Page-CSS">
      <div className={styles.container}>
        <Heading title="Register" />
        {formik.errors.server && <div className={styles["error-text"]}>{formik.errors.server}</div>}
        <div className={styles.content}>
          <form onSubmit={formik.handleSubmit} className="register-form">
            {Object.keys(formik.initialValues).map((field) => (
              <div className={styles["input-box"]} key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  placeholder={`Your ${field}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values[field]}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <div className={styles["error-text"]}>{formik.errors[field]}</div>
                )}
              </div>
            ))}
            <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Đang đăng kí..." : "Đăng kí"}
            </button>
            <div className={styles["login-link"]}>
              Already have an account? <span onClick={() => navigate("/login")}>Đăng nhập</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
