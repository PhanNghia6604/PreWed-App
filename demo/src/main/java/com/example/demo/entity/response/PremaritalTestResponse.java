package com.example.demo.entity.response;

import java.time.LocalDateTime;
import java.util.List;

public class PremaritalTestResponse {

    private Long userId;
    private List<String> categoriesToImprove;
    private LocalDateTime testDate;
    private List<DiagnosResponse> diagnosResponses;

    // Constructor
    public PremaritalTestResponse(Long userId, List<String> categoriesToImprove, LocalDateTime testDate, List<DiagnosResponse> diagnosResponses) {
        this.userId = userId;
        this.categoriesToImprove = categoriesToImprove;
        this.testDate = testDate;
        this.diagnosResponses = diagnosResponses;
    }

    // Getter và Setter
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getCategoriesToImprove() {
        return categoriesToImprove;
    }

    public void setCategoriesToImprove(List<String> categoriesToImprove) {
        this.categoriesToImprove = categoriesToImprove;
    }

    public LocalDateTime getTestDate() {
        return testDate;
    }

    public void setTestDate(LocalDateTime testDate) {
        this.testDate = testDate;
    }

    public List<DiagnosResponse> getDiagnosResponses() {
        return diagnosResponses;
    }

    public void setDiagnosResponses(List<DiagnosResponse> diagnosResponses) {
        this.diagnosResponses = diagnosResponses;
    }

    // Phương thức toString() để dễ dàng in thông tin đối tượng khi debug
    @Override
    public String toString() {
        return "PremaritalTestResponse{" +
                "userId=" + userId +
                ", categoriesToImprove=" + categoriesToImprove +
                ", testDate=" + testDate +
                ", diagnosResponses=" + diagnosResponses +
                '}';
    }
}
