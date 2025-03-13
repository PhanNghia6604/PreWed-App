package com.example.demo.repository;

import com.example.demo.entity.PremaritalTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PremaritalTestRepository extends JpaRepository<PremaritalTest, Long> {
    List<PremaritalTest> findByUserId(Long userId);  // Truy vấn lịch sử theo userId
}

