import React from 'react'
import { home } from '../fake data/data'
import { Link } from 'react-router-dom'
import Typewriter from 'typewriter-effect'

export const Hero = () => {
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
          <p>{val.desc}</p>

          {/* Liên kết đến trang "Premarital Test" */}
          <Link to="/test" className="premaritalTestBtn">Premarital Test</Link>
        </div>
      ))}
    </section>
  )
}
