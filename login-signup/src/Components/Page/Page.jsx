import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Header } from '../Common/Header';

export const Page = () => {
  return (
    <>
      <Router>
        <Header/>
      </Router>
    </>
  )
}
