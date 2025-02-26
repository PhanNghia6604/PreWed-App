package com.example.demo.repository;

import com.example.demo.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findAllByIsDeletedFalse();
    Optional<Blog> findByBlogIdAndIsDeletedFalse(Long blogId);
    List<Blog> findByAuthor_IdAndIsDeletedFalse(Long authorId); // Cập nhật từ UserId thành Id
}
