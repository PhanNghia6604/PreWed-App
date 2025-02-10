import React from 'react'
import {
    BrowserRouter as Router,Routes,
    Route,
  } from "react-router-dom";
import { Header } from '../Common/Header';
import { Home } from '../Home/Home'

export const Page = () => {
  return (
    <>
      <Router>
        <Header/>
        <Routes>
         <Route exact path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  )
}
