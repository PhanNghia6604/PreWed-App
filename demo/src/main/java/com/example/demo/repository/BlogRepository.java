package com.example.demo.repository;

import com.example.demo.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Lấy tất cả blog chưa bị xóa
    List<Blog> findByIsDeletedFalse();

    // Lấy tất cả blog của một tác giả
    List<Blog> findByAuthorIdAndIsDeletedFalse(Long authorId);

    // Tìm blog theo tiêu đề (Sửa lại từ 'Tilte' thành 'Title')
    List<Blog> findByTitle(String title);
}
