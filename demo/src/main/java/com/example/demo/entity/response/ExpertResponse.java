package com.example.demo.entity.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpertResponse {

    private String username;  // Tên tài khoản đăng nhập
    private String email;     // Email
    private String name;      // Tên đầy đủ của Expert
    private String phone;     // Số điện thoại
    private String address;   // Địa chỉ
    private String specialty; // Chuyên ngành
    private String avatar;    // Avatar
    private List<String> certificates; // Chứng chỉ
    private boolean approved ;


}
