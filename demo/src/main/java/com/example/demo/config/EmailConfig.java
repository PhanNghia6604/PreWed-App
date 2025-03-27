package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Cấu hình máy chủ Gmail SMTP
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        // Đặt thông tin tài khoản email
        mailSender.setUsername("gbaogia111@gmail.com"); // Thay bằng email của bạn
        mailSender.setPassword("dpif frfh yipl jecc"); // Thay bằng mật khẩu ứng dụng

        // Cấu hình các thuộc tính SMTP
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2"); // Thêm TLS nếu cần

        return mailSender;
    }
}