package com.example.demo.api;

import com.example.demo.entity.PremaritalTest;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.entity.response.DiagnosResponse;
import com.example.demo.service.PremaritalTestService;
import com.example.demo.service.DiagnosService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private PremaritalTestService premaritalTestService;

    @Autowired
    private DiagnosService diagnosService;
//all
    // Phương thức POST để submit bài kiểm tra
    @PostMapping("/submit")
    @Secured("ROLE_CUSTOMER")
    public DiagnosResponse submitTest(@RequestBody PremaritalTestRequest testRequest) {
        // Đánh giá bài kiểm tra và lấy danh sách các chuyên môn cần cải thiện
        List<String> categoriesToImprove = premaritalTestService.evaluateTest(testRequest);

        // Tạo DiagnosResponseDTO và trả về kết quả
        return diagnosService.createDiagnosResponse(categoriesToImprove);
    }
//all
    // Phương thức GET để lấy lịch sử bài kiểm tra của người dùng
    @GetMapping("/history/{userId}")
    @Secured("ROLE_CUSTOMER")
    public List<PremaritalTest> getTestHistory(@PathVariable Long userId) {
        return premaritalTestService.getTestHistory(userId);
    }
//all
    // API lấy tất cả bài kiểm tra
    @GetMapping("/all")
    @Secured("ROLE_CUSTOMER")
    public List<PremaritalTest> getAllTestHistory() {
        // Trả về tất cả các bài kiểm tra trong hệ thống
        return premaritalTestService.getAllTestHistory();
    }
}
