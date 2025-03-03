import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChooseRole.module.css";

export const ChooseRole = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Chọn vai trò của bạn</h2>
            <div className={styles.buttonGroup}>
                <button
                    className={`${styles.button} ${styles.customer}`}
                    onClick={() => navigate("/customer-login")}
                >
                    Đăng nhập dưới tư cách là khách hàng
                </button>
                <button
                    className={`${styles.button} ${styles.expert}`}
                    onClick={() => navigate("/expert-login")}
                >
                    Đăng nhập dưới tư cách là chuyên gia
                </button>
                <button
                    className={`${styles.button} ${styles.customer}`}
                    onClick={() => navigate("/admin-login")}
                >
                    Đăng nhập dưới tư cách là quản trị viên
                </button>
            </div>
        </div>
    );
};
