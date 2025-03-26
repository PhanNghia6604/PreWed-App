import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./UserManagement.module.css";

const UserManagement = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý người dùng</h2>
      <div className={styles.buttonGroup}>
        <Link to="/admin-customers">
          <Button variant="contained" >
            Quản lý Khách hàng
          </Button>
        </Link>
        <Link to="/admin-experts">
          <Button variant="contained" >
            Quản lý Chuyên gia
          </Button>
        </Link>
        <Link to="/admin-accept">
          <Button variant="contained" >
            Phê duyệt chuyên gia
          </Button>
        </Link>
        <Link to="/admin-dashboard">
          <Button variant="contained" >
            Quay lại trang
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserManagement;