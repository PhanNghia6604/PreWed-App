package com.example.demo.entity.request;

public class ResetPasswordRequest {
    private String code;  // Mã xác nhận người dùng nhập
    private String newPassword;  // Mật khẩu mới
    private String confirmPassword;  // Mật khẩu xác nhận

    // Getter và Setter
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}


