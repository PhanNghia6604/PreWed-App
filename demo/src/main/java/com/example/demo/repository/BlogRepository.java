package com.example.demo.repository;

import com.example.demo.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Lấy tất cả blog chưa bị xóa
    List<Blog> findByIsDeletedFalse();

    // Tìm blog theo từ khóa trong tiêu đề
    List<Blog> findByTitleContainingAndIsDeletedFalse(String keyword);

    // Lấy tất cả blog của một tác giả (User)
    List<Blog> findByAuthorIdAndIsDeletedFalse(Long authorId);

    // Lọc blog theo khoảng thời gian
    List<Blog> findByCreatedAtBetweenAndIsDeletedFalse(LocalDateTime start, LocalDateTime end);

    // Đếm số blog của một tác giả
    long countByAuthorIdAndIsDeletedFalse(Long authorId);

    // Lấy blog mới nhất trước
    List<Blog> findByIsDeletedFalseOrderByCreatedAtDesc();
}
