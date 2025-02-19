import React from 'react'
import {home} from '../fake data/data'
import Typewriter from 'typewriter-effect'

export const Hero = () => {
  return (
    <>
       <section className='hero'>
            {home.map((val,i) => (
                <div className="heroContent">
                    <h3>{val.text}</h3>
                    <h1>
                        <Typewriter options ={{strings :  [`${val.username}`,`${val.post}`,`${val.design}`],
                        autoStart: true, loop: true
                    }} />
                    </h1>
                    <p>{val.desc}</p>
                    
                </div>
            ))}
         </section> 
    </>
  )
}
