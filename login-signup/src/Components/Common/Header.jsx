import React from 'react'
import { Link } from 'react-router-dom'
import { navlink } from '../fake data/fakedata.js'
import logo from '../fake data/images/logo.png'
import { Menu } from '@mui/icons-material'
import { useState } from 'react'


export const Header = () => {
    const [responsive, setResponsive] = useState(false);
  return (
    <>
    <header>
        <div className='container flexsb'>
           <div className="logo">
            <img src={logo} alt=''/>
           </div>
           <div className={responsive ? "hideMenu" : "nav"}>
            {navlink.map((links,i) => (
                <Link to={links.url} key={i}>{links.text}</Link>
            ))}
           </div>
           <button className='toggle' onClick={() => setResponsive(!responsive)}><Menu className='icon'></Menu></button>
        </div>
    </header>
    </>
  )
}
