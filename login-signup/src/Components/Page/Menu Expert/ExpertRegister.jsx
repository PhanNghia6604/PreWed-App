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
      newErrors.username = "Tên người dùng không thể để trống!";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Họ và tên không thể để trống.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không thể để trống";
    } else if (!/^\d{9,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có từ 9 đến 11 chữ số.";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không thể để trống";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email không thể để trống";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ, phải chứa '@'.";
    }
    if (!formData.avatar.trim()) {
      newErrors.avatar = "URL ảnh đại diện không thể để trống";
    }

    // Kiểm tra specialty
    if (formData.specialty.length === 0) {
      newErrors.specialty = "Vui lòng chọn ít nhất một chuyên môn";  // Hiển thị lỗi nếu không có chuyên môn nào được chọn
    } else {
      delete newErrors.specialty;  // Nếu có ít nhất một chuyên môn được chọn, loại bỏ lỗi
    }

    formData.certificates.forEach((certificate, index) => {
      if (!certificate.certificateUrl.trim()) {
        newErrors[`certificateUrl${index}`] = "URL chứng chỉ không thể để trống";
      }
      if (!certificate.certificateName.trim()) {
        newErrors[`certificateName${index}`] = "Tên chứng chỉ không thể để trống";
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
        setMessage("Đăng ký thành công!");
        alert("Bạn đã đăng ký thành công! Vui lòng đợi email phê duyệt từ admin.");
        navigate("/expert-login");
      } else {
        setMessage(result.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      setMessage("Lỗi kết nối đến server.");
    }
  };

  return (
    <div className={styles["register-container"]} id="expert-register-h2">
      <h2 >Đăng ký Chuyên Gia</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit} id="expert-register-form">
        <label>Tên người dùng:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} onBlur={validateForm} required />
        {errors.username && <p className={styles.error}>{errors.username}</p>}

        <label>Mật khẩu:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={() => validateForm("password")} required />
        {errors.password && <p className={styles.error}>{errors.password}</p>}

        <label>Họ và tên:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={validateForm} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={() => validateForm("email")} required />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label>Số điện thoại:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} onBlur={() => validateForm("phone")} required />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}

        <label>Địa chỉ:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={validateForm} required />

        <label>Chuyên môn:</label>
        <select name="specialty" value={formData.specialty[0] || ""} onChange={handleSelectChange} required>
          <option value="">Chọn chuyên môn</option>
          <option value="TAMLY">Tâm lý</option>
          <option value="TAICHINH">Tài chính</option>
          <option value="GIADINH">Gia đình</option>
          <option value="SUCKHOE">Sức khỏe</option>
          <option value="GIAOTIEP">Giao tiếp</option>
          <option value="TONGIAO">Tôn giáo</option>
          <option value="ALL">Tất cả chuyên môn</option>
        </select>
        {errors.specialty && <p className={styles.error}>{errors.specialty}</p>}

        <label>Ảnh đại diện (URL):</label>
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} onBlur={validateForm} required />
        {errors.avatar && <p className={styles.error}>{errors.avatar}</p>}

        <label>Chứng chỉ:</label>
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
        <button id="expert-register-submit" type="submit">
  Đăng ký
</button>

      </form>
    </div>
  );
};

export default ExpertRegister;
