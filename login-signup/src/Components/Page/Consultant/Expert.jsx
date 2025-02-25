import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import style from "../Consultant/Expert.module.css";

export const ExpertsList = () => {
  const [list, setList] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
    setList(storedExperts);
    setSpecialties(["all", ...new Set(storedExperts.map((expert) => expert.specialty))]);
  }, []);

  const filterExperts = (specialty) => {
    const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
    if (specialty === "all") {
      setList(storedExperts);
      return;
    }
    const filteredExperts = storedExperts.filter((expert) => expert.specialty === specialty);
    setList(filteredExperts);
  };

  return (
    <article>
      <div className={style.container}>
        <Heading title="Chuyên gia tư vấn" />
        <div className={style.catButton}>
          {specialties.map((specialty) => (
            <button key={specialty} className="primarybtn" onClick={() => filterExperts(specialty)}>
              {specialty}
            </button>
          ))}
        </div>
        <div className={style.content}>
          {list.length > 0 ? (
            list.map((expert) => (
              <div className={style.box} key={expert.id}>
                <div className={style.img}>
                  <img src={expert.avatar} alt={expert.fullName} />
                </div>
                <div className={style.info}>
                  <h3>{expert.fullName}</h3>
                  <span>{expert.specialty} - {expert.experience} năm kinh nghiệm</span>
                </div>
                console.log(expert.id);
                <Link to={`/expert/${expert.id}`} className={style.detailButton}>
                  Xem chi tiết
                </Link>
              </div>
            ))
          ) : (
            <p>Không có chuyên gia nào.</p>
          )}
        </div>
      </div>
    </article>
  );
};
