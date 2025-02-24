import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { experts, servicePackages } from "../../fake data/data";
import style from "./ExpertDetail.module.css";

export const ExpertDetail = () => {
  const { id } = useParams();
  const expert = experts.find((exp) => exp.id === Number(id));
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [user, setUser] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(servicePackages[0] || null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  if (!expert) {
    return <div className={style.notFound}>Chuyên gia không tồn tại!</div>;
  }

  // Hàm tính ngày kết thúc dựa trên số buổi của gói dịch vụ
  const calculateEndDate = (startDate, sessions) => {
    if (!startDate) return ""; // Trả về chuỗi rỗng nếu ngày bắt đầu chưa chọn
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return ""; // Kiểm tra xem startDate có hợp lệ không

    const end = new Date(start);
    end.setDate(start.getDate() + sessions - 1);

    // Format theo MM/DD/YY
    const month = String(end.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0 nên +1
    const day = String(end.getDate()).padStart(2, "0");
    const year = String(end.getFullYear()).slice(-2); // Lấy 2 chữ số cuối của năm

    return `${month}/${day}/${year}`;
  };
  const handleBooking = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt lịch!");
      return;
    }
    setSelectedPackage(servicePackages[0]); // Chọn gói mặc định
    setShowForm(true);
  };

  const handleConfirmBooking = () => {
    if (!date) {
      alert("Vui lòng chọn ngày bắt đầu!");
      return;
    }
    if (!selectedPackage) {
      alert("Vui lòng chọn gói dịch vụ!");
      return;
    }

    console.log("Selected Package:", selectedPackage); // Kiểm tra giá trị

    const chosenPackage = selectedPackage; // Sửa lại chỗ này

    if (!chosenPackage) {
      alert("Gói dịch vụ không hợp lệ!");
      return;
    }

    console.log("Chosen Package:", chosenPackage);

    const calculatedEndDate = calculateEndDate(date, chosenPackage.sessionCount);

    const booking = {
      id: new Date().getTime(),
      expertId: id,
      expertName: expert.fullName,
      date,
      endDate: calculatedEndDate,
      packageName: chosenPackage.name,
      sessionCount: chosenPackage.sessionCount,
      status: "Chờ thanh toán",
    };

    const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`)) || [];
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify([...userBookings, booking]));

    setShowForm(false);
    alert("Đặt lịch thành công! Lịch đặt tư vấn");

    navigate('/my-booking');
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <img src={expert.avatar} alt={expert.fullName} className={style.avatar} />
        <h2>{expert.fullName}</h2>
        <p className={style.specialty}>{expert.specialty}</p>
        <p className={style.experience}>{expert.experience} năm kinh nghiệm</p>
        <p className={style.description}>{expert.description}</p>

        <div className={style.certifications}>
          <h3>Bằng cấp & Chứng chỉ:</h3>
          <ul>
            {expert.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>

        {user ? <p>Xin chào, {user.name}!</p> : <p>Bạn chưa đăng nhập.</p>}

        <button className={style.bookButton} onClick={handleBooking}>Đặt lịch tư vấn</button>

        {showForm && (
          <div className={style.bookingForm}>
            <h3>Đặt lịch tư vấn với {expert.fullName}</h3>
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <label>Chọn gói dịch vụ:</label>
            <select
              value={selectedPackage?.id}
              onChange={(e) => {
                const selected = servicePackages.find(pkg => pkg.id === e.target.value);
                setSelectedPackage(selected);
                console.log("Gói đã chọn:", selected);
              }}
            >
              {servicePackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {pkg.price.toLocaleString()} VND
                </option>
              ))}
            </select>

            <p><strong>Ngày kết thúc dự kiến:</strong>
              {date ? <span className={style.endDateDisplay}>{calculateEndDate(date, selectedPackage.sessionCount)}</span> : "Chưa chọn"}
            </p>



            <button onClick={handleConfirmBooking}>Xác nhận gói dịch vụ</button>
          </div>
        )}
      </div>
    </div>
  );
};
