package com.example.demo.entity.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlogResponse {
    private Long blogId;
    private String title;
    private String content;
    private LocalDateTime publishDate;
    private Long authorId;
    private String authorName; // Hiển thị tên tác giả
}
