package com.example.demo.entity;

import com.example.demo.enums.CategoryEnum;
import jakarta.persistence.*;

@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // ID của người dùng (để theo dõi bài kiểm tra)
    private Long questionId;  // ID câu hỏi mà người dùng trả lời
    private int score;  // Điểm của câu trả lời (1, 2, 3)
    private CategoryEnum category;   // Khía cạnh mà câu trả lời thuộc về (Tâm lý, Tài chính, v.v.)

    // Constructor mặc định cần thiết cho JPA
    public Answer() {}

    // Constructor với tham số
    public Answer(Long userId, Long questionId, int score, CategoryEnum category) {
        this.userId = userId;
        this.questionId = questionId;
        this.score = score;
        this.category = category;
    }

    // Getter, Setter
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

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }
}
