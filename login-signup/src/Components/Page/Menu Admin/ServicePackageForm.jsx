import { useState } from "react";
import styles from "./ServicePackageForm.module.css";

const ServicePackageForm = ({ setPackages }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      const response = await fetch("/api/servicepackage", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          
         },
        

        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration, 10)
        })
      });
      if (!response.ok) throw new Error("Không thể tạo gói dịch vụ");
      const newPackage = await response.json();
      setPackages((prev) => [...prev, newPackage]);
      alert("Gói dịch vụ đã được tạo thành công!");
      setFormData({ name: "", description: "", price: "", duration: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tạo Gói Dịch Vụ</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Tên gói dịch vụ" className={styles.input} required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Mô tả" className={styles.textarea} required></textarea>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Giá" className={styles.input} required />
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Thời gian (phút)" className={styles.input} required />
        <button type="submit" className={styles.button}>Tạo</button>
      </form>
    </div>
  );
};

export default ServicePackageForm;
