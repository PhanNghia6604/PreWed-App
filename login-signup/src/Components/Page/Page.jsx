import React from 'react'
import {
    BrowserRouter as Router,Routes,
    Route,
  } from "react-router-dom";
import { Header } from '../Common/Header';
import { Home } from '../Home/Home'
import { Services } from '../Home/Services';
import { Blog } from '../Page/Blog/Blog';


import { Login } from '../Page/Login/Login';
import { Contact } from './Contact';
import Footer from '../Common/footer';




import { Register } from "./Login/Register";






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
         <Route exact path="/register" element={<Register/>} />
         

        </Routes>
        <Footer/>
      </Router>
    </>
  )
}
