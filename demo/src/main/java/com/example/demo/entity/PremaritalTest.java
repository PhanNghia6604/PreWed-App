package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class PremaritalTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    @ElementCollection
    private List<String> answers;  // Danh sách chuyên môn cần cải thiện
    private LocalDateTime testDate;  // Thời gian bài kiểm tra được thực hiện

    @OneToMany(mappedBy = "premaritalTest", cascade = CascadeType.ALL)
    @JsonManagedReference  // Đánh dấu để Jackson tuần tự hóa mối quan hệ này
    private List<Diagnos> diagnosResults;  // Mỗi bài kiểm tra có thể có nhiều kết quả chẩn đoán

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public LocalDateTime getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDateTime testDate) {
        this.testDate = testDate;
    }
    public List<Diagnos> getDiagnosResults() {
        return diagnosResults;
    }

    public void setDiagnosResults(List<Diagnos> diagnosResults) {
        this.diagnosResults = diagnosResults;
    }
}
