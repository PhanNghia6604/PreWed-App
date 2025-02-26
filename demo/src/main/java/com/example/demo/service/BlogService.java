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

    // Đường dẫn thư mục lưu trữ ảnh
    private static final String UPLOAD_DIR = "C:/Users/phamg/Downloads/PreWed-App-main (1)/PreWed-App-main/uploads/";
    // Lưu trữ ảnh trong thư mục uploads tại thư mục gốc của dự án


    /**
     * Tạo blog mới
     */
    public BlogResponse createBlog(BlogRequest request) {
        System.out.println("Nhận request: " + request); // 🟢 In ra để kiểm tra request có đến không

        // Tìm tác giả từ ID
        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found!"));

        // Tạo mới đối tượng Blog và thiết lập thông tin
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setAuthor(author);
        blog.setCreatedAt(LocalDateTime.now());
        blog.setDeleted(false);

        // Xử lý ảnh tải lên nếu có
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imagePath = saveImage(request.getImage());  // Lưu ảnh và lấy đường dẫn
            blog.setImagePath(imagePath);  // Lưu đường dẫn ảnh vào blog
        }

        // Lưu vào database
        Blog savedBlog = blogRepository.save(blog);
        System.out.println("Blog đã lưu: " + savedBlog); // 🟢 Kiểm tra log khi blog được lưu

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

    /**
     * Lưu ảnh vào thư mục và trả về đường dẫn ảnh
     */
    // Sửa lại đường dẫn trả về thành URL truy cập từ frontend
    private String saveImage(MultipartFile image) {
        try {
            Path path = Paths.get(UPLOAD_DIR + image.getOriginalFilename());
            Files.createDirectories(path.getParent());  // Tạo thư mục nếu chưa có
            image.transferTo(path.toFile());

            // Chuyển đường dẫn file thành URL truy cập
            String url = "http://localhost:8080/uploads/" + image.getOriginalFilename();
            return url;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Could not save the image.");
        }
    }


    /**
     * Lấy danh sách tất cả blog chưa bị xóa
     */
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
    public BlogResponse updateBlog(Long id, String title, String content, MultipartFile image) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blog.setTitle(title);
        blog.setContent(content);

        // Kiểm tra và cập nhật ảnh nếu có
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            blog.setImagePath(imagePath);  // Cập nhật đường dẫn ảnh
        }

        Blog updatedBlog = blogRepository.save(blog);

        // Trả về BlogResponse với thông tin cập nhật
        return new BlogResponse(
                updatedBlog.getId(),
                updatedBlog.getTitle(),
                updatedBlog.getContent(),
                updatedBlog.getAuthor().getName(),
                updatedBlog.getCreatedAt(),
                updatedBlog.getImagePath()  // Trả về đường dẫn ảnh
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
