package com.example.demo.repository;

import com.example.demo.entity.Expert;
import com.example.demo.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpertRepository extends JpaRepository<Expert, Long> {
    Optional<Expert> findByUsername(String username);
    List<Expert> findByApprovedFalse(); // Thêm truy vấn này

}
