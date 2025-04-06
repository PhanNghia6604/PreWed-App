import React from 'react'
import { home } from '../fake data/data'
import { Link, useNavigate } from 'react-router-dom'
import Typewriter from 'typewriter-effect'

export const Hero = () => {
  const navigate = useNavigate();

  // Kiểm tra nếu người dùng đã đăng nhập
  const isLoggedIn = localStorage.getItem("user"); // Kiểm tra thông tin người dùng trong localStorage

  // Hàm xử lý khi nhấn nút
  const handleButtonClick = () => {
    if (!isLoggedIn) {
      navigate("/login"); // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    } else {
      navigate("/test"); // Nếu đã đăng nhập, tiếp tục đến trang kiểm tra
    }
  };
  return (
    <section className='hero'>
      {home.map((val, i) => (
        <div className="heroContent" key={i}>
          <h3>{val.text}</h3>
          <h1>
            <Typewriter 
              options={{
                strings: [`${val.name}`, `${val.post}`, `${val.design}`],
                autoStart: true,
                loop: true
              }} 
            />
          </h1>
          <p style={{ color: "white" }}>{val.desc}</p>

           {/* Thêm div bao quanh nút để có hiệu ứng gradient */}
      {/* Liên kết đến trang "Premarital Test" */}
      <button onClick={handleButtonClick} className="premaritalTestBtn">
  <span>Start Now</span>
</button>

        </div>
      ))}
    </section>
  )
}
