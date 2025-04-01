import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./BlogDetail.module.css";

export const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    console.log("blog id:",id); // Kiểm tra xem id có giá trị không
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        if (!response.ok) {
          throw new Error("Không tìm thấy bài blog");
        }
  
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);
  

  if (loading) return <h2>Đang tải dữ liệu...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
  if (!blog) return <h2>Không tìm thấy bài blog</h2>;

  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <img
          src={blog.imagePath.startsWith(".") ? blog.imagePath.replace(".", "") : blog.imagePath}
          alt={blog.title}
        />
      </div>
      <h1 className={styles.title}>{blog.title}</h1>
      <p className={styles.meta}>
        <strong>By:</strong> {blog.authorName} | <strong>Date:</strong> {blog.createdAt}
      </p>
      <p className={styles.desc}>
        {showMore ? blog.content : blog.content.slice(0, 300) + "..."}
        <button className={styles.readMoreBtn} onClick={() => setShowMore(!showMore)}>
          {showMore ? "Thu gọn" : "Xem thêm"}
        </button>
      </p>
    </div>
  );
};
