import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  return (
    <div className={styles.container}>
      <h2>Quản lý người dùng</h2>
      <div className={styles.buttonGroup}>
        <Link to="/admin-customers">
          <Button variant="contained" className={styles.button}>
            Quản lý Khách hàng
          </Button>
        </Link>
        <Link to="/admin-experts">
          <Button variant="contained">
            Quản lý Chuyên gia
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserManagement;