import React , {useEffect} from 'react'

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
  useEffect(() => {
    // Hàm kiểm tra khi phần tử xuất hiện trong tầm nhìn
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade in');
      elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Nếu phần tử trong cửa sổ, thêm class 'visible'
        if (position < windowHeight) {
          element.classList.add('visible');
        }
      });
    };
    // Lắng nghe sự kiện cuộn trang
    window.addEventListener('scroll', handleScroll);

    // Kiểm tra ngay khi trang được tải
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="hero">
      {home.map((val, i) => (
        <div className="heroContent fade-in" key={i}>
          <h3 id='welcome-text'>{val.text}</h3>
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
          <button onClick={handleButtonClick} className="premaritalTestBtn">
            <span>Start Now</span>
          </button>
        </div>
      ))}
    </section>
  );
};