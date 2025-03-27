package com.example.demo.service;

import com.example.demo.entity.Blog;
import com.example.demo.entity.User;
import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.repository.BlogRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    @Autowired
    public BlogService(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    // Tạo blog mới
    public BlogResponse createBlog(BlogRequest request) {
        // Kiểm tra xem tiêu đề đã tồn tại trong cơ sở dữ liệu chưa
        List<Blog> existingBlogs = blogRepository.findByTitle(request.getTitle());
        if (!existingBlogs.isEmpty()) {
            throw new RuntimeException("Duplicate: Blog with the same title already exists.");
        }

        // Tiếp tục tạo blog mới
        User author = userRepository.findById(request.getAuthorId()).orElseThrow(() -> new RuntimeException("Author not found"));
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setAuthor(author);
        blog.setImagePath(request.getImage());
        blog.setCreatedAt(LocalDateTime.now());

        blog = blogRepository.save(blog);

        return new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getAuthor().getName(), blog.getCreatedAt(), blog.getImagePath());
    }

    // Cập nhật blog
    public BlogResponse updateBlog(Long id, String title, String content, String image) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setTitle(title);
        blog.setContent(content);

        if (image != null && !image.isEmpty()) {
            blog.setImagePath(image);
        }

        blog = blogRepository.save(blog);

        return new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getAuthor().getName(), blog.getCreatedAt(), blog.getImagePath());
    }

    // Xóa blog (xóa mềm)
    public void deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        if(blog.isDeleted()){
            throw new RuntimeException("This blog has already been deleted.");
        }
        blog.setDeleted(true);
        blogRepository.save(blog);
    }
    public void deleteBlogPermanently(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        if(blog.isDeleted()){
            blogRepository.delete(blog);
        } else {
            throw new RuntimeException("Blog is not marked as deleted and cannot be permanently deleted.");
        }
        blog.setDeleted(true);
        blogRepository.save(blog);
    }

    // Khôi phục blog đã xóa
    public BlogResponse restoreBlog(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setDeleted(false);
        blog = blogRepository.save(blog);
        return new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getAuthor().getName(), blog.getCreatedAt(), blog.getImagePath());
    }

    // Lấy tất cả blog chưa bị xóa
    public List<BlogResponse> getAllBlogs() {
        List<Blog> blogs = blogRepository.findByIsDeletedFalse();
        return blogs.stream()
                .map(blog -> new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getAuthor().getName(), blog.getCreatedAt(), blog.getImagePath()))
                .collect(Collectors.toList());
    }

    // Lấy blog theo ID
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        return new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getAuthor().getName(), blog.getCreatedAt(), blog.getImagePath());
    }

    // Lấy tất cả blog của một tác giả
    public List<BlogResponse> getBlogsByAuthorId(Long authorId) {
        List<Blog> blogs = blogRepository.findByAuthorIdAndIsDeletedFalse(authorId);
        return blogs.stream()
                .map(blog -> new BlogResponse(blog.getId(), blog.getTitle(), blog.getContent(), blog.getAuthor().getName(), blog.getCreatedAt(), blog.getImagePath()))
                .collect(Collectors.toList());
    }
}