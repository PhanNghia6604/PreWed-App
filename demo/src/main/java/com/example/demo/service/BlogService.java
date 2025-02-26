package com.example.demo.service;

import com.example.demo.entity.Blog;
import com.example.demo.entity.User;
import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.repository.BlogRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserRepository userRepository;

    public BlogResponse createBlog(BlogRequest request) {
        Optional<User> user = userRepository.findById(request.getAuthorId());
        if (user.isEmpty()) {
            throw new RuntimeException("Author not found!");
        }

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setAuthor(user.get());

        Blog savedBlog = blogRepository.save(blog);
        return mapToResponse(savedBlog);
    }

    public List<BlogResponse> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAllByIsDeletedFalse();
        return blogs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BlogResponse getBlogById(Long blogId) {
        Optional<Blog> blog = blogRepository.findByBlogIdAndIsDeletedFalse(blogId);
        if (blog.isEmpty()) {
            throw new RuntimeException("Blog not found!");
        }
        return mapToResponse(blog.get());
    }

    public List<BlogResponse> getBlogsByAuthor(Long authorId) {
        List<Blog> blogs = blogRepository.findByAuthor_IdAndIsDeletedFalse(authorId);
        return blogs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public BlogResponse deleteBlog(Long blogId) {
        Optional<Blog> blog = blogRepository.findByBlogIdAndIsDeletedFalse(blogId);
        if (blog.isEmpty()) {
            throw new RuntimeException("Blog not found!");
        }

        Blog foundBlog = blog.get();
        foundBlog.setDeleted(true);
        blogRepository.save(foundBlog);

        return mapToResponse(foundBlog);
    }

    private BlogResponse mapToResponse(Blog blog) {
        BlogResponse response = new BlogResponse();
        response.setBlogId(blog.getBlogId());
        response.setTitle(blog.getTitle());
        response.setContent(blog.getContent());
        response.setPublishDate(blog.getPublishDate());
        response.setAuthorId(blog.getAuthor().getId());
        response.setAuthorName(blog.getAuthor().getName());
        return response;
    }
}
