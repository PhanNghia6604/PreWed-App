import React, {useEffect} from 'react'
import { project } from '../fake data/data'
import CountUp from 'react-countup'

export const Counter = () => {
    useEffect(() => {
          // Hàm kiểm tra khi phần tử xuất hiện trong tầm nhìn
          const handleScroll = () => {
            const elements = document.querySelectorAll('.fade-in');
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
        <div className="hero counter fade-in">
            <div className="container grid3 grid4">
                {project.map((item) => (
                    <div className="box">
                        <i>{item.icon}</i>
                        <h1 className='heading'>
                            <CountUp enableScrollby duration={2} end ={item.num}/>
                        </h1>
                        <h3 style={{ color: "white" }}>{item.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    </>
  )
}
