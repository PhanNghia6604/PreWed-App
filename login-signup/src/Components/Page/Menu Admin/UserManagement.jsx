import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
} from "@mui/material";
import styles from "./UserManagement.module.css"; // Import CSS
const ROLE_LABELS = {
  EXPERT: "Chuyên gia",
  CUSTOMER: "Khách hàng",
  ADMIN: "Quản trị viên",
};
const ITEMS_PER_PAGE = 10; // Định nghĩa số lượng user hiển thị trên mỗi trang
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    avatar: "",
    certificates: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/get");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await fetch("http://localhost:8080/api/get", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(newUser),
      });
      fetchUsers(); // Cập nhật lại danh sách user
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
    }
  };
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token"); // Hoặc từ sessionStorage/cookie tùy vào cách lưu trữ token

    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await fetch(`http://localhost:8080/api/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", 
             "Authorization": `Bearer ${token}`,

          }
        });
        fetchUsers(); // Cập nhật lại danh sách user sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa user:", error);
      }
    }
  };
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const displayedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ padding: "100px" }}>
      <h2>Quản lý Người Dùng</h2>

      {/* Nút tạo user */}
      <Button
        variant="contained"
        className={styles.createButton}
        onClick={() => setOpen(true)}
      >
        + Thêm Người Dùng
      </Button>
      

      {/* Bảng danh sách user */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Avatar</strong></TableCell>
              <TableCell><strong>Tên</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Số điện thoại</strong></TableCell>
              <TableCell><strong>Địa chỉ</strong></TableCell>
              <TableCell><strong>Chứng chỉ</strong></TableCell>
              <TableCell><strong>Vai trò</strong></TableCell> {/* Thêm cột Vai trò */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Avatar src={user.avatar} alt="Avatar" />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.certificates}</TableCell>
                  <TableCell>{ROLE_LABELS[user.roleEnum] || "Không xác định"}</TableCell>
                  <TableCell>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteUser(user.id)}
          >
            Xóa
          </Button>
        </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Nút chuyển trang */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Trang trước
        </Button>
        <span style={{ margin: "0 20px" }}>
          Trang {currentPage} / {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Trang sau
        </Button>
      </div>
      {/* Dialog tạo user */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Thêm Người Dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Avatar URL"
            fullWidth
            value={newUser.avatar}
            onChange={(e) => setNewUser({ ...newUser, avatar: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Chứng chỉ"
            fullWidth
            value={newUser.certificates}
            onChange={(e) => setNewUser({ ...newUser, certificates: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Hủy</Button>
          <Button onClick={handleCreateUser} color="primary">Thêm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
