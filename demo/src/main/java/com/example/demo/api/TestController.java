package com.example.demo.api;

import com.example.demo.entity.PremaritalTest;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.entity.response.DiagnosResponse;
import com.example.demo.service.PremaritalTestService;
import com.example.demo.service.DiagnosService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private PremaritalTestService premaritalTestService;

    @PostMapping("/submit")
    @Secured("ROLE_CUSTOMER")
    public ResponseEntity<DiagnosResponse> submitTest(@RequestBody PremaritalTestRequest testRequest) {
        // Đánh giá bài kiểm tra và trả về kết quả chẩn đoán
        DiagnosResponse diagnosResponse = premaritalTestService.evaluateTest(testRequest);
        return ResponseEntity.ok(diagnosResponse);  // Trả về kết quả Diagnos
    }

    @GetMapping("/history/{userId}")
    @Secured("ROLE_CUSTOMER")
    public ResponseEntity<List<PremaritalTest>> getTestHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(premaritalTestService.getTestHistory(userId));
    }

    @GetMapping("/all")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<List<PremaritalTest>> getAllTestHistory() {
        return ResponseEntity.ok(premaritalTestService.getTestHistory(null));  // Lấy tất cả bài kiểm tra
    }
}
