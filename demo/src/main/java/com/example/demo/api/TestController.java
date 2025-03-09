package com.example.demo.api;

import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.service.PremaritalTestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@SecurityRequirement(name = "api")
public class TestController {

    @Autowired
    private PremaritalTestService premaritalTestService;

    @PostMapping("/submit")
    public ResponseEntity<List<String>> submitTest(@RequestBody PremaritalTestRequest testRequest) {
        // Gọi service để đánh giá kết quả bài kiểm tra
        List<String> result = premaritalTestService.evaluateTest(testRequest);

        // Trả về kết quả là danh sách các chuyên môn cần tham khảo
        return ResponseEntity.ok(result);
    }
}

