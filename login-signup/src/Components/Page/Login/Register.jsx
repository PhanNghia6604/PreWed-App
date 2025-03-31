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
      name: Yup.string().required("Name is required"),
      username: Yup.string()
        .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed")
        .required("Username is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
      phone: Yup.string()
        .matches(/^[0-9]{9,}$/, "Invalid phone number! Must be at least 9 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
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
          setErrors({ server: errorData.message || "Registration failed." });
          return;
        }

        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      } catch (error) {
        setErrors({ server: "An error occurred. Please try again." });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className={styles.register}>
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
              {formik.isSubmitting ? "Registering..." : "Register"}
            </button>
            <div className={styles["login-link"]}>
              Already have an account? <span onClick={() => navigate("/login")}>Login</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
