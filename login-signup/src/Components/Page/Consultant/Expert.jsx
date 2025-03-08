import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import style from "../Consultant/Expert.module.css";

export const ExpertsList = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(true); // Trạng thái ẩn/hiện danh mục
  const catRef = useRef(null);

  useEffect(() => {
    const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
    setList(storedExperts);
    setFilteredList(storedExperts);
    setSpecialties(["Tất cả chuyên môn", ...new Set(storedExperts.map((expert) => expert.specialty))]);
  }, []);

  const filterExperts = (specialty) => {
    let storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
    if (specialty !== "Tất cả chuyên môn") {
      storedExperts = storedExperts.filter((expert) => expert.specialty === specialty);
    }
    setFilteredList(storedExperts);
    setSearchTerm(""); // Reset tìm kiếm khi chọn chuyên môn khác
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredList(
      list.filter((expert) => expert.fullName.toLowerCase().includes(value))
    );
  };

  // Toggle hiển thị danh mục
  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  return (
    <article>
      <div className={style.container}>
        <Heading title="Chuyên gia tư vấn" />

        {/* Thanh tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm chuyên gia..."
          value={searchTerm}
          onChange={handleSearch}
          className={style.searchInput}
        />

        {/* Nút Ẩn/Hiện danh mục chuyên môn */}
        <button className={style.toggleBtn} onClick={toggleCategories}>
          {showCategories ? "Thu gọn" : "Hiển thị chuyên môn"}
        </button>

        {/* Danh mục chuyên môn */}
        {showCategories && (
          <div className={style.catWrapper}>
            <div className={style.catButton} ref={catRef}>
              {specialties.map((specialty) => (
                <button key={specialty} className="primarybtn" onClick={() => filterExperts(specialty)}>
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Danh sách chuyên gia */}
        <div className={style.content}>
          {filteredList.length > 0 ? (
            filteredList.map((expert) => (
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
            ))
          ) : (
            <p>Không có chuyên gia nào.</p>
          )}
        </div>
      </div>
    </article>
  );
};
