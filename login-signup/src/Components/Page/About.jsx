import React from 'react'
import { about } from '../fake data/data'
import { Heading } from '../Common/Heading'

export const About = () => {
  return (
    <>
       <section className='about'>
           <div className="container flex">
              {about.map((val,i) => (
                <>
                <div className="left">
                    <img src={val.cover} alt=''/>
                </div>
                <div className="right">
                    <Heading title='About Us'/>
                    <p>{val.desc}</p>
                    <p>{val.desc1}</p>
                </div>
                </>
              ))}
           </div>
         </section> 
    </>
  )
}
