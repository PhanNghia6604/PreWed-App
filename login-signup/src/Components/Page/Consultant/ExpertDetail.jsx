import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./ExpertDetail.module.css";

export const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
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
    if (!date || !time || !selectedPackage) {
      alert("Vui lòng chọn ngày, giờ và gói dịch vụ!");
      return;
    }
  
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
  
    const lastId = userBookings.length > 0 ? Math.max(...userBookings.map(b => b.id)) : 0;
    const newId = lastId + 1;
  
    // Chuyển đổi ngày thành thứ
    const daysMap = {
      "Monday": "Thứ 2",
      "Tuesday": "Thứ 3",
      "Wednesday": "Thứ 4",
      "Thursday": "Thứ 5",
      "Friday": "Thứ 6",
      "Saturday": "Thứ 7",
      "Sunday": "Chủ Nhật"
    };
    
    const selectedDayEnglish = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    const selectedDay = daysMap[selectedDayEnglish] || "";
  
    const booking = {
      id: newId,
      expertId: id,
      expertName: expert.name,
      userName: user.fullName || "Khách hàng chưa có tên",
      date,
      dayOfWeek: selectedDay, // 🆕 Lưu thứ vào lịch
      time,
      packageName: selectedPackage,
      status: "Chờ thanh toán",
    };
  
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify([...userBookings, booking]));
    setShowForm(false);
    alert("Đặt lịch thành công!");
    navigate("/my-booking");
  };
  

  const workingDays = expert.workingSchedule || [];

  const isDateDisabled = (selectedDate) => {
    const daysMap = {
      "Monday": "Thứ 2",
      "Tuesday": "Thứ 3",
      "Wednesday": "Thứ 4",
      "Thursday": "Thứ 5",
      "Friday": "Thứ 6",
      "Saturday": "Thứ 7",
      "Sunday": "Chủ Nhật"
    };
  
    const selectedDayEnglish = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    const selectedDay = daysMap[selectedDayEnglish] || "";
  
    console.log("Ngày được chọn:", selectedDay);
    console.log("Lịch làm việc:", workingDays);
    console.log("So sánh có khớp không?", workingDays.includes(selectedDay));
  
    return !workingDays.includes(selectedDay);
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

        <h3>Các gói tư vấn:</h3>
        <ul>
          {expert.consultingPrices.length > 0 ? (
            expert.consultingPrices.map((pkg, index) => <li key={index}>{pkg}</li>)
          ) : (
            <li>Chưa có gói tư vấn</li>
          )}
        </ul>
        
        <h3>Lịch làm việc:</h3>
        <ul>
          {workingDays.length > 0 ? (
            workingDays.map((day, index) => <li key={index}>{day}</li>)
          ) : (
            <li>Chưa cập nhật lịch làm việc</li>
          )}
        </ul>

        <button className={style.bookButton} onClick={handleBooking}>Đặt lịch tư vấn</button>

        {showForm && (
          <div className={style.bookingForm}>
            <h3>Đặt lịch tư vấn với {expert.name}</h3>
            <label>Ngày bắt đầu</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              min={new Date().toISOString().split("T")[0]} 
              onInput={(e) => {
                if (isDateDisabled(e.target.value)) {
                    e.target.value = "";
                    alert("Chuyên gia không làm việc vào ngày này!");
                }
              }}
            />
            <label>Chọn giờ hẹn</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
            />
            <label>Chọn gói dịch vụ:</label>
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
