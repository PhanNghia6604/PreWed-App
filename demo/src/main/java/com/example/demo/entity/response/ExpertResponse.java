package com.example.demo.entity.response;

import com.example.demo.entity.Certificate;
import com.example.demo.enums.CategoryEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpertResponse {
    public long id;
    private String username;  // Tên tài khoản đăng nhập
    private String email;     // Email
    private String name;      // Tên đầy đủ của Expert
    private String phone;     // Số điện thoại
    private String address;   // Địa chỉ
    private CategoryEnum specialty; // Chuyên ngành
    private String avatar;    // Avatar
    private List<Certificate> certificates; // Chứng chỉ

    private boolean approved ;


}
