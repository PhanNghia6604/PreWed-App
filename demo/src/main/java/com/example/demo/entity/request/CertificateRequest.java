package com.example.demo.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequest {
    private String certificateUrl;   // URL của chứng chỉ
    private String certificateName;  // Tên chứng chỉ mà người dùng nhập
}

