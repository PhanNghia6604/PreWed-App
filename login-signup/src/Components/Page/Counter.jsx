import React from 'react'
import { project } from '../fake data/data'
import CountUp from 'react-countup'

export const Counter = () => {
  return (
    <>  
        <div className="hero counter">
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
