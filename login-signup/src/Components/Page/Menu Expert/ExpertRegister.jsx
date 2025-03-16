import React, { useState } from "react";
import styles from "./ExpertRegister.module.css"; // Import CSS Module
import { useNavigate } from "react-router-dom";

const ExpertRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    specialty: "",
    avatar: "", // Thêm avatar
    certificates: [""],
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "certificates") {
      const updatedCertificates = [...formData.certificates];
      updatedCertificates[index] = value;
      setFormData({ ...formData, certificates: updatedCertificates });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddCertificate = () => {
    setFormData({ ...formData, certificates: [...formData.certificates, ""] });
  };

  const handleRemoveCertificate = (index) => {
    const updatedCertificates = formData.certificates.filter((_, i) => i !== index);
    setFormData({ ...formData, certificates: updatedCertificates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/expert/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Đăng ký thành công!");
        
        setFormData({
          username: "",
          password: "",
          name: "",
          email: "",
          phone: "",
          address: "",
          specialty: "",
          avatar: "",
          certificates: [""],
        });
        navigate("/expert-login");
      
      } else {
        setMessage(result.message || "Đăng ký thất bại");
      }
    } catch (error) {
      setMessage("Lỗi kết nối đến server");
    }
  };

  return (
    <div className={styles["register-container"]}>
      <h2>Đăng ký chuyên gia</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <label>Họ và tên:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Số điện thoại:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Địa chỉ:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>Chuyên môn:</label>
        <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} required />

        <label>Ảnh đại diện (URL):</label>
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} required />

        <label>Chứng chỉ:</label>
        {formData.certificates.map((certificate, index) => (
          <div key={index} className={styles["certificate-group"]}>
            <input
              type="text"
              name="certificates"
              value={certificate}
              onChange={(e) => handleChange(e, index)}
              required
            />
            {index > 0 && (
              <button type="button" onClick={() => handleRemoveCertificate(index)} className={styles["remove-btn"]}>
                Xóa
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddCertificate} className={styles["add-btn"]}>
          + Thêm chứng chỉ
        </button>

        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default ExpertRegister;
