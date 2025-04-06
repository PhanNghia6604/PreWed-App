import React, { useEffect } from 'react'
import { about } from '../fake data/data'
import { Heading } from '../Common/Heading'

export const About = () => {
  useEffect(() => {
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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Kiểm tra ngay khi trang tải

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <>
       <section className='about'>
           <div className="container flex">
              {about.map((val,i) => (
                <>
                
                <div className="left fade-in">
                    <img src={val.cover} alt=''/>
                </div>
                <div className="right fade-in">
                    <Heading title='About Us'/>
                    <p style={{ color: "white" }}>{val.desc}</p>
                    <p style={{ color: "white" }}>{val.desc1}</p>
                </div>
                </>
              ))}
           </div>
         </section> 
    </>
  )
}
