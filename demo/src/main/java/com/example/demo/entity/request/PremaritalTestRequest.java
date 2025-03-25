package com.example.demo.entity.request;

import com.example.demo.entity.DTO.Answer;

import java.util.List;

public class PremaritalTestRequest {
    private Long userId;
    private List<Answer> answers; // Danh sách câu trả lời của người dùng

    public PremaritalTestRequest(Long userId, List<Answer> answers) {
        this.userId = userId;
        this.answers = answers;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    @Override
    public String toString() {
        return "PremaritalTestRequest{" +
                "userId=" + userId +
                ", answers=" + answers +
                '}';
    }
}

