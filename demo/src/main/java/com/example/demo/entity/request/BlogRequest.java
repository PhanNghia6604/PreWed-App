package com.example.demo.entity.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class BlogRequest {
    private String title;
    private String content;
    private Long authorId; // ID của tác giả
}
