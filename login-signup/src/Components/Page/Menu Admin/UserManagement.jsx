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
    role_enum: "", 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/get");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await fetch("/api/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      fetchUsers(); // Cập nhật lại danh sách user
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
    }
  };

  return (
    <div style={{ padding: "120px" }}>
      

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
              <TableCell><strong>Role</strong></TableCell> {/* ➕ Thêm cột Role */}
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
                  <TableCell>{user.role_enum}</TableCell> 
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          <TextField
            label="Role_enum"
            fullWidth
            value={newUser.role_enum}
            onChange={(e) => setNewUser({ ...newUser, role_enum: e.target.value })}
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
