package com.example.demo.service;

import com.example.demo.entity.Answer;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.enums.CategoryEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class PremaritalTestService {

    @Autowired
    private ExpertService expertService;

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

        // Trả về danh sách chuyên môn
        return result;
    }
}
