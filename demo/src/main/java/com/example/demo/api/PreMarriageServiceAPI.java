package com.example.demo.api;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.ServicePackageRequest;
import com.example.demo.service.PreMarriageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service")
@SecurityRequirement(name = "api")
public class PreMarriageServiceAPI {
    @Autowired
    PreMarriageService preMarriageService;
    @PostMapping
    public ResponseEntity createService(@Valid @RequestBody ServicePackageRequest servicePackageRequest){
        System.out.println("🔵 Nhận request tạo ServicePackage: " + servicePackageRequest);
        ServicePackage servicePackage = preMarriageService.createService(servicePackageRequest);
        System.out.println("🟢 Đã tạo ServicePackage: " + servicePackage);
        return ResponseEntity.ok(servicePackage);
    }
    @GetMapping
    public ResponseEntity getService(){
        List<ServicePackage> servicePackages = PreMarriageService.getAllService();
        return ResponseEntity.ok(servicePackages);
    }
}
