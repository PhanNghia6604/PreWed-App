import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AdminBlogDetail.module.css";

const AdminBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Các giá trị cần chỉnh sửa
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedAuthorId, setEditedAuthorId] = useState("");
  const [editedImage, setEditedImage] = useState("");
  console.log("editedTitle:", editedTitle);
console.log("editedContent:", editedContent);


  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setBlog(data);
        setEditedTitle(data.title);
        setEditedContent(data.content);
        setEditedAuthorId(data.authorId);
        setEditedImage(data.image); // Nếu có ảnh cũ
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  const handleUpdate = async () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      setError("Tiêu đề và nội dung không được để trống!");
      return;
    }
  
    // Kiểm tra nếu authorId không hợp lệ
    const authorIdNumber = Number(editedAuthorId);
    if (isNaN(authorIdNumber) || authorIdNumber <= 0) {
      setError("ID tác giả không hợp lệ!");
      return;
    }
  
    try {
      const updatedData = {
        title: editedTitle.trim(),
        content: editedContent.trim(),
        authorId: authorIdNumber, // Đảm bảo là số hợp lệ
        image: editedImage || blog.image, // Nếu không nhập ảnh mới, giữ ảnh cũ
      };
  
      console.log("Dữ liệu gửi đi:", updatedData);
  
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }
  
      const responseData = await response.json();
      console.log("Phản hồi từ API:", responseData);
  
      setBlog(responseData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Lỗi khi cập nhật bài viết");
      console.error("Lỗi:", err);
    }
  };
  
  
  
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!blog) return <p>Không tìm thấy bài viết</p>;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <>
          <input
            type="text"
            className={styles.input}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            type="text"
            className={styles.textarea}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <input
            type="number"
            className={styles.input}
            value={editedAuthorId}
            onChange={(e) => setEditedAuthorId(e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="URL ảnh mới"
            value={editedImage}
            onChange={(e) => setEditedImage(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <button className={styles.saveButton} onClick={handleUpdate}>
              Lưu
            </button>
            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
              Hủy
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.title}>{blog.title}</h2>
          <p className={styles.author}>Tác giả: {blog.authorName}</p>
          <p className={styles.date}>Ngày tạo: {new Date(blog.createdAt).toLocaleDateString()}</p>
          {blog.image && <img src={blog.image} alt={blog.title} className={styles.image} />}
          <p className={styles.content}>{blog.content}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.backButton} onClick={() => navigate("/admin-blogs")}>
              Quay lại
            </button>
            <button className={styles.updateButton} onClick={() => setIsEditing(true)}>
              Cập nhật
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBlogDetail;
