package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogId;

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Content cannot be blank")
    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime publishDate;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private User author; // Tác giả của bài viết (phải có UserID)

    private boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        publishDate = LocalDateTime.now();
    }
}
