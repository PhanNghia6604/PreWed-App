package com.example.demo.service;

import com.example.demo.entity.ServicePackage;
import com.example.demo.repository.ServicePackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicePackageService {
    @Autowired
    ServicePackageRepository servicePackageRepository;

    public ServicePackage register(ServicePackage servicePackage) {
        ServicePackage newServicePackage = servicePackageRepository.save(servicePackage);
        return newServicePackage;

    }
    public List<ServicePackage> getAllServicePackage(){
        return servicePackageRepository.findServicePackagesByIsDeletedFalse();
    }
    public ServicePackage delete(long id){
        ServicePackage servicePackage = servicePackageRepository.findServicePackageById(id);
        servicePackage.isDeleted = true;
        return servicePackageRepository.save(servicePackage);
    }
}
