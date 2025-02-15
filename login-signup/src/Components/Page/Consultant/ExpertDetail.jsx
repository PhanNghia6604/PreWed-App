import React from "react";
import { useParams } from "react-router-dom";
import { experts } from "../../fake data/data";
import style from "./ExpertDetail.module.css";

export const ExpertDetail = () => {
  const { id } = useParams();
  const expert = experts.find((exp) => exp.id === Number(id));

  if (!expert) {
    return <div className={style.notFound}>Chuyên gia không tồn tại!</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.card}>
        <img src={expert.avatar} alt={expert.fullName} className={style.avatar} />
        <h2>{expert.fullName}</h2>
        <p className={style.specialty}>{expert.specialty}</p>
        <p className={style.experience}>{expert.experience} năm kinh nghiệm</p>
        <button className={style.bookButton}>Đặt lịch tư vấn</button>
      </div>
    </div>
  );
};
