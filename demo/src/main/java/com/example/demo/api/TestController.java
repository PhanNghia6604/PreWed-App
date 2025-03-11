package com.example.demo.api;

import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.entity.response.DiagnosResponse;
import com.example.demo.service.PremaritalTestService;
import com.example.demo.service.DiagnosService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@SecurityRequirement(name = "api")
public class TestController {

    @Autowired
    private PremaritalTestService premaritalTestService;

    @Autowired
    private DiagnosService diagnosService;

    @PostMapping("/submit")
    public DiagnosResponse submitTest(@RequestBody PremaritalTestRequest testRequest) {
        // Đánh giá bài kiểm tra và lấy danh sách các chuyên môn cần cải thiện
        List<String> categoriesToImprove = premaritalTestService.evaluateTest(testRequest);

        // Tạo DiagnosResponseDTO và trả về kết quả
        return diagnosService.createDiagnosResponse(categoriesToImprove);
    }
}
