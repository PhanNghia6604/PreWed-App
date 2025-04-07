package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;  // Đảm bảo rằng bạn đã cấu hình JavaMailSender trong ứng dụng

    public void sendVerificationCode(String email, String verificationCode) {
        // Tạo đối tượng SimpleMailMessage để gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã xác nhận quên mật khẩu");
        message.setText("Mã xác nhận của bạn là: " + verificationCode);

        // Gửi email
        mailSender.send(message);
    }
}

