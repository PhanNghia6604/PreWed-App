import React from "react";
import { social } from "../fake data/data";

const Footer = () => {
  return (
    <footer>
      {social.map((item, index) => (
        <i key={index} data-aos="zoom-in">{item.icon}</i>
      ))}
      <p style={{ color: "white" }} data-aos="zoom-in">
        All Rights Reserved 2025
      </p>
    </footer>
  );
};

export default Footer;
