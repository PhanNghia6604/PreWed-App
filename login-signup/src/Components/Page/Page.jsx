import React, { useEffect, useState } from 'react'
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
import { BlogDetail } from './Blog/BlogDetai';
import { ExpertsList } from './Consultant/Expert';
import { ExpertDetail } from './Consultant/ExpertDetail';
import Profile from './Menu Customer/Profile';
import {Test} from './Menu Customer/Test';
import Result from './Menu Customer/Result';
import { MyBookings } from './Menu Customer/MyBooking';
import { BookingPayment } from './Menu Customer/BookingPayment';








export const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
  console.log("Token từ localStorage:", token); // Kiểm tra log
  if (token) {
    setIsLoggedIn(true);
  }
  }, []);
  
  return (
   <>
      <Router>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
         <Route exact path="/" element={<Home />} />
         <Route exact path="/services" element={<Services/>} />
         <Route exact path="/blog" element={<Blog/>} />
         <Route exact path="/blog/:id" element={<BlogDetail/>} />
         <Route exact path="/contact" element={<Contact/>} />
         <Route exact path='/expert' element={<ExpertsList/>}/>
         <Route exact path='/expert/:id' element={<ExpertDetail/>}/>
         <Route exact path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
         <Route exact path="/profile" element={<Profile/>} />
         <Route exact path='/my-booking' element={<MyBookings/>}/>
         <Route exact path="/booking-payment/:expertId/:date/:time/:sessionCount" element={<BookingPayment/>} />
         <Route exact path="/register" element={<Register/>} />
         <Route exact path="/test" element={<Test/>} />
         <Route exact path="/result" element={<Result/>} />


        </Routes>
        <Footer/>
      </Router>
      </>
  )
}
