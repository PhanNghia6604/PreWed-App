package com.example.demo.repository;

import com.example.demo.entity.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface serviceRepository extends JpaRepository<ServicePackage, Long> {
}
