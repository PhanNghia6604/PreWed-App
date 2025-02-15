import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { experts } from '../../fake data/data';
import { Heading } from '../../Common/Heading';
import style from '../Consultant/Expert.module.css';

const allSpecialties = ['all', ...new Set(experts.map((expert) => expert.specialty))];

export const ExpertsList = () => {
  const [list, setList] = useState(experts);
  const [specialties, setSpecialties] = useState(allSpecialties);

  const filterExperts = (specialty) => {
    if (specialty === 'all') {
      setList(experts);
      return;
    }
    const filteredExperts = experts.filter((expert) => expert.specialty === specialty);
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
          {list.map((expert) => (
            <div className={style.box} key={expert.id}>
              <div className={style.img}>
                <img src={expert.avatar} alt={expert.fullName} />
              </div>
              <div className={style.info}>
                <h3>{expert.fullName}</h3>
                <span>{expert.specialty} - {expert.experience} năm kinh nghiệm</span>
              </div>
              <Link to={`/expert/${expert.id}`} className={style.detailButton}>
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
