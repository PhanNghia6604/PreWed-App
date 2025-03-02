package com.example.demo.entity.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;

@Data
public class BlogRequest {

    @NotNull(message = "Title is required")
    private String title;

    @NotNull(message = "Content is required")
    private String content;

    @NotNull(message = "Author ID is required")
    private Long authorId; // ID của tác giả

    @NotNull(message = "Image is required")
    private MultipartFile image; // Ảnh tải lên dưới dạng MultipartFile
}
