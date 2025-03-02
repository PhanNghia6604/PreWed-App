package com.example.demo.service;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.ServicePackageRequest;
import com.example.demo.exception.exceptions.NotFoundException;
import com.example.demo.repository.ServiceRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PreMarriageService {
    @Autowired
    ServiceRepository serviceRepository;
    @Autowired
    ModelMapper modelMapper;

    public List<ServicePackage> getAllService() {
        return serviceRepository.findAll();
    }

    public ServicePackage createService(ServicePackageRequest servicePackageRequest) {
    ServicePackage servicePackage = modelMapper.map(servicePackageRequest, ServicePackage.class);
    return serviceRepository.save(servicePackage);
    }

    public ServicePackage getServiceById(long id){
    return serviceRepository.findById(id).orElseThrow(() -> new NotFoundException("Service Not Found"));
    }
    public ServicePackage updateService(long id, ServicePackageRequest servicePackageRequest) {
        ServicePackage servicePackage = getServiceById(id);
        servicePackage.setName(servicePackageRequest.getName());
        servicePackage.setDescription(servicePackageRequest.getDescription());
        servicePackage.setPrice(servicePackageRequest.getPrice());
        servicePackage.setDuration(servicePackageRequest.getDuration());
        servicePackage.setExpertCommission(servicePackageRequest.getExpertCommission());
        return serviceRepository.save(servicePackage);
    }

    public ServicePackage deleteServiceById(long id) {
    ServicePackage servicePackage = getServiceById(id);
servicePackage.setAvailable(false);
return serviceRepository.save(servicePackage);
    }
}
