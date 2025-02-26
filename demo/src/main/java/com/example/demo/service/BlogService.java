package com.example.demo.service;


import com.example.demo.entity.Blog;
import com.example.demo.entity.User;
import com.example.demo.entity.request.BlogRequest;
import com.example.demo.entity.response.BlogResponse;
import com.example.demo.repository.BlogRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    @Transactional // ✅ Đảm bảo transaction không rollback
    public BlogResponse createBlog(BlogRequest request) {
        System.out.println("Nhận request: " + request); // 🟢 In ra để kiểm tra request có đến không

        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found!"));

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setAuthor(author);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setDeleted(false);

        // 🟢 Lưu vào database
        Blog savedBlog = blogRepository.save(blog);
        System.out.println("Blog đã lưu: " + savedBlog); // 🟢 Kiểm tra log khi blog được lưu

        return new BlogResponse(
                savedBlog.getId(),
                savedBlog.getTitle(),
                savedBlog.getContent(),
                savedBlog.getAuthor().getName(),
                savedBlog.getCreatedAt()
        );
    }



    /**
     * Lấy danh sách tất cả blog chưa bị xóa
     */
    public List<BlogResponse> getAllBlogs() {
        List<Blog> blogs = blogRepository.findByIsDeletedFalse();

        return blogs.stream().map(blog -> {
            BlogResponse response = new BlogResponse();
            response.setId(blog.getId());
            response.setTitle(blog.getTitle());
            response.setContent(blog.getContent());
            response.setAuthorName(blog.getAuthor().getName());
            response.setCreatedAt(blog.getCreatedAt());
            return response;
        }).collect(Collectors.toList());
    }


    /**
     * Lấy thông tin chi tiết blog theo ID
     */
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        return mapToResponse(blog);
    }

    /**
     * Cập nhật blog theo ID
     */
    public BlogResponse updateBlog(Long id, BlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());

        Blog updatedBlog = blogRepository.save(blog);

        // Tạo BlogResponse trực tiếp
        BlogResponse response = new BlogResponse();
        response.setId(updatedBlog.getId());
        response.setTitle(updatedBlog.getTitle());
        response.setContent(updatedBlog.getContent());
        response.setAuthorName(updatedBlog.getAuthor().getName());
        response.setCreatedAt(updatedBlog.getCreatedAt());

        return response;
    }


    /**
     * Xóa blog (xóa mềm, không xóa vĩnh viễn)
     */
    public BlogResponse deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blog.setDeleted(true);
        Blog deletedBlog = blogRepository.save(blog);

        BlogResponse response = new BlogResponse();
        response.setId(deletedBlog.getId());
        response.setTitle(deletedBlog.getTitle());
        response.setContent(deletedBlog.getContent());
        response.setAuthorName(deletedBlog.getAuthor().getName());
        response.setCreatedAt(deletedBlog.getCreatedAt());

        return response; // ✅ Trả về thông tin Blog đã xóa
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
        BlogResponse response = new BlogResponse();
        response.setId(blog.getId());
        response.setTitle(blog.getTitle());
        response.setContent(blog.getContent());
        response.setAuthorName(blog.getAuthor().getName()); // Lấy tên tác giả
        response.setCreatedAt(blog.getCreatedAt());
        return response;
    }
}
