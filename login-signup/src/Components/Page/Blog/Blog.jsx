import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heading } from '../../Common/Heading';

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/blogs',{
      method: "GET",
      headers: { "Accept": "application/json" },
    }) 
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error('Error fetching blogs:', error));
  }, []);

  return (
    // <section className='blog'>
    //   <div className="container">
    //     <Heading title='Blog' />
    //     <div className='content grid3'>
    //       {blogs.map((item) => (
    //         <div className="box" key={item.id}>
    //           <Link to={`/blog/${item.id}`}>
    //             <div className="img">
    //               <img src={item.imagePath} alt={item.title} />
    //             </div>
    //             <div className="text">
    //               <h3>{item.title}</h3>
    //             </div>
    //           </Link>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </section>
    <div>Trong</div>
  );
};
