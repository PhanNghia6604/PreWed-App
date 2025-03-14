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
      const response = await fetch("/api/slots");
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error("Lỗi khi lấy slot: ", error);
    }
  };

  const handleCreateSlot = async () => {
    try {
      await fetch("api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });
      fetchSlots();
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo slot: ", error);
    }
  };

  return (
    <div style={{ padding: "100px" }}>
      <h2>Quản lý Slot Đặt Lịch</h2>
      
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">Không có dữ liệu</TableCell>
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
