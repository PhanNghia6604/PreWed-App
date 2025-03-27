    package com.example.demo.entity.response;

    import lombok.Data;
    import java.time.LocalDateTime;


    @Data
    public class BlogResponse {
        private Long id;
        private String title;
        private String content;
        private String authorName;
        private LocalDateTime createdAt;
        private String imagePath; // Đường dẫn ảnh

        public BlogResponse(Long id, String title, String content, String authorName, LocalDateTime createdAt, String imagePath) {
            this.id = id;
            this.title = title;
            this.content = content;
            this.authorName = authorName;
            this.createdAt = createdAt;
            this.imagePath = imagePath;
        }

        public BlogResponse() {
        }

    }