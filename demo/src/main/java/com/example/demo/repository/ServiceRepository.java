package com.example.demo.repository;

import com.example.demo.entity.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServicePackage, Long> {
    List<ServicePackage> findByIdIn(List<Long> serviceIds);
}
