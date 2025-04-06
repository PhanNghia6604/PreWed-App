import React, {useEffect} from "react"
import { Heading } from "../Common/Heading"
import { services } from "../fake data/data"

export const Services = () => {
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
    <>
      <section className='services fade-in'>
        <div className='container'>
          <Heading title='Services' />
          <div className='content grid3'>
            {services.map((item) => (
              <div className='box' >
                <i>{item.icon}</i>
                <h3>{item.title}</h3>
                <p style={{ color: "white" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}