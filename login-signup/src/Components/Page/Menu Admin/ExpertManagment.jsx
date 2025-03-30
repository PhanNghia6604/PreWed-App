import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import style from "./ExpertManagement.module.css";

const specialtyMap = {
  TAMLY: "Tâm lý",
  TAICHINH: "Tài chính",
  GIADINH: "Gia đình",
  SUCKHOE: "Sức khỏe",
  GIAOTIEP: "Giao tiếp",
  TONGIAO: "Tôn giáo",
};

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
      // Lọc theo roleEnum === Expert và điều kiện approved phải là true mới xuất hiện data lên
      const filteredData = data.filter(user => user.roleEnum === "EXPERT" && user.approved === true);
      setExperts(filteredData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  const handleEditClick = (expert) => {
    setSelectedExpert(expert);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedExpert(null);
  };

  const handleChange = (e) => {
    setSelectedExpert({
      ...selectedExpert,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn chưa đăng nhập hoặc token không tồn tại!");
      return;
    }

    // Lấy danh sách chứng chỉ hiện tại từ backend để so sánh
    const originalExpert = experts.find(ex => ex.id === selectedExpert.id);
    const originalCertificates = originalExpert ? originalExpert.certificates : [];

    // Nếu certificates không thay đổi, giữ nguyên danh sách cũ
    const updatedCertificates = selectedExpert.certificates?.length
      ? Array.from(new Set(selectedExpert.certificates))
      : originalCertificates;

    try {
      const response = await fetch(`/api/expert/expert/${selectedExpert.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: selectedExpert.username,
          name: selectedExpert.name,
          email: selectedExpert.email,
          phone: selectedExpert.phone,
          address: selectedExpert.address,
          specialty: selectedExpert.specialty || "",
          avatar: selectedExpert.avatar || "",
          certificates: updatedCertificates, // Đảm bảo không bị duplicate
        }),
      });
      const responseData = await response.json();
      console.log("Dữ liệu trả về từ API:", responseData);
      if (response.status === 401) {
        alert("Token hết hạn hoặc bạn không có quyền cập nhật!");
      } else if (response.ok) {
        alert("Cập nhật thành công!");
        fetchUsers();
        handleClose();
      } else {
        const errorData = await response.json();
        alert(`Cập nhật thất bại! Lỗi: ${errorData.message || "Không rõ lỗi"}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };



  return (
    <div className={style.container}>
      <h2 className={style.title}>Quản lý Chuyên gia</h2>

      <TableContainer component={Paper} className={style.tableContainer}>
        <Table className={style.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Chuyên môn</TableCell>
              <TableCell>Chứng chỉ</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experts.map((expert) => (
              <TableRow key={expert.id} className={style.tableRow}>
                <TableCell>{expert.id}</TableCell>
                <TableCell>
                  <Avatar src={expert.avatar} alt="Avatar" className={style.avatar} />
                </TableCell>
                <TableCell>{expert.name}</TableCell>
                <TableCell>{expert.phone}</TableCell>
                <TableCell>{expert.address}</TableCell>
                <TableCell>{expert.username}</TableCell>
                <TableCell>{expert.email}</TableCell>
                <TableCell>{specialtyMap[expert.specialty] || "Không xác định"}</TableCell>
                <TableCell>
                  <ul>
                    {Array.from(new Set(expert.certificates.map(cert => cert.certificateUrl)))
                      .map((url, index) => {
                        const cert = expert.certificates.find(cert => cert.certificateUrl === url);
                        return (
                          <li key={index}>
                            <a href={cert.certificateUrl} target="_blank">{cert.certificateName}</a>
                          </li>
                        );
                      })}
                  </ul>
                </TableCell>
                <TableCell className={style.actionButtons}>
                  <Button
                    variant="contained"
                    className={style.approveBtn}
                    onClick={() => handleEditClick(expert)}
                  >
                    ✏️ Chỉnh sửa
                  </Button>
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
                className={style.inputField}
              />
              <TextField
                margin="dense"
                label="Username"
                name="username"
                fullWidth
                value={selectedExpert.username}
                onChange={handleChange}
                className={style.inputField}
              />
              <TextField
                margin="dense"
                label="Email"
                name="email"
                fullWidth
                value={selectedExpert.email}
                onChange={handleChange}
                className={style.inputField}
              />
              <TextField
                margin="dense"
                label="Số điện thoại"
                name="phone"
                fullWidth
                value={selectedExpert.phone}
                onChange={handleChange}
                className={style.inputField}
              />
              <TextField
                margin="dense"
                label="Địa chỉ"
                name="address"
                fullWidth
                value={selectedExpert.address}
                onChange={handleChange}
                className={style.inputField}
              />
              <TextField
                margin="dense"
                label="Chuyên môn"
                name="specialty"
                fullWidth
                value={selectedExpert.specialty || ""}
                onChange={handleChange}
                className={style.inputField}
              />
              <TextField
                margin="dense"
                label="Avatar URL"
                name="avatar"
                fullWidth
                value={selectedExpert.avatar || ""}
                onChange={handleChange}
                className={style.inputField}
              />
              {/* <TextField
                margin="dense"
                label="Chứng chỉ (cách nhau bằng dấu phẩy)"
                name="certificates"
                fullWidth
                value={selectedExpert.certificates?.join(", ") || ""}
                onChange={(e) => {
                  const uniqueCertificates = Array.from(new Set(e.target.value.split(",").map((c) => c.trim())));
                  setSelectedExpert({
                    ...selectedExpert,
                    certificates: uniqueCertificates,
                  });
                }}
                className={style.inputField}
              /> */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className={style.rejectBtn}>
            Hủy
          </Button>
          <Button onClick={handleSave} className={style.approveBtn}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <div className={style.backButtonContainer}>
        <Link to="/admin-users">
          <Button variant="outlined" className={style.backButton}>
            Quay lại
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ExpertManagement;
