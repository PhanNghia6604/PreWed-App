import React from 'react'
import { Link } from 'react-router-dom'
import { navlink } from '../fake data/fakedata'
import logo from '../fake data/images/logo.png'

export const Header = () => {
  return (
    <>
    <header>
        <div className='container flexsb'>
           <div className="logo">
            <img src={logo} alt=''/>
           </div>
           <div className="nav">
            {navlink.map((links,i) => {
                <Link to={links.url} key={i}>{links.text}</Link>
            })}
           </div>
        </div>
    </header>
    </>
  )
}
