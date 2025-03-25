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

import Profile from './Menu Customer/Profile';
import Test from './Menu Customer/Test';
import Result from './Menu Customer/Result';
import { MyBookings } from './Menu Customer/MyBooking';
import  BookingPayment  from './Menu Customer/BookingPayment';
import { ChooseRole } from '../Common/ChooseRole';
import { ExpertLogin } from './Menu Expert/ExpertLogin';
import ExpertDashboard from './Menu Expert/ExpertDashboard';
import ExpertRegister from './Menu Expert/ExpertRegister';
import ExpertProfile from './Menu Expert/ExpertProfile';
import  ExpertAppointment  from './Menu Expert/ExpertAppointments';
import { AdminLogin } from './Menu Admin/AdminLogin';
import { AdminHeader } from '../Common/AdminHeader';
import { Earnings } from './Menu Expert/Earning';
import FeedbackPage from './Menu Customer/FeedBackPage';
import { AdminDashboard } from './Menu Admin/AdminDashbaord';
import { AdminRegister } from './Menu Admin/AdminRegister';
import ExpertDetail from './Consultant/ExpertDetail';
import { ExpertProvider } from "./Consultant/ExpertContext"; // Import ExpertProvider

import ServicePackageManagement from './Menu Admin/ServicePackageManagement';
import SlotManagement from './Menu Admin/SlotManagement';
import HistoryTest from './Menu Customer/HistoryTest';
import UserManagement from './Menu Admin/UserManagement';
import WaitingPayment from './Menu Customer/WaitingPayment';
import AdminReportPage from './Menu Admin/AdminReportPage';
import AdminBlogManagement from './Menu Admin/AdminBlogManagment';
import AdminBlogDetail from './Menu Admin/AdminBlogDetail';
import CustomerManagement from './Menu Admin/CustomerMagnament';
import ExpertManagement from './Menu Admin/ExpertManagment';




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
    <ExpertProvider> {/* Bọc toàn bộ Router trong ExpertProvider */}
      <Router>
        {/* Kiểm tra userRole để hiển thị Header phù hợp */}
        {userRole === "expert" ? (
          <ExpertHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        ) : userRole === "admin" ? (
          <AdminHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        ) : (  
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )}

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/services" element={<Services />} />
          <Route exact path="/blog" element={<Blog />} />
          <Route exact path="/blog/:id" element={<BlogDetail />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/expert" element={<ExpertsList />} />
          <Route path="/expert/:name" element={<ExpertDetail />} />
          <Route exact path="/login" element={<ChooseRole />} />
          <Route exact path="/customer-login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route exact path="/expert-login" element={<ExpertLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route exact path="/expert-register" element={<ExpertRegister />} />
          <Route exact path="/feedback/:bookingId/:expertId" element={<FeedbackPage />} />
          <Route exact path='/expert-dashboard' element={<ExpertDashboard />} />
          <Route path="expert-profile" element={<ExpertProfile />} />
          <Route path='expert-earning' element={<Earnings />} />
          <Route exact path="/expert-appointments" element={<ExpertAppointment />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/history-test" element={<HistoryTest/>}/>
          <Route exact path="/my-booking" element={<MyBookings />} />
          <Route exactpath="/booking-payment/:bookingId" element={<BookingPayment />} />
          <Route path="/waiting-payment" element={<WaitingPayment/>}/>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/test" element={<Test />} />
          <Route path="/history-test" element={<HistoryTest/>}/>
          <Route exact path="/result" element={<Result />} />
          <Route exact path="/admin-login" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/admin-servicepackage" element={<ServicePackageManagement/>}/>
          <Route exact path="/admin-register" element={<AdminRegister />} />
          <Route exact path="/admin-slots" element={<SlotManagement />} />
          <Route exact path="/admin-users" element={<UserManagement />} />
          <Route exact path="/admin-reports" element={<AdminReportPage/>} />
          <Route path="/admin-blogs" element={<AdminBlogManagement/>}/>
          <Route  path="/admin/blogs/:id"  element={<AdminBlogDetail/>}/>
          <Route path="/admin-customers" element={<CustomerManagement/>}/>
          <Route path="/admin-experts" element={<ExpertManagement/>}/>
          <Route exact path="/feedback" element={<FeedbackPage />} />
        </Routes>

        <Footer />
      </Router>
    </ExpertProvider>
  );
};