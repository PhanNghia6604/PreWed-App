package com.example.demo.api;

import com.example.demo.entity.PremaritalTest;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.entity.response.DiagnosResponse;
import com.example.demo.entity.response.ExpertResponse;
import com.example.demo.service.PremaritalTestService;
import com.example.demo.service.DiagnosService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private PremaritalTestService premaritalTestService;
    @Autowired
    private DiagnosService diagnosService;

    /**
     * API để người dùng gửi bài kiểm tra và nhận kết quả phân tích.
     * @param testRequest - Thông tin bài kiểm tra
     * @return DiagnosResponse - Kết quả phân tích và khía cạnh cần cải thiện
     */
    @PostMapping("/submit")
    @Secured("ROLE_CUSTOMER")  // Phân quyền cho người dùng có quyền ROLE_CUSTOMER
    public ResponseEntity<DiagnosResponse> submitTest(@RequestBody PremaritalTestRequest testRequest) {
        // Đánh giá bài kiểm tra và trả về kết quả chẩn đoán
        DiagnosResponse diagnosResponse = premaritalTestService.evaluateTest(testRequest);
        return ResponseEntity.ok(diagnosResponse);  // Trả về kết quả Diagnos
    }

    /**
     * API để lấy lịch sử bài kiểm tra của người dùng.
     * @param userId - ID của người dùng
     * @return List<PremaritalTest> - Lịch sử các bài kiểm tra của người dùng
     */
    @GetMapping("/history/{userId}")
    @Secured("ROLE_CUSTOMER")  // Phân quyền cho người dùng có quyền ROLE_CUSTOMER
    public ResponseEntity<List<PremaritalTest>> getTestHistory(@PathVariable Long userId) {
        // Lấy lịch sử bài kiểm tra của người dùng
        List<PremaritalTest> testHistory = premaritalTestService.getTestHistory(userId);
        return ResponseEntity.ok(testHistory);
    }

    /**
     * API để admin lấy tất cả lịch sử bài kiểm tra từ tất cả người dùng.
     * @return List<PremaritalTest> - Tất cả bài kiểm tra
     */
    @GetMapping("/all")
    @Secured("ROLE_ADMIN")  // Phân quyền cho người dùng có quyền ROLE_ADMIN
    public ResponseEntity<List<PremaritalTest>> getAllTestHistory() {
        // Lấy tất cả bài kiểm tra từ cơ sở dữ liệu
        List<PremaritalTest> allTestHistory = premaritalTestService.getTestHistory(null);  // null có thể dùng để lấy tất cả nếu không có userId
        return ResponseEntity.ok(allTestHistory);
    }

}
