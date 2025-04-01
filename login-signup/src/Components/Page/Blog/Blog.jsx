import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import styles from "./Blog.module.css"; 

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage,setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [totalBlogs,setTotalBlogs] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
        const response = await fetch("/api/blogs/all", {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách blog");
        }
    
        const data = await response.json();
        setBlogs(Array.isArray(data) ? data : []);
        setTotalBlogs(data.length); // Cập nhật tổng số bài blog
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
   // Xác định bài blog cần hiển thị cho trang hiện tại
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Tính toán số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalBlogs / blogsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <Heading title="Blog" />
        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <div className={styles.content}>
            {currentBlogs.length > 0 ? (
              currentBlogs.map((item) => (
                <div className={styles.box} key={item.id}>
                  <Link to={`/blog/${item.id}`}>
                    <div className={styles.img}>
                      <img src={item.imagePath} alt={item.title} />
                    </div>
                    <div className={styles.text}>
                      <h3>{item.title}</h3>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>Không có bài blog nào.</p>
            )}
          </div>
        )}
        {/* Phân trang */}
        <div className={styles.paginationBlog}>
          {pageNumbers.map((number) => (
            <button
              key={number}
              className={currentPage === number ? styles.active : ""}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
