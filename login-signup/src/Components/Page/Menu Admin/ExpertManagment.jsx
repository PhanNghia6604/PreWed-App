import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import { Link } from "react-router-dom";

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/get");
      const data = await response.json();
      const filteredData = data.filter(user => user.roleEnum === "EXPERT");

      setExperts(filteredData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };
  const handleEditClick = (expert) => {
    setSelectedExpert(expert);
    setOpen(true);
  };

  // Đóng hộp thoại
  const handleClose = () => {
    setOpen(false);
    setSelectedExpert(null);
  };

  // Cập nhật thông tin từ input
  const handleChange = (e) => {
    setSelectedExpert({
      ...selectedExpert,
      [e.target.name]: e.target.value,
    });
  };

  // Gửi request cập nhật
  const handleSave = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
      return;
    }
  
    try {
      const response = await fetch(`/api/expert/expert/${selectedExpert.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          username: selectedExpert.username,
          password: selectedExpert.password || "", // Nếu không có password, gửi chuỗi rỗng
          name: selectedExpert.name,
          email: selectedExpert.email,
          phone: selectedExpert.phone,
          address: selectedExpert.address,
          specialty: selectedExpert.specialty || "", // Đảm bảo có trường specialty
          avatar: selectedExpert.avatar || "", // Nếu chưa có ảnh đại diện, gửi chuỗi rỗng
          certificates: selectedExpert.certificates || [], // Nếu chưa có chứng chỉ, gửi mảng rỗng
        }),
      });
  
      if (response.status === 401) {
        alert("Token hết hạn hoặc bạn không có quyền cập nhật!");
      } else if (response.ok) {
        alert("Cập nhật thành công!");
        fetchUsers(); // Cập nhật danh sách chuyên gia
        handleClose(); // Đóng dialog
      } else {
        const errorData = await response.json();
        alert(`Cập nhật thất bại! Lỗi: ${errorData.message || "Không rõ lỗi"}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };
  
  
  return (
    <div style={{ padding: "120px" }}>
      <h2>Quản lý Chuyên gia</h2>
      <Link to="/admin-users">
        <Button variant="outlined" style={{ marginBottom: "20px" }}>Quay lại</Button>
      </Link>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Chứng chỉ</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experts.map((expert) => (
              <TableRow key={expert.id}>
                <TableCell>{expert.id}</TableCell>
                <TableCell><Avatar src={expert.avatar} alt="Avatar" /></TableCell>
                <TableCell>{expert.name}</TableCell>
                <TableCell>{expert.phone}</TableCell>
                <TableCell>{expert.address}</TableCell>
                <TableCell>{expert.username}</TableCell>
                
                <TableCell>{expert.email}</TableCell>
                <TableCell>{expert.specialty}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEditClick(expert)}>✏️ Chỉnh sửa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       {/* Hộp thoại chỉnh sửa */}
       <Dialog open={open} onClose={handleClose}>
  <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
  <DialogContent>
    {selectedExpert && (
      <>
        <TextField
          margin="dense"
          label="Tên"
          name="name"
          fullWidth
          value={selectedExpert.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Username"
          name="username"
          fullWidth
          value={selectedExpert.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Mật khẩu (bỏ trống nếu không đổi)"
          type="password"
          name="password"
          fullWidth
          value={selectedExpert.password || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          fullWidth
          value={selectedExpert.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Số điện thoại"
          name="phone"
          fullWidth
          value={selectedExpert.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Địa chỉ"
          name="address"
          fullWidth
          value={selectedExpert.address}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Chuyên môn"
          name="specialty"
          fullWidth
          value={selectedExpert.specialty || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Avatar URL"
          name="avatar"
          fullWidth
          value={selectedExpert.avatar || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Chứng chỉ (cách nhau bằng dấu phẩy)"
          name="certificates"
          fullWidth
          value={selectedExpert.certificates?.join(", ") || ""}
          onChange={(e) =>
            setSelectedExpert({
              ...selectedExpert,
              certificates: e.target.value.split(",").map((c) => c.trim()),
            })
          }
        />
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="secondary">
      Hủy
    </Button>
    <Button onClick={handleSave} color="primary">
      Lưu
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default ExpertManagement;
