import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminBlogManagement.module.css";

const AdminBlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: "", content: "", authorId: "", image: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blogs/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBlogs();
    } catch (err) {
      alert("Xóa không thành công");
    }
  };

  const restoreBlog = async (id) => {
    try {
      await fetch(`/api/blogs/${id}/restore`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBlogs();
    } catch (err) {
      alert("Khôi phục không thành công");
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    const blogData = {
      title: newBlog.title,
      content: newBlog.content,
      authorId: parseInt(newBlog.authorId, 10),
      image: newBlog.image,
    };

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo blog");
      }

      const data = await response.json();
      setBlogs([...blogs, data]);
      setNewBlog({ title: "", content: "", authorId: "", image: "" });
    } catch (err) {
      alert("Tạo blog thất bại: " + err.message);
    }
  };



  return (
    <div className={styles.container} style={{ paddingTop: "150px" }}>
      <h2 className={styles.title}>Quản lý Blog</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className={styles.form} onSubmit={handleCreateBlog} style={{ marginTop: "50px" }}>
        <input
          className={styles.input}
          type="text"
          placeholder="Tiêu đề"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Nội dung"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          required
        ></textarea>
        <input
          className={styles.input}
          type="number"
          placeholder="Author ID"
          value={newBlog.authorId}
          onChange={(e) => setNewBlog({ ...newBlog, authorId: e.target.value })}
          required
        />
        <input
          className={styles.fileInput}
          placeholder="Nhập URL hình ảnh..."
          onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
          required
        />

        <button className={styles.button} type="submit">Tạo Blog</button>
      </form>

      <table className={styles.table} style={{ marginTop: "50px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Ngày tạo</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.id}</td>
              <td>{blog.title}</td>
              <td>{blog.authorName}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                {blog.imagePath && <img src={blog.imagePath} alt={blog.title} className={styles.image} />}
              </td>
              <td className={styles.actions}>
                <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => deleteBlog(blog.id)}>Xóa</button>
                <button className={`${styles.button} ${styles.restoreButton}`} onClick={() => restoreBlog(blog.id)}>Khôi phục</button>
                <button className={`${styles.button} ${styles.detailButton}`} onClick={() => navigate(`/admin/blogs/${blog.id}`)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogManagement;
