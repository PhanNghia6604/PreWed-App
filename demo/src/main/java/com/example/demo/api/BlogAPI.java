package com.example.demo.api;

import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@Tag(name = "Blog API", description = "Quản lý bài viết blog")
public class BlogAPI {

    private final BlogService blogService;

    @Autowired
    public BlogAPI(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    @Operation(summary = "Tạo blog mới", description = "Tạo blog mới với tiêu đề, nội dung và ảnh")
    public ResponseEntity<BlogResponse> createBlog(@Valid @RequestBody BlogRequest request) {
        BlogResponse blogResponse = blogService.createBlog(request);
        return ResponseEntity.ok(blogResponse);
    }

    @PutMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(summary = "Cập nhật blog", description = "Cập nhật tiêu đề, nội dung và ảnh của blog")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id, @RequestBody BlogRequest request) {
        BlogResponse blogResponse = blogService.updateBlog(id, request.getTitle(), request.getContent(), request.getImage());
        return ResponseEntity.ok(blogResponse);
    }

    @DeleteMapping("/{id}")
    @Secured("ROLE_ADMIN")
    @Operation(summary = "Xóa blog", description = "Xóa mềm blog, đặt isDeleted = true")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanently")
    @Secured("ROLE_ADMIN")
    @Operation(summary = " Xóa vĩnh viễn blog" ,description = "Xóa vĩnh viễn khỏi CSDL")
    public ResponseEntity<Void> DeleteBlogPermanently(@PathVariable Long id) {
        blogService.deleteBlogPermanently(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/restore")
    @Secured("ROLE_ADMIN")
    @Operation(summary = "Khôi phục blog", description = "Khôi phục bài viết đã bị xóa")
    public ResponseEntity<BlogResponse> restoreBlog(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.restoreBlog(id));
    }

    @GetMapping
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @Operation(summary = "Lấy danh sách blog", description = "Lấy tất cả blog chưa bị xóa")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @Operation(summary = "Lấy chi tiết blog", description = "Lấy blog theo ID")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @GetMapping("/author/{authorId}")
    @Secured({"ROLE_ADMIN", "ROLE_USER"})
    @Operation(summary = "Lấy blog của tác giả", description = "Lấy tất cả blog của một tác giả")
    public ResponseEntity<List<BlogResponse>> getBlogsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(blogService.getBlogsByAuthorId(authorId));
    }
}