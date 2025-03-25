package com.example.demo.service;

import com.example.demo.entity.DTO.Answer;
import com.example.demo.entity.Diagnos;
import com.example.demo.entity.PremaritalTest;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.entity.response.DiagnosResponse;
import com.example.demo.enums.CategoryEnum;
import com.example.demo.repository.PremaritalTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@Service
public class PremaritalTestService {

    @Autowired
    private PremaritalTestRepository premaritalTestRepository;
    @Autowired
    private DiagnosService diagnosService;

    public DiagnosResponse evaluateTest(PremaritalTestRequest testRequest) {
        List<String> result = new ArrayList<>();

        // Lặp qua tất cả các câu trả lời
        for (Answer answer : testRequest.getAnswers()) {
            // Nếu có câu trả lời "Không ổn", thêm chuyên môn vào danh sách
            if ("Không ổn".equalsIgnoreCase(answer.getAnswerText())) {
                CategoryEnum category = answer.getCategory();
                result.add(category.name());  // Thêm chuyên môn vào kết quả
            }
        }

        // Lưu kết quả bài kiểm tra vào cơ sở dữ liệu
        PremaritalTest testHistory = new PremaritalTest();
        testHistory.setUserId(testRequest.getUserId());
        testHistory.setAnswers(result);  // Lưu các chuyên môn cần cải thiện
        testHistory.setTestDate(LocalDateTime.now());

        // Tạo Diagnos kết quả
        Diagnos diagnos = new Diagnos();
        diagnos.setCategoriesToImprove(result);
        diagnos.setDiagnosisResult("Cần cải thiện các chuyên môn: " + String.join(", ", result));
        diagnos.setPremaritalTest(testHistory);  // Liên kết với bài kiểm tra

        // Lưu kết quả chẩn đoán vào cơ sở dữ liệu
        testHistory.setDiagnosResults(Arrays.asList(diagnos));  // Liên kết với các kết quả chẩn đoán

        premaritalTestRepository.save(testHistory);  // Lưu bài kiểm tra và kết quả chẩn đoán

        // Gọi DiagnosService để tạo kết quả chẩn đoán và trả về
        return diagnosService.createDiagnosResponse(result);  // Trả về DiagnosResponse
    }

    public List<PremaritalTest> getTestHistory(Long userId) {
        return premaritalTestRepository.findByUserId(userId);
    }
}
