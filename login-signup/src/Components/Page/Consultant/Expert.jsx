import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import style from "../Consultant/Expert.module.css";

export const ExpertsList = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const expertsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/expert/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tải dữ liệu");
        }
        return res.json();
      })
      .then((data) => {
        setList(data);
        setFilteredList(data);
        setSpecialties(["Tất cả", ...new Set(data.map((expert) => expert.specialty))]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredList(
      list.filter((expert) => expert.name.toLowerCase().includes(value))
    );
    setCurrentPage(1);
  };

  const filterExperts = (specialty) => {
    if (specialty === "Tất cả") {
      setFilteredList(list);
    } else {
      setFilteredList(list.filter((expert) => expert.specialty === specialty));
    }
    setSearchTerm("");
    setCurrentPage(1);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = filteredList.slice(indexOfFirstExpert, indexOfLastExpert);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <article>
      <div className={style.container}>
        <Heading title="Danh sách chuyên gia" />

        <input
          type="text"
          placeholder="Tìm chuyên gia..."
          value={searchTerm}
          onChange={handleSearch}
          className={style.searchInput}
        />

        <button className={style.toggleBtn} onClick={toggleCategories}>
          {showCategories ? "Ẩn danh mục ▲" : "Hiện danh mục ▼"}
        </button>

        {showCategories && (
          <div className={style.catWrapper}>
            {specialties.map((specialty) => (
              <button key={specialty} className={style.catButton} onClick={() => filterExperts(specialty)}>
                {specialty}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={style.skeletonWrapper}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={style.skeletonBox}></div>
            ))}
          </div>
        ) : error ? (
          <p className={style.errorMsg}>{error}</p>
        ) : (
          <>
            <div className={style.content}>
              {currentExperts.length > 0 ? (
                currentExperts.map((expert) => (
                  <div className={style.box} key={expert.id}>
                    <div className={style.img}>
                      <img
                        src={`/images/experts/${expert.avatar}`}
                        alt={expert.name}
                        onError={(e) => (e.target.src = "/images/experts/default-avatar.png")}
                      />

                    </div>
                    <h3>{expert.name}</h3>

                    <div className={style.rating}>
                      {expert.rating ? (
                        <>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < expert.rating ? style.starFilled : style.starEmpty}>
                              ★
                            </span>
                          ))}
                          <span className={style.ratingNumber}>({expert.rating.toFixed(1)})</span>
                        </>
                      ) : (
                        <span className={style.noRating}>Chưa có đánh giá</span>
                      )}
                    </div>

                    <p className={style.specialty}>{expert.specialty}</p>
                    <Link to={`/expert/${expert.name}`} className={style.detailButton}>
                      Xem chi tiết
                    </Link>
                  </div>
                ))
              ) : (
                <p className={style.noResult}>Không tìm thấy chuyên gia nào.</p>
              )}
            </div>

            <div className={style.pagination}>
              {Array.from({ length: Math.ceil(filteredList.length / expertsPerPage) }, (_, i) => (
                <button key={i} className={style.pageButton} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
};