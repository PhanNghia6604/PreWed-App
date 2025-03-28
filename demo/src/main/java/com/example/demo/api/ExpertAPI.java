package com.example.demo.api;

import com.example.demo.entity.Expert;
import com.example.demo.entity.request.ExpertRequest;
import com.example.demo.entity.response.ExpertResponse;
import com.example.demo.service.ExpertService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
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
        try {
            Expert expert = expertService.createExpert(request);
            return ResponseEntity.ok(expert);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Trả về lỗi nếu specialty không hợp lệ
        }
    }
    @PutMapping("/approve/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<String> approveExpert(@PathVariable Long id) {
        boolean result = expertService.approveExpert(id);
        if (result) {
            return ResponseEntity.ok("Expert approved successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expert not found");
        }
    }

    @PutMapping("/reject/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<String> rejectExpert(@PathVariable Long id) {
        boolean result = expertService.rejectExpert(id);
        if (result) {
            return ResponseEntity.ok("Expert rejected successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expert not found or already approved");
        }
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
        if (!response.isApproved()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Expert chưa được admin duyệt
        }
        return ResponseEntity.ok(response); // Trả về thông tin profile của Expert
    }
    @GetMapping("/all")
    public List<ExpertResponse> getAllExperts() {
        return expertService.getAllExperts(); // Gọi phương thức từ service
    }

    @PutMapping("/expert/{id}")
    public ExpertResponse updateExpert(@PathVariable Long id, @RequestBody ExpertRequest request) {
        try {
            Expert updatedExpert = expertService.updateExpertbyID(id, request);

            // Chuyển đổi Expert thành ExpertResponse và trả về
            ExpertResponse response = new ExpertResponse();
            response.setId(updatedExpert.getId());
            response.setUsername(updatedExpert.getUsername());
            response.setEmail(updatedExpert.getEmail());
            response.setName(updatedExpert.getName());
            response.setPhone(updatedExpert.getPhone());
            response.setAddress(updatedExpert.getAddress());
            response.setSpecialty(updatedExpert.getSpecialty());
            response.setAvatar(updatedExpert.getAvatar());
            response.setCertificates(updatedExpert.getCertificates());
            response.setApproved(updatedExpert.isApproved());

            return response;
        } catch (RuntimeException e) {
            return new ExpertResponse();  // Trả về lỗi nếu specialty không hợp lệ hoặc có lỗi khác
        }
    }

    @PutMapping("/expert/update")
    public ExpertResponse updateLoggedInExpert(@RequestBody ExpertRequest request) {
        Expert updatedExpert = expertService.updateExpert(request);

        // Chuyển đổi Expert thành ExpertResponse và trả về
        ExpertResponse response = new ExpertResponse();
        response.setUsername(updatedExpert.getUsername());
        response.setEmail(updatedExpert.getEmail());
        response.setName(updatedExpert.getName());
        response.setPhone(updatedExpert.getPhone());
        response.setAddress(updatedExpert.getAddress());
        response.setSpecialty(updatedExpert.getSpecialty());
        response.setAvatar(updatedExpert.getAvatar());
        response.setCertificates(updatedExpert.getCertificates());

        return response;
    }
    @GetMapping("/pending")
    @Secured("ROLE_ADMIN") // hoặc "ROLE_MANAGER" nếu em dùng MANAGER
    public ResponseEntity<List<ExpertResponse>> getPendingExperts() {
        List<ExpertResponse> pendingExperts = expertService.getPendingExperts();
        return ResponseEntity.ok(pendingExperts);
    }



}

