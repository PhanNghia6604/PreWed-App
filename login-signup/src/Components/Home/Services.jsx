import React from "react"
import { Heading } from "../Common/Heading"
import { services } from "../fake data/data"

export const Services = () => {
  return (
    <>
      <section className='services'>
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