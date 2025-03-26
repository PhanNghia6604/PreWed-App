import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import style from "../Consultant/Expert.module.css";

export const ExpertsList = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả");
  const expertsPerPage = 6;

  // useEffect(() => {
  //   setLoading(true);
  //   const token = localStorage.getItem("token"); // Lấy token từ localStorage hoặc context
  
  //   fetch("/api/expert/all", {
  //     method: "GET",
  //     headers: {
  //       "Accept": "application/json",
  //       // "Authorization": `Bearer ${token}`, // Gửi token trong headers
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Experts Data:", data);
  //       setList(data);
  //       setFilteredList(data);
  //       setSpecialties(["Tất cả", ...new Set(data.map((expert) => expert.specialty))]);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
      
  // }, []);
  useEffect(() => {
    Promise.all([
      fetch("/api/expert/all", {
        method: "GET",
        headers: { "Accept": "application/json" },
      }).then((res) => res.json()),
  
      fetch("/api/feedback", {
        method: "GET",
        headers: { "Accept": "application/json" },
      }).then((res) => res.json()),
    ])
      .then(([expertsData, feedbacksData]) => {
        console.log("Experts Data:", expertsData);
        console.log("Feedbacks Data:", feedbacksData);
  
        // Kiểm tra ID của expert trong feedback
        feedbacksData.forEach((fb) => {
          console.log(`Feedback ID: ${fb.id}, Expert ID: ${fb.expert?.id}, Rating: ${fb.rating}`);
        });
          // Lọc chuyên gia chỉ lấy những người đã được phê duyệt (approved: true)
      const approvedExperts = expertsData.filter(expert => expert.approved);
        const feedbackMap = new Map();

  
        feedbacksData.forEach((feedback) => {
          const expertId = feedback.expert?.id;
          if (!expertId) return;
  
          if (!feedbackMap.has(expertId)) {
            feedbackMap.set(expertId, []);
          }
          feedbackMap.get(expertId).push(feedback.rating);
        });
        
        console.log("Feedback Map:", feedbackMap);
  
        const updatedExperts = approvedExperts.map((expert) => {
          const ratings = feedbackMap.get(expert.id) || [];
          const avgRating =
            ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 0;
  
          console.log(`Expert: ${expert.name}, Ratings: ${ratings}, Avg Rating: ${avgRating}`);
  
          return { ...expert, rating: parseFloat(avgRating) };
        });
  
        console.log("Updated Experts:", updatedExperts);
        setList(updatedExperts);
        setFilteredList(updatedExperts);
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  
  
  
  
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterExperts(selectedSpecialty, value, ratingFilter);
  };

  const filterExperts = (specialty = "Tất cả", search = searchTerm, rating = ratingFilter) => {
    let filtered = list;
    if (specialty !== "Tất cả") {
      filtered = filtered.filter((expert) => expert.specialty === specialty);
    }
    if (search) {
      filtered = filtered.filter((expert) => expert.name.toLowerCase().includes(search));
    }
    if (rating > 0) {
      filtered = filtered.filter((expert) => expert.rating >= parseFloat(rating));
    } 
    setFilteredList(filtered);
    setCurrentPage(1);
  };

  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = filteredList.slice(indexOfFirstExpert, indexOfLastExpert);

  return (
    <article className={style.container}>
      <Heading title="Danh sách chuyên gia" />
      <button className={style.toggleFiltersButton} onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
      </button>
      {showFilters && (
        <div className={style.filterContainer}>
          <input
            type="text"
            placeholder="Tìm chuyên gia..."
            value={searchTerm}
            onChange={handleSearch}
            className={style.searchInput}
          />

          <select
            className={style.dropdownFilter}
            value={selectedSpecialty}
            onChange={(e) => {
              setSelectedSpecialty(e.target.value);
              filterExperts(e.target.value);
            }}
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>

          <div className={style.ratingFilter}>
            <label>Lọc theo đánh giá:</label>
            <select onChange={(e) => { setRatingFilter(e.target.value); filterExperts(selectedSpecialty, searchTerm, e.target.value); }}>
              <option value={0}>Tất cả</option>
              <option value={1}>1 sao trở lên</option>
              <option value={2}>2 sao trở lên</option>
              <option value={3}>3 sao trở lên</option>
              <option value={4}>4 sao trở lên</option>
              <option value={5}>5 sao</option>
            </select>
          </div>
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
                  <div className={style.imgWrapper}>
                  <img
  src={expert.avatar.includes("/") ? expert.avatar : `/images/experts/${expert.avatar}`}
  alt={expert.name}
  onError={(e) => (e.target.src = "/images/experts/default-avatar.png")}
/>
                  </div>
                  <h3 class={style.expertName}>{expert.name}</h3>
                  <p className={style.specialty}>{expert.specialty}</p>
                  {/* <p className={style.rating}>
  ⭐ {expert.rating > 0 ? expert.rating : "Chưa có đánh giá"}
</p> */}
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
            {currentPage > 1 && (
              <button className={style.pageButton} onClick={() => setCurrentPage(currentPage - 1)}>
                &laquo; Trước
              </button>
            )}
            {Array.from({ length: Math.ceil(filteredList.length / expertsPerPage) }, (_, i) => (
              <button
                key={i}
                className={`${style.pageButton} ${currentPage === i + 1 ? style.activePage : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {currentPage < Math.ceil(filteredList.length / expertsPerPage) && (
              <button className={style.pageButton} onClick={() => setCurrentPage(currentPage + 1)}>
                Sau &raquo;
              </button>
            )}
          </div>
        </>
      )}
    </article>
  );
};
