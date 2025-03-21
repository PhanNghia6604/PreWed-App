package com.example.demo.api;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.ServicePackageRequest;
import com.example.demo.service.PreMarriageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicepackage")
public class PreMarriageServiceAPI {

    @Autowired
    PreMarriageService preMarriageService;

    @PostMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity createService(@Valid @RequestBody ServicePackageRequest servicePackageRequest){
        System.out.println("🔵 Nhận request tạo ServicePackage: " + servicePackageRequest);
        ServicePackage servicePackage = preMarriageService.createService(servicePackageRequest);
        System.out.println("🟢 Đã tạo ServicePackage: " + servicePackage);
        return ResponseEntity.ok(servicePackage);
    }

    @GetMapping
    @Secured({"ROLE_ADMIN", "ROLE_CUSTOMER"})
    public ResponseEntity getService(){
        List<ServicePackage> servicePackages = preMarriageService.getAllService();
        return ResponseEntity.ok(servicePackages);
    }

    @PutMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity updateSpaService(@PathVariable long id, @RequestBody ServicePackageRequest servicePackageRequest){
        ServicePackage servicePackage = preMarriageService.updateService(id, servicePackageRequest);
        return ResponseEntity.ok(servicePackage);
    }

    @GetMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getSpaServiceById(@PathVariable long id){
        ServicePackage servicePackage = preMarriageService.getServiceById(id);
        return ResponseEntity.ok(servicePackage);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity deleteSpaServiceById(@PathVariable long id){
        ServicePackage servicePackage = preMarriageService.deleteServiceById(id);
        return ResponseEntity.ok(servicePackage);
    }
}
