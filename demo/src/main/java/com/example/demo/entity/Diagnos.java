package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Diagnos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> categoriesToImprove; // Các chuyên môn cần cải thiện

    private String diagnosisResult; // Kết quả chẩn đoán
    @ManyToOne
    @JoinColumn(name = "premarital_test_id")
    @JsonBackReference  // Đánh dấu để Jackson không tuần tự hóa trường này
    private PremaritalTest premaritalTest;  // Mỗi kết quả chẩn đoán thuộc về một bài kiểm tra

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getCategoriesToImprove() {
        return categoriesToImprove;
    }

    public void setCategoriesToImprove(List<String> categoriesToImprove) {
        this.categoriesToImprove = categoriesToImprove;
    }

    public String getDiagnosisResult() {
        return diagnosisResult;
    }

    public void setDiagnosisResult(String diagnosisResult) {
        this.diagnosisResult = diagnosisResult;
    }

    public PremaritalTest getPremaritalTest() {
        return premaritalTest;
    }

    public void setPremaritalTest(PremaritalTest premaritalTest) {
        this.premaritalTest = premaritalTest;
    }
}
