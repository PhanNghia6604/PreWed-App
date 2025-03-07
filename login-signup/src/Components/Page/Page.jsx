import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { Header } from '../Common/Header';
import { ExpertHeader } from '../Common/ExpertHeader';
import { Home } from '../Home/Home';
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
import  Test  from './Menu Customer/Test';
import Result from './Menu Customer/Result';
import { MyBookings } from './Menu Customer/MyBooking';
import { BookingPayment } from './Menu Customer/BookingPayment';
import { ChooseRole } from '../Common/ChooseRole';
import { ExpertLogin } from './Menu Expert/ExpertLogin';
import ExpertDashboard from './Menu Expert/ExpertDashboard';
import ExpertRegister from './Menu Expert/ExpertRegister';
import ExpertProfile from './Menu Expert/ExpertProfile';
import { ExpertAppointments } from './Menu Expert/ExpertAppointments';
import { AdminLogin } from './Menu Admin/AdminLogin';
import { Earnings } from './Menu Expert/Earning';
import FeedbackPage from './Menu Customer/FeedBackPage';
import { AdminDashboard } from './Menu Admin/AdminDashbaord';
import { AdminRegister } from './Menu Admin/AdminRegister';



export const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole")); // State lưu vai trò

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      setUserRole(localStorage.getItem("userRole")); // Cập nhật userRole khi thay đổi
    };
  
    window.addEventListener("storage", checkAuth);
  
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <>
      <Router>
         {/* Kiểm tra userRole để hiển thị Header phù hợp */}
         {userRole === "expert" ? (
                <ExpertHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            ) : (
                <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}  />
            )}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/services" element={<Services />} />
          <Route exact path="/blog" element={<Blog />} />
          <Route exact path="/blog/:id" element={<BlogDetail />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/expert" element={<ExpertsList />} />
          <Route exact path="/expert/:id" element={<ExpertDetail />} />
          <Route exact path="/login" element={<ChooseRole/>} />
          <Route exact path="/customer-login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route exact path="/expert-login" element={<ExpertLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole}/>} />
          <Route exact path="/expert-register" element={<ExpertRegister/>}/>
          <Route exact path="/feedback/:bookingId/:expertId" element={<FeedbackPage/>}/>
          <Route exact path='/expert-dashboard' element={<ExpertDashboard/>}/>
          <Route path="expert-profile" element={<ExpertProfile/>}/>
          <Route path='expert-earning' element={<Earnings/>}/>
          <Route exact path="/expert-appointments" element={<ExpertAppointments/>}/>
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/my-booking" element={<MyBookings />} />
          <Route exact path="/booking-payment/:expertId/:bookingId" element={<BookingPayment />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/test" element={<Test />} />
          <Route exact path="/result" element={<Result />} />
          <Route exact path="/admin-login" element={<AdminLogin />} />
          <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
          <Route exact path="/admin-register" element={<AdminRegister />} />
          


        </Routes>
        <Footer />
      </Router>
    </>
  );
};
