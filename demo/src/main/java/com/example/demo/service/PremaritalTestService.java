package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.PremaritalTest;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.enums.CategoryEnum;
import com.example.demo.repository.PremaritalTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
public class PremaritalTestService {

    @Autowired
    private ExpertService expertService;
    @Autowired
    private PremaritalTestRepository preMaritalTestRepository;


    public List<String> evaluateTest(PremaritalTestRequest testRequest) {
        List<String> result = new ArrayList<>();

        // Lặp qua tất cả các câu trả lời
        for (Answer answer : testRequest.getAnswers()) {
            // Nếu có câu trả lời "Không ổn", thêm chuyên môn vào danh sách
            if ("Không ổn".equalsIgnoreCase(answer.getAnswerText())) {
                // Dùng custom deserializer để ánh xạ category (giờ sẽ không cần ánh xạ thủ công)
                CategoryEnum category = answer.getCategory();
                result.add(category.name());  // Thêm chuyên môn vào kết quả
            }
        }
        // Lưu kết quả bài kiểm tra vào cơ sở dữ liệu
        PremaritalTest testHistory = new PremaritalTest();
        testHistory.setUserId(testRequest.getUserId());  // Set userId từ testRequest
        testHistory.setAnswers(result);
        testHistory.setTestDate(LocalDateTime.now());  // Set thời gian hiện tại
        preMaritalTestRepository.save(testHistory);  // Lưu vào cơ sở dữ liệu

        return result;  // Trả về danh sách chuyên môn cần cải thiện
    }
    // Lấy tất cả các bài kiểm tra
    public List<PremaritalTest> getAllTestHistory() {
        return preMaritalTestRepository.findAll();
    }

    // Lấy lịch sử bài kiểm tra của người dùng
    public List<PremaritalTest> getTestHistory(Long userId) {
        return preMaritalTestRepository.findByUserId(userId);  // Lấy bài kiểm tra theo userId
    }
}
