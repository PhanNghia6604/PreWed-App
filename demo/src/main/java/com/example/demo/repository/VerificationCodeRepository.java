package com.example.demo.repository;

import com.example.demo.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    List<VerificationCode> findByCode(String code);  // Trả về danh sách các mã xác nhận từ cơ sở dữ liệu
}


