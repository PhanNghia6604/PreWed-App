import React, {useEffect} from 'react'
import { Heading } from '../Common/Heading'
import {blog} from '../fake data/data'

export const Blog = () => {
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
        <section className='blog fade-in'>
            <div className="container">
                <Heading title='Blog'/>
                <div className='content grid3'>
                {blog.map((item) => {
               return(
                    <div className="box ">
                        <div className="img">
                            <img src ={item.cover} alt=''/>
                        </div>
                        <div className="text">
                            <h3>{item.title}</h3>
                            <label>
                             By {item.author} {item.date}
                            </label>
                            <p>{item.desc}</p>
                        </div>
                    </div>
               )
                    })}
            </div>
            </div>
        </section>
    </>
  )
}
