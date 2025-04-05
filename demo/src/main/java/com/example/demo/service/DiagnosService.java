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

        // Nếu không có thể loại nào cần cải thiện, trả về kết quả mặc định
        String diagnosisResult = categoriesToImprove.isEmpty() ?
                "Tất cả các chuyên môn đều ổn." :
                "Đây là cơ hội tuyệt vời để cải thiện và phát triển các khía cạnh trong mối quan hệ của bạn: " + String.join(", ", categoriesToImprove);

        // Nếu có thể loại cần cải thiện, điền lý do và tư vấn
        if (!categoriesToImprove.isEmpty()) {
            response.setCategoriesToImprove(categoriesToImprove);
            response.setReasons(reasons);  // Thêm lý do vào response
            response.setConsultations(consultations);  // Thêm tư vấn vào response
            response.setDiagnosisResult(diagnosisResult + ". Đề nghị gặp chuyên gia tư vấn nếu cần.");
        } else {
            response.setDiagnosisResult(diagnosisResult);  // Nếu không có thể loại cần cải thiện
        }

        return response;
    }


}
