package com.example.demo.entity.response;

import java.util.List;

public class DiagnosResponse {

    private List<String> categoriesToImprove;  // Các chuyên môn cần cải thiện
    private String diagnosisResult;            // Kết quả chẩn đoán

    // Constructor mặc định
    public DiagnosResponse() {
    }

    // Constructor đầy đủ
    public DiagnosResponse(List<String> categoriesToImprove, String diagnosisResult) {
        this.categoriesToImprove = categoriesToImprove;
        this.diagnosisResult = diagnosisResult;
    }

    // Getter và Setter cho categoriesToImprove
    public List<String> getCategoriesToImprove() {
        return categoriesToImprove;
    }

    public void setCategoriesToImprove(List<String> categoriesToImprove) {
        this.categoriesToImprove = categoriesToImprove;
    }

    // Getter và Setter cho diagnosisResult
    public String getDiagnosisResult() {
        return diagnosisResult;
    }

    public void setDiagnosisResult(String diagnosisResult) {
        this.diagnosisResult = diagnosisResult;
    }

    // Phương thức toString() để dễ dàng in thông tin đối tượng khi debug
    @Override
    public String toString() {
        return "DiagnosResponseDTO{" +
                "categoriesToImprove=" + categoriesToImprove +
                ", diagnosisResult='" + diagnosisResult + '\'' +
                '}';
    }

    // Phương thức equals() để so sánh 2 đối tượng DiagnosResponseDTO
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        DiagnosResponse that = (DiagnosResponse) o;

        if (categoriesToImprove != null ? !categoriesToImprove.equals(that.categoriesToImprove) : that.categoriesToImprove != null)
            return false;
        return diagnosisResult != null ? diagnosisResult.equals(that.diagnosisResult) : that.diagnosisResult == null;
    }

    // Phương thức hashCode() giúp tạo mã băm cho đối tượng khi cần so sánh hoặc lưu trữ trong bộ sưu tập (Collections)
    @Override
    public int hashCode() {
        int result = categoriesToImprove != null ? categoriesToImprove.hashCode() : 0;
        result = 31 * result + (diagnosisResult != null ? diagnosisResult.hashCode() : 0);
        return result;
    }
}

