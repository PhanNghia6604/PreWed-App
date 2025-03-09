package com.example.demo.service;

import com.example.demo.entity.response.DiagnosResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiagnosService {

    public DiagnosResponse createDiagnosResponse(List<String> categoriesToImprove) {
        String diagnosisResult = categoriesToImprove.isEmpty() ? "Tất cả chuyên môn đều ổn." : "Cần cải thiện các chuyên môn: " + String.join(", ", categoriesToImprove);
        DiagnosResponse response = new DiagnosResponse();
        response.setCategoriesToImprove(categoriesToImprove);
        response.setDiagnosisResult(diagnosisResult);
        return response;
    }
}

