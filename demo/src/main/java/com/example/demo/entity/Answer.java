package com.example.demo.entity;

import com.example.demo.enums.CategoryEnum;
import jakarta.persistence.*;

@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Thêm trường userId để lưu thông tin người dùng
    private Long questionId;
    private String answerText; // "Không ổn", "Bình thường", "Rất ổn"

    @Enumerated(EnumType.STRING) // Đánh dấu rằng category là enum
    private CategoryEnum category;   // Category using Enum like Tâm lý, Tài chính, etc.

    // Constructor mặc định cần thiết cho JPA
    public Answer() {}

    // Constructor với tham số
    public Answer(Long userId, Long questionId, String answerText, CategoryEnum category) {
        this.userId = userId;
        this.questionId = questionId;
        this.answerText = answerText;
        this.category = category;
    }

    // Getter và setter
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Answer{" +
                "userId=" + userId +
                ", questionId=" + questionId +
                ", answerText='" + answerText + '\'' +
                ", category=" + category +
                '}';
    }
}
