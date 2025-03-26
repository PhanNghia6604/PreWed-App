import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from "@mui/material";
import styles from "./CustomerManagement.module.css";

import { Link } from "react-router-dom";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/get");
      const data = await response.json();
      const filteredData = data.filter(user => user.roleEnum === "CUSTOMER"); // Lọc chỉ khách hàng
      setCustomers(filteredData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleChange = (e) => {
    setSelectedCustomer({ ...selectedCustomer, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!selectedCustomer) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/${selectedCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(selectedCustomer),
      });

      if (response.ok) {
        fetchUsers(); // Refresh danh sách
        handleClose();
      } else {
        alert("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý Khách hàng</h2>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className={styles.tableRow}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.username}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    className={styles.editButton}
                    onClick={() => handleEdit(customer)}
                  >
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chỉnh sửa khách hàng */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <>
              <TextField margin="dense" label="Tên" name="name" fullWidth value={selectedCustomer.name} onChange={handleChange} />
              <TextField margin="dense" label="Username" name="username" fullWidth value={selectedCustomer.username} onChange={handleChange} />
              <TextField margin="dense" label="Email" name="email" fullWidth value={selectedCustomer.email} onChange={handleChange} />
              <TextField margin="dense" label="Số điện thoại" name="phone" fullWidth value={selectedCustomer.phone} onChange={handleChange} />
              <TextField margin="dense" label="Địa chỉ" name="address" fullWidth value={selectedCustomer.address} onChange={handleChange} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Nút quay lại */}
      <div className={styles.backButtonContainer}>
        <Link to="/admin-users">
          <Button variant="outlined" className={styles.backButton}>Quay lại</Button>
        </Link>
      </div>
    </div>
  );
};

export default CustomerManagement;
