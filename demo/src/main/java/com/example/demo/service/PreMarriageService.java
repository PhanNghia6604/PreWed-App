package com.example.demo.service;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.ServicePackageRequest;
import com.example.demo.repository.serviceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PreMarriageService {
    @Autowired
    serviceRepository serviceRepository;
    @Autowired
    ModelMapper modelMapper;

    public ServicePackage createService(ServicePackageRequest servicePackageRequest) {
    ServicePackage servicePackage = modelMapper.map(servicePackageRequest, ServicePackage.class);
    return serviceRepository.save(servicePackage);
    }
}
