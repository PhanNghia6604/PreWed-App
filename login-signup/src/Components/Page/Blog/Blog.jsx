import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading } from "../../Common/Heading";
import styles from "./Blog.module.css"; 

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
        const response = await fetch("/api/blogs", {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách blog");
        }
    
        const data = await response.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <Heading title="Blog" />
        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <div className={styles.content}>
            {blogs.length > 0 ? (
              blogs.map((item) => (
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
      </div>
    </section>
  );
};
