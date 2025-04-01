import React, { useState } from "react";
import styles from "./ExpertRegister.module.css";
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
    avatar: "",
    certificates: [{ certificateName: "", certificateUrl: "" }],
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (field) => {
    let newErrors = { ...errors };
  
    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty!";
    }
    if (field === "password" || !field) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Password cannot be empty!";
      } else if (!/^\d{8,10}$/.test(formData.phone)) {
        newErrors.phone = "Password must be between 8 and 10 characters";
      } else {
        delete newErrors.phone;
      }
    }
    if (!formData.name.trim()) {
      newErrors.name= "Full name cannot be empty."
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address cannot be empty"
    }
    if (field === "phone" || !field) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number cannot be empty";
      } else if (!/^\d{9,11}$/.test(formData.phone)) {
        newErrors.phone = "Phone number must be between 9 and 11 digits.";
      } else {
        delete newErrors.phone;
      }
    }
    
  if (field === "email" || !field) {
    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email, must contain '@'.";
    } else {
      delete newErrors.email;
    }
  }
    if (!formData.avatar.trim()) {
      newErrors.avatar = "Avatar URL cannot be empty";
    }
    if (!formData.specialty.trim()) {
      newErrors.specialty = "Please select a specialty";
    }
  
    formData.certificates.forEach((certificate, index) => {
      if (!certificate.certificateUrl.trim()) {
        newErrors[`certificateUrl${index}`] = "Certificate URL cannot be empty";
      }
      if (!certificate.certificateName.trim()) {
        newErrors[`certificateName${index}`] = "Certificate name cannot be empty";
      }
    });
  
    setErrors(newErrors);
    
  return Object.keys(newErrors).length === 0;
  };
  

  const handleChange = (e, index, field) => {
    const { value, name } = e.target;
    let newErrors = { ...errors };
  
    if (field) {
      setFormData((prevState) => {
        const updatedCertificates = [...prevState.certificates];
        updatedCertificates[index] = { ...updatedCertificates[index], [field]: value };
        return { ...prevState, certificates: updatedCertificates };
      });
  
      if (value.trim()) {
        delete newErrors[`${field}${index}`]; // Xóa lỗi khi người dùng nhập đúng
      }
    } else {
      setFormData({ ...formData, [name]: value });
  
      if (value.trim()) {
        delete newErrors[name]; // Xóa lỗi khi người dùng nhập đúng
      }
    }
  
    setErrors(newErrors);
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
    
    if (!validateForm()) {
      console.log("Form không hợp lệ, dừng submit.");
      return; // ❌ Dừng lại nếu có lỗi
    }
  
    try {
      const response = await fetch("/api/expert/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        setMessage(" Registration successful!");
        alert("You have successfully registered! Please wait for the approval email from the admin.");
        navigate("/expert-login");
      } else {
        setMessage(result.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      setMessage("Lỗi kết nối đến server.");
    }
  };


  return (
    <div className={styles["register-container"]}>
      <h2>Expert Registration</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} onBlur={validateForm} required />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={() => validateForm("password")} required />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label>Full Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={validateForm} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => validateForm("email")} required />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label>Phone:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange}   onBlur={() => validateForm("phone")} required />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={validateForm} required />

        <label> Specialty:</label>
        <select name="specialty" value={formData.specialty} onChange={handleChange} onBlur={validateForm} required>
          <option value="">--  Select a specialty --</option>
          <option value="TAMLY">Tâm lý</option>
          <option value="TAICHINH">Tài chính</option>
          <option value="GIADINH">Gia đình</option>
          <option value="SUCKHOE">Sức khỏe</option>
          <option value="GIAOTIEP">Giao tiếp</option>
          <option value="TONGIAO">Tôn giáo</option>
        </select>
        {errors.specialty && <p className={styles.error}>{errors.specialty}</p>}

        <label> Avatar (URL):</label>
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} onBlur={validateForm} required />
        {errors.avatar && <p className={styles.error}>{errors.avatar}</p>}

        <label>Certificates:</label>
        {formData.certificates.map((certificate, index) => (
          <div key={index} className={styles["certificate-container"]}>
            <label>URL chứng chỉ:</label>
            <input type="text" value={certificate.certificateUrl} onChange={(e) => handleChange(e, index, "certificateUrl")} onBlur={validateForm} required />
            {errors[`certificateUrl${index}`] && <p className={styles.error}>{errors[`certificateUrl${index}`]}</p>}

            <label>Tên chứng chỉ:</label>
            <input type="text" value={certificate.certificateName} onChange={(e) => handleChange(e, index, "certificateName")}  onBlur={validateForm} required />
            {errors[`certificateName${index}`] && <p className={styles.error}>{errors[`certificateName${index}`]}</p>}

            {index > 0 && <button type="button" onClick={() => handleRemoveCertificate(index)}>Xóa</button>}
          </div>
        ))}
        <button type="button" onClick={handleAddCertificate}>+ Thêm chứng chỉ</button>
        <button type="submit">Đăng ký</button>
      </form>
      
    </div>
  );
};

export default ExpertRegister;
