// src/pages/Blog.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Heading } from '../../Common/Heading'
import { blog } from '../../fake data/data'

export const Blog = () => {
  return (
    <section className='blog'>
      <div className="container">
        <Heading title='Blog' />
        <div className='content grid3'>
          {blog.map((item) => (
            <div className="box" key={item.id}>
              <Link to={`/blog/${item.id}`}>
                <div className="img">
                  <img src={item.cover} alt={item.title} />
                </div>
                <div className="text">
                  <h3>{item.title}</h3>
                  <label>By {item.author} | {item.date}</label>
                  <p>{item.desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
