package com.example.demo.api;

import com.example.demo.entity.Expert;
import com.example.demo.entity.request.ExpertRequest;
import com.example.demo.entity.response.ExpertResponse;
import com.example.demo.service.ExpertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expert")
public class ExpertAPI {
    private final ExpertService expertService;

    public ExpertAPI(ExpertService expertService) {
        this.expertService = expertService;
    }

    @PostMapping("/register")
    public ResponseEntity<Expert> registerExpert(@Valid @RequestBody ExpertRequest request) {
        Expert expert = expertService.createExpert(request);
        return ResponseEntity.ok(expert);
    }
    @GetMapping("/profile/{id}")
    public ResponseEntity<ExpertResponse> getExpertProfile(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // Người dùng chưa đăng nhập
        }

        ExpertResponse response = expertService.getExpertProfile(id);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Không tìm thấy expert
        }
        return ResponseEntity.ok(response); // Trả về thông tin profile của Expert
    }
    @GetMapping("/all")
    public List<ExpertResponse> getAllExperts() {
        return expertService.getAllExperts(); // Gọi phương thức từ service
    }
}
