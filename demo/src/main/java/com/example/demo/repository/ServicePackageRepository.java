package com.example.demo.repository;

import com.example.demo.entity.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {
    ServicePackage findServicePackageById(long id);

    List<ServicePackage> findServicePackagesByIsDeletedFalse();
}
