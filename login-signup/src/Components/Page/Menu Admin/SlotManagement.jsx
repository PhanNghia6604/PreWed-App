import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import styles from "./SlotManagement.module.css"; // Import CSS module

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: "08:00", endTime: "19:00", duration: 60 });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch("/api/slots", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Không thể lấy danh sách slot");

      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error("Lỗi khi lấy slot: ", error);
    }
  };

  const handleCreateSlot = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔹 Lấy token từ localStorage

      if (!token) {
        throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
      }

      const response = await fetch("/api/slots", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSlot),
      });
      console.log("Token:", token);

      if (!response.ok) throw new Error("Không thể tạo slot");

      fetchSlots();
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo slot: ", error);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa slot này?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại!");

      const response = await fetch(`/api/slots/${slotId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa slot");
      }

      alert("Slot đã được xóa thành công!");
      fetchSlots();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };



  return (
    <div className={styles.container}
     style={{ padding: "100px" }}>
      <h2 className={styles.title}>Quản lý Slot Đặt Lịch</h2>

      {/* Nút tạo slot */}
      <Button
        variant="contained"
        className={styles.button} // Thêm class CSS
        onClick={() => setOpen(true)}
        style={{ marginBottom: "15px" }}
      >
        + Tạo Slot
      </Button>

      {/* Bảng hiển thị danh sách slot */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Bắt đầu</strong></TableCell>
              <TableCell><strong>Kết thúc</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.length > 0 ? (
              slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.id}</TableCell>
                  <TableCell>{slot.startTime}</TableCell>
                  <TableCell>{slot.endTime}</TableCell>
                  <TableCell>
                    <Button

                      variant="contained"
                      className={styles.button}
                      color="error"
                      onClick={() => handleDeleteSlot(slot.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Dialog tạo Slot */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Tạo Slot Mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Giờ bắt đầu"
            fullWidth
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Giờ kết thúc"
            fullWidth
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Thời gian (phút)"
            fullWidth
            type="number"
            value={newSlot.duration}
            onChange={(e) => setNewSlot({ ...newSlot, duration: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className={styles.button}>Hủy</Button>
          <Button onClick={handleCreateSlot} className={styles.button}>Tạo</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SlotManagement;
