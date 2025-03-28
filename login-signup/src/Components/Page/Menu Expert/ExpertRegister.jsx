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
    certificates: [{ certificateName: "", certificateUrl: "" }],
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    if (field) {
      // Nếu field được truyền vào (certificateName hoặc certificateUrl)
      setFormData((prevState) => {
        const updatedCertificates = [...prevState.certificates];
        updatedCertificates[index] = {
          ...updatedCertificates[index],
          [field]: value, // Chỉ cập nhật trường cụ thể
        };
        return { ...prevState, certificates: updatedCertificates };
      });
    } else {
      // Xử lý các field khác
      const { name } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleAddCertificate = () => {
    setFormData((prevState) => ({
      ...prevState,
      certificates: [...prevState.certificates, { certificateName: "", certificateUrl: "" }],
    }));
  };
  
  const handleRemoveCertificate = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      certificates: prevState.certificates.filter((_, i) => i !== index),
    }));
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
      console.log(JSON.stringify(formData, null, 2));
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
<select
  name="specialty"
  value={formData.specialty}
  onChange={handleChange}
  required
>
  <option value="">-- Chọn chuyên môn --</option>
  <option value="TAMLY">Tâm lý</option>
  <option value="TAICHINH">Tài chính</option>
  <option value="GIADINH">Gia đình</option>
  <option value="SUCKHOE">Sức khỏe</option>
  <option value="GIAOTIEP">Giao tiếp</option>
  <option value="TONGIAO">Tôn giáo</option>
</select>

        <label>Ảnh đại diện (URL):</label>
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} required />
        <label>Chứng chỉ:</label>
{formData.certificates.map((certificate, index) => (
  <div key={index} className={styles["certificate-container"]}>
    <div className={styles["certificate-group"]}>
      <label>URL chứng chỉ:</label>
      <input
        type="text"
        value={certificate.certificateUrl}
        onChange={(e) => handleChange(e, index, "certificateUrl")}
        placeholder="URL chứng chỉ"
        required
      />
    </div>
    <div className={styles["certificate-group"]}>
      <label>Tên chứng chỉ:</label>
      <input
        type="text"
        value={certificate.certificateName}
        onChange={(e) => handleChange(e, index, "certificateName")}
        placeholder="Tên chứng chỉ"
        required
      />
    </div>
    {index > 0 && (
      <button
        type="button"
        onClick={() => handleRemoveCertificate(index)}
        className={styles["remove-btn"]}
      >
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
