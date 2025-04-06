import React, { useState } from "react";
import styles from "./ServicePackageEdit.module.css";

const ServicePackageEdit = ({ packageData, setPackages, setEditingPackage }) => {
  const [formData, setFormData] = useState({ ...packageData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    if (!token) {
      alert("Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
      return;
    }
  
    try {
      const response = await fetch(`/api/servicepackage/${packageData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Thêm token vào header
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration, 10),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Cập nhật gói dịch vụ thất bại");
      }
  
      const updatedPackage = await response.json();
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === updatedPackage.id ? updatedPackage : pkg))
      );
      setEditingPackage(null);
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Chỉnh sửa Gói Dịch Vụ</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tên gói dịch vụ"
          className={styles.input}
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mô tả"
          className={styles.textarea}
          required
        ></textarea>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Giá"
          className={styles.input}
          required
        />
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Thời gian (phút)"
          className={styles.input}
          required
        />
        <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButtonEdit}>Lưu</button>
        <button type="button" className={styles.cancelButtonEdit} onClick={() => setEditingPackage(null)}>Hủy</button>

        </div>
      </form>
    </div>
  );
};

export default ServicePackageEdit;