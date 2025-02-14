import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navlink } from '../fake data/data.js';
import logo from '../fake data/images/logo.png';
import { Menu } from '@mui/icons-material';

export const Header = () => {
    const [responsive, setResponsive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header>
            <div className='container flexsb'>
                <div className="logo">
                    <img src={logo} alt='' />
                </div>
                <div className={responsive ? "hideMenu" : "nav"}>
                    {navlink.map((link, i) => (
                        <Link to={link.url} key={i}>{link.text}</Link>
                    ))}
                    {!isLoggedIn ? (
                        <Link to="/login">Login</Link>
                    ) : (
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    )}
                </div>
                <button className='toggle' onClick={() => setResponsive(!responsive)}>
                    <Menu className='icon' />
                </button>
            </div>
        </header>
    );
};
