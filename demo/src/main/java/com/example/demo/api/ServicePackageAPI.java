package com.example.demo.api;

import com.example.demo.entity.ServicePackage;
import com.example.demo.service.ServicePackageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/servicepackage")
@SecurityRequirement(name = "api")
public class ServicePackageAPI {
    @Autowired
    ServicePackageService servicePackageService;

    @PostMapping("createService")
    public ResponseEntity createService(@Valid @RequestBody ServicePackage servicePackage) {
        ServicePackage newServicePackage = servicePackageService.register(servicePackage);
        return ResponseEntity.ok(newServicePackage);
    }

    @GetMapping
    public ResponseEntity getAllService() {
        List<ServicePackage> servicePackages = servicePackageService.getAllServicePackage();
        return ResponseEntity.ok(servicePackages);
    }

    @DeleteMapping("{id}")
    public ResponseEntity deleteService(@PathVariable long id) {
        ServicePackage servicePackage = servicePackageService.delete(id);
        return ResponseEntity.ok(servicePackage);
    }
}

