import React, { useState } from "react";
import style from '../LoginSignup/LoginSignup.module.css';
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";

export const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");

  return (
    <div className={style.loginbody}>
      <div className={style.container}>
        <div className={style.header}>
          <div className="text">{action}</div>
          <div className={style.underline}></div>
        </div>
        <div className={style.inputs}>
          {action === "Login" ? (
            <div></div>
          ) : (
            <div className={style.input}>
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Name" />
            </div>
          )}
          <div className={style.input}>
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" />
          </div>
          <div className={style.input}>
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Password" />
          </div>
        </div>
        {action === "Sign Up" ? (
          <div></div>
        ) : (
          <div className={style.forgot_password}>
            Lost password? <span>Click here !</span>
          </div>
        )}
        <div className={style.submit_container}>
          <div
            className={action === "Login" ? `${style.submit} ${style.gray}` : style.submit}
            onClick={() => setAction("Sign Up")}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? `${style.submit} ${style.gray}` : style.submit}
            onClick={() => setAction("Login")}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};
