import React from 'react'
import {
    BrowserRouter as Router,Routes,
    Route,
  } from "react-router-dom";
import { Header } from '../Common/Header';
import { Home } from '../Home/Home'
import { Services } from '../Home/Services';
import { Blog } from './Blog';
import { Contact } from './Contact';
import { Login } from '../Page/Login/Login';
import Footer from '../Common/footer';


export const Page = () => {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
         <Route exact path="/" element={<Home />} />
         <Route exact path="/services" element={<Services/>} />
         <Route exact path="/blog" element={<Blog/>} />
         <Route exact path="/contact" element={<Contact/>} />
         <Route exact path="/login" element={<Login/>} />
        </Routes>
        <Footer/>
      </Router>
    </>
  )
}
