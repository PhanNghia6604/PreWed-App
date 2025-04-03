package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.response.DiagnosResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiagnosService {

    public DiagnosResponse createDiagnosResponse(List<String> categoriesToImprove, List<String> reasons, List<String> consultations) {
        DiagnosResponse response = new DiagnosResponse();
        String diagnosisResult = categoriesToImprove.isEmpty() ?
                "Tất cả các chuyên môn đều ổn." :
                "Đây là cơ hội tuyệt vời để cải thiện và phát triển các khía cạnh trong mối quan hệ của bạn: " + String.join(", ", categoriesToImprove);


        if (!categoriesToImprove.isEmpty()) {
            response.setCategoriesToImprove(categoriesToImprove);
            response.setReasons(reasons);
            response.setConsultations(consultations);
            response.setDiagnosisResult(diagnosisResult + ". Đề nghị gặp chuyên gia tư vấn nếu cần.");
        } else {
            response.setDiagnosisResult(diagnosisResult);
        }

        return response;
    }
}
