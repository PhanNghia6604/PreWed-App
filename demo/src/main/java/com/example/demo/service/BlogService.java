package com.example.demo.service;

import com.example.demo.entity.Blog;
import com.example.demo.entity.User;
import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.repository.BlogRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private UserRepository userRepository;




    /**
     * Tạo blog mới
     */
    public BlogResponse createBlog(BlogRequest request) {
        String base64Image = request.getImage(); // Chuỗi Base64
        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found!"));

        // Tạo mới đối tượng Blog và thiết lập thông tin
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setAuthor(author);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setDeleted(false);
        blog.setImagePath(base64Image);  // Lưu đường dẫn ảnh vào blog


        // Lưu vào database
        Blog savedBlog = blogRepository.save(blog);


        // Trả về thông tin blog đã lưu
        return new BlogResponse(
                savedBlog.getId(),
                savedBlog.getTitle(),
                savedBlog.getContent(),
                savedBlog.getAuthor().getName(),
                savedBlog.getCreatedAt(),
                savedBlog.getImagePath()  // Trả về đường dẫn ảnh
        );
    }


    public List<BlogResponse> getAllBlogs() {
        List<Blog> blogs = blogRepository.findByIsDeletedFalse();

        // Chuyển đổi từ Blog entity sang BlogResponse DTO
        return blogs.stream().map(blog -> new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getAuthor().getName(),
                blog.getCreatedAt(),
                blog.getImagePath()  // Trả về đường dẫn ảnh nếu có
        )).collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết blog theo ID
     */
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        // Chuyển Blog entity sang BlogResponse DTO
        return mapToResponse(blog);
    }

    /**
     * Cập nhật blog theo ID
     */
    public BlogResponse updateBlog(Long id, String title, String content, String imageBase64) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        // Cập nhật tiêu đề và nội dung
        blog.setTitle(title);
        blog.setContent(content);

        // Kiểm tra và cập nhật ảnh nếu có
        if (imageBase64 != null && !imageBase64.isEmpty()) {
            blog.setImagePath(imageBase64);  // Cập nhật chuỗi Base64 của ảnh
        }

        // Lưu blog đã cập nhật vào cơ sở dữ liệu
        Blog updatedBlog = blogRepository.save(blog);

        // Trả về BlogResponse với thông tin đã cập nhật
        return new BlogResponse(
                updatedBlog.getId(),
                updatedBlog.getTitle(),
                updatedBlog.getContent(),
                updatedBlog.getAuthor().getName(),
                updatedBlog.getCreatedAt(),
                updatedBlog.getImagePath()  // Trả về chuỗi Base64 của ảnh
        );
    }


    /**
     * Xóa blog (xóa mềm, không xóa vĩnh viễn)
     */
    public BlogResponse deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blog.setDeleted(true);
        Blog deletedBlog = blogRepository.save(blog);

        return new BlogResponse(
                deletedBlog.getId(),
                deletedBlog.getTitle(),
                deletedBlog.getContent(),
                deletedBlog.getAuthor().getName(),
                deletedBlog.getCreatedAt(),
                deletedBlog.getImagePath()  // Trả về đường dẫn ảnh nếu có
        );
    }

    /**
     * Khôi phục blog đã bị xóa
     */
    public BlogResponse restoreBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        if (!blog.isDeleted()) {
            throw new RuntimeException("Blog is already active!");
        }

        blog.setDeleted(false);
        Blog restoredBlog = blogRepository.save(blog);

        return mapToResponse(restoredBlog);
    }

    /**
     * Chuyển Blog Entity -> BlogResponse DTO
     */
    private BlogResponse mapToResponse(Blog blog) {
        return new BlogResponse(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getAuthor().getName(),
                blog.getCreatedAt(),
                blog.getImagePath()  // Trả về đường dẫn ảnh
        );
    }
}
