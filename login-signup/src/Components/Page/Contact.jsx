import React from 'react'
import { Heading } from '../Common/Heading'
import {contact} from '../fake data/data'

export const Contact = () => {
  return (
    <>
    <div className="contact">
        <div className="container">
            <Heading title='Keep in touch'/>
            <div className="content flexsb">
                <div className="right">
                    <form>
                        <div className="flex">
                            <input type='text' placeholder='Name'/>
                            <input type='text' placeholder='Email'/>
                        </div>
                        <input type="text" placeholder='Subject'/>
                        <textarea username="" id="" cols='30' rows='10'></textarea>
                        <button>Submit</button>
                    </form>
                </div>
                <div className="left">
                    {contact.map((item) => (
                        <div className="box">
                            <i>{item.icon}</i>
                            <p>{item.text1}</p>
                            <p>{item.text2}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
