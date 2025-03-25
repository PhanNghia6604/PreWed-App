package com.example.demo.entity.response;

import java.time.LocalDateTime;
import java.util.List;

public class PremaritalTestResponse {
    private Long userId;
    private List<String> categoriesToImprove;
    private LocalDateTime testDate;
    private List<DiagnosResponse> diagnosResponses;

    public PremaritalTestResponse(Long userId, List<String> categoriesToImprove, LocalDateTime testDate) {
        this.userId = userId;
        this.categoriesToImprove = categoriesToImprove;
        this.testDate = testDate;
    }

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
}

