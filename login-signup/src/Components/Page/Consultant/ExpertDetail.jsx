import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./ExpertDetail.module.css";

export const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    const foundExpert = storedExperts.find((exp) => exp.id === Number(id));

    setExpert(foundExpert);
    setUser(storedUser);
    setSelectedPackage(foundExpert?.consultingPrices?.[0] || "");
  }, [id]);

  if (!expert) {
    return <div className={style.notFound}>Chuyên gia không tồn tại!</div>;
  }

  const handleBooking = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt lịch!");
      return;
    }
    setShowForm(true);
  };

  const handleConfirmBooking = () => {
    if (!date || !selectedPackage) {
      alert("Vui lòng chọn ngày bắt đầu và gói dịch vụ!");
      return;
    }
  
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
    
    // Lấy ID cao nhất hiện có
    const lastId = userBookings.length > 0 ? Math.max(...userBookings.map(b => b.id)) : 0;
    const newId = lastId + 1; // ID mới = ID lớn nhất + 1
  
    const booking = {
      id: newId, // ID tự tăng
      expertId: id,
      expertName: expert.name,
      date,
      packageName: selectedPackage,
      status: "Chờ thanh toán",
    };
  
    // Lưu vào localStorage
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify([...userBookings, booking]));
    setShowForm(false);
    alert("Đặt lịch thành công!");
    navigate("/my-booking");
  };
  

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.avatarContainer}>
          {expert.avatar ? (
            <img src={expert.avatar} alt={expert.name} className={style.avatar} />
          ) : (
            <div className={style.avatarPlaceholder}>Chưa có ảnh</div>
          )}
        </div>
        <h2>{expert.name}</h2>
        <p><strong>Chuyên môn:</strong> {expert.specialty}</p>
        <p><strong>Số điện thoại:</strong> {expert.phone}</p>
        <p><strong>Email:</strong> {expert.email}</p>
        <p><strong>Địa chỉ:</strong> {expert.address}</p>
        <p><strong>Kinh nghiệm:</strong> {expert.experience || "Chưa có"} năm</p>

        <div className={style.certifications}>
          <h3>Bằng cấp & Chứng chỉ:</h3>
          <ul>
            {expert.certificates.length > 0 ? (
              expert.certificates.map((cert, index) => <li key={index}>{cert}</li>)
            ) : (
              <li>Không có chứng chỉ nào</li>
            )}
          </ul>
        </div>

        <h3 class="h">Các gói tư vấn:</h3>
        <ul>
          {expert.consultingPrices.length > 0 ? (
            expert.consultingPrices.map((pkg, index) => <li key={index}>{pkg}</li>)
          ) : (
            <li>Chưa có gói tư vấn</li>
          )}
        </ul>

       

        <button className={style.bookButton} onClick={handleBooking}>Đặt lịch tư vấn</button>

        {showForm && (
          <div className={style.bookingForm}>
            <h3>Đặt lịch tư vấn với {expert.name}</h3>
            <label class="lable">Ngày bắt đầu</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <label class="lable">Chọn gói dịch vụ:</label>
            <select value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}>
              {expert.consultingPrices.map((pkg, index) => (
                <option key={index} value={pkg}>{pkg}</option>
              ))}
            </select>
            <button onClick={handleConfirmBooking}>Xác nhận gói dịch vụ</button>
          </div>
        )}
      </div>
    </div>
  );
};
