package com.example.demo.entity.request;

import com.example.demo.enums.CategoryEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpertRequest {

    @NotBlank(message = "Username cannot be blank")
    private String username;  // Tên tài khoản đăng nhập

    @NotBlank(message = "Password cannot be blank")
    private String password;  // Mật khẩu đăng nhập

    @NotBlank(message = "Name cannot be blank")
    private String name;      // Tên đầy đủ của Expert (plan to inherit from User)

    @NotBlank(message = "Email cannot be blank")
    private String email;      // Tên đầy đủ của Expert (plan to inherit from User)

    @NotBlank(message = "Phone cannot be blank")
    private String phone;     // Số điện thoại (plan to inherit from User)

    @NotBlank(message = "Address cannot be blank")
    private String address;   // Địa chỉ (plan to inherit from User)

    private CategoryEnum specialty;  // Chuyên môn

    private String avatar;     // Ảnh đại diện


    @NotEmpty(message = "Certificates cannot be empty")
    private List<CertificateRequest> certificates;  // Danh sách chứng chỉ

}
