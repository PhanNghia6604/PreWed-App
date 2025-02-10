import React from 'react'
import {
    BrowserRouter as Router,Routes,
    Route,
  } from "react-router-dom";
import { Header } from '../Common/Header';
import { Home } from '../Home/Home'
import { About } from './About';
import { Services } from '../Home/Services';

export const Page = () => {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
         <Route exact path="/" element={<Home />} />
         <Route exact path="/about" element={<About />} />
         <Route exact path="/services" element={<Services/>} />
        </Routes>
      </Router>
    </>
  )
}
