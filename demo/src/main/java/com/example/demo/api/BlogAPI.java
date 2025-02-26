package com.example.demo.api;

import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogAPI {

    @Autowired
    private BlogService blogService;

    @PostMapping("/create")
    public ResponseEntity<BlogResponse> createBlog(@RequestBody BlogRequest blogRequest) {
        return ResponseEntity.ok(blogService.createBlog(blogRequest));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/{blogId}")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long blogId) {
        return ResponseEntity.ok(blogService.getBlogById(blogId));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<BlogResponse>> getBlogsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(blogService.getBlogsByAuthor(authorId));
    }

    @DeleteMapping("/{blogId}")
    public ResponseEntity<BlogResponse> deleteBlog(@PathVariable Long blogId) {
        return ResponseEntity.ok(blogService.deleteBlog(blogId));
    }
}
