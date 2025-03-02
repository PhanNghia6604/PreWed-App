package com.example.demo.api;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.ServicePackageRequest;
import com.example.demo.service.PreMarriageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/service")
@SecurityRequirement(name = "api")
public class PreMarriageServiceAPI {
    @Autowired
    PreMarriageService preMarriageService;
    @PostMapping
    public ResponseEntity createSpaService(@RequestBody ServicePackageRequest servicePackageRequest){
        ServicePackage servicePackage = preMarriageService.createService(servicePackageRequest);
        return ResponseEntity.ok(servicePackage);
    }
}
