import React, { useState, useEffect } from "react";
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
    specialty: [],  // Lưu danh sách chuyên môn
    avatar: "",
    certificates: [{ certificateName: "", certificateUrl: "" }],
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (field) => {
    let newErrors = { ...errors };

    // Validate các trường thông tin
    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty!";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Full name cannot be empty.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number cannot be empty";
    } else if (!/^\d{9,11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be between 9 and 11 digits.";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address cannot be empty";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email, must contain '@'.";
    }
    if (!formData.avatar.trim()) {
      newErrors.avatar = "Avatar URL cannot be empty";
    }

    // Kiểm tra specialty
    if (formData.specialty.length === 0) {
      newErrors.specialty = "Please select at least one specialty";  // Hiển thị lỗi nếu không có chuyên môn nào được chọn
    } else {
      delete newErrors.specialty;  // Nếu có ít nhất một chuyên môn được chọn, loại bỏ lỗi
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

  useEffect(() => {
    // Gọi validateForm mỗi khi formData.specialty thay đổi
    validateForm();
  }, [formData.specialty]);  // Lắng nghe sự thay đổi của formData.specialty

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

  const handleSelectChange = (e) => {
    const selectedSpecialty = e.target.value;

    if (selectedSpecialty === "ALL") {
      // Nếu người dùng chọn "ALL", ta chỉ cần gửi giá trị "ALL" và backend sẽ xử lý
      setFormData({ ...formData, specialty: ["ALL"] });
    } else {
      // Nếu người dùng chọn một chuyên môn cụ thể, ta chỉ lưu chuyên môn đó
      setFormData({ ...formData, specialty: [selectedSpecialty] });
    }
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
        setMessage("Registration successful!");
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
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={() => validateForm("phone")} required />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={validateForm} required />

        <label>Specialties:</label>
        <select name="specialty"   value={formData.specialty[0] || ""} onChange={handleSelectChange} required>
          <option value="">Select Specialty</option>
          <option value="TAMLY">Tâm lý</option>
          <option value="TAICHINH">Tài chính</option>
          <option value="GIADINH">Gia đình</option>
          <option value="SUCKHOE">Sức khỏe</option>
          <option value="GIAOTIEP">Giao tiếp</option>
          <option value="TONGIAO">Tôn giáo</option>
          <option value="ALL">Tất cả chuyên môn</option>
        </select>
        {errors.specialty && <p className={styles.error}>{errors.specialty}</p>}

        <label>Avatar (URL):</label>
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} onBlur={validateForm} required />
        {errors.avatar && <p className={styles.error}>{errors.avatar}</p>}

        <label>Certificates:</label>
        {formData.certificates.map((certificate, index) => (
          <div key={index} className={styles["certificate-container"]}>
            <label>URL chứng chỉ:</label>
            <input type="text" value={certificate.certificateUrl} onChange={(e) => handleChange(e, index, "certificateUrl")} onBlur={validateForm} required />
            {errors[`certificateUrl${index}`] && <p className={styles.error}>{errors[`certificateUrl${index}`]}</p>}

            <label>Tên chứng chỉ:</label>
            <input type="text" value={certificate.certificateName} onChange={(e) => handleChange(e, index, "certificateName")} onBlur={validateForm} required />
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
