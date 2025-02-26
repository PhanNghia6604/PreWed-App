package com.example.demo.api;


import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@SecurityRequirement(name = "api")
@Tag(name = "Blog API", description = "Quản lý bài viết blog")
public class BlogAPI {

    @Autowired
    private BlogService blogService;

    @PostMapping
    public ResponseEntity<BlogResponse> createBlog(@RequestBody BlogRequest request) {
        System.out.println("🔵 API nhận request: " + request); // 🟢 Log kiểm tra request có đến API không

        BlogResponse blogResponse = blogService.createBlog(request);
        System.out.println("🟢 API trả response: " + blogResponse); // 🟢 Kiểm tra response có bị null không

        return ResponseEntity.ok(blogResponse);
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách blog", description = "Lấy tất cả blog chưa bị xóa")
    public ResponseEntity<List<BlogResponse>> getAllBlogs() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết blog", description = "Lấy thông tin blog theo ID")
    public ResponseEntity<BlogResponse> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật blog", description = "Cập nhật tiêu đề, nội dung của blog")
    public ResponseEntity<BlogResponse> updateBlog(@PathVariable Long id, @RequestBody BlogRequest request) {
        return ResponseEntity.ok(blogService.updateBlog(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa blog", description = "Xóa mềm blog, đặt isDeleted = true")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Khôi phục blog", description = "Khôi phục bài viết đã bị xóa")
    public ResponseEntity<BlogResponse> restoreBlog(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.restoreBlog(id));
    }
}
