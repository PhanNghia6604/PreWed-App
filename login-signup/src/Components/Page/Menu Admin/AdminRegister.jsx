import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./AdminRegister.module.css";

export const AdminRegister = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email format").required("Email is required"),
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords do not match")
                .required("Confirm Password is required"),
        }),
        onSubmit: (values, { setSubmitting, setErrors, setStatus }) => {
            setErrors({});
            setStatus("");

            const existingUsers = JSON.parse(localStorage.getItem("adminUsers")) || [];

            if (existingUsers.some(user => user.email === values.email)) {
                setErrors({ email: "Email already registered!" });
                setSubmitting(false);
                return;
            }

            const newUser = {
                username: values.username,
                email: values.email,
                password: values.password,
            };

            existingUsers.push(newUser);
            localStorage.setItem("adminUsers", JSON.stringify(existingUsers));

            setStatus("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/admin-login"), 2000);
        },
    });

    return (
        <div className={styles.registerContainer}>
            <div className={styles.container}>
                <h2>Admin Register</h2>
                {formik.status && <div className={styles.message} style={{ color: "green" }}>{formik.status}</div>}
                <form onSubmit={formik.handleSubmit} className={styles.registerForm}>
                    <div className={styles.inputBox}>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            {...formik.getFieldProps("username")}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className={styles.error}>{formik.errors.username}</div>
                        )}
                    </div>

                    <div className={styles.inputBox}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            {...formik.getFieldProps("email")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <div className={styles.error}>{formik.errors.email}</div>
                        )}
                    </div>

                    <div className={styles.inputBox}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            {...formik.getFieldProps("password")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className={styles.error}>{formik.errors.password}</div>
                        )}
                    </div>

                    <div className={styles.inputBox}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            {...formik.getFieldProps("confirmPassword")}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className={styles.error}>{formik.errors.confirmPassword}</div>
                        )}
                    </div>

                    <button type="submit" className={styles.btn} disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Registering..." : "Register"}
                    </button>
                    <div className={styles.loginLink}>
                        Already have an account? <span onClick={() => navigate("/login")}>Login</span>
                    </div>
                </form>
            </div>
        </div>
    );
};
