package com.example.demo.api;

import com.example.demo.entity.User;
import com.example.demo.entity.VerificationCode;
import com.example.demo.entity.request.*;
import com.example.demo.entity.response.UserResponse;
import com.example.demo.repository.VerificationCodeRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class UserAPI {

    @Autowired
    UserService userService;


    @Autowired
    private EmailService emailService; // Giả sử EmailService sẽ gửi email cho người dùng

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;



    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        User user = userService.findByEmail(email);

        if (user != null) {
            // Tạo mã xác nhận ngẫu nhiên
            String verificationCode = generateRandomCode();

            // Lưu mã xác nhận vào cơ sở dữ liệu và liên kết với người dùng
            userService.saveVerificationCode(verificationCode, email);

            // Gửi mã xác nhận qua email
            emailService.sendVerificationCode(email, verificationCode);

            return ResponseEntity.ok("Mã xác nhận đã được gửi vào email.");
        }

        // Nếu email không tồn tại trong hệ thống
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email không tồn tại.");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest request) {
        String code = request.getCode();  // Lấy mã xác nhận người dùng nhập

        // Tìm mã xác nhận trong cơ sở dữ liệu
        List<VerificationCode> verificationCodes = verificationCodeRepository.findByCode(code);

        if (verificationCodes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác nhận không hợp lệ.");
        }

        // Lấy mã xác nhận hợp lệ nhất (mới nhất) từ danh sách
        VerificationCode verificationCode = verificationCodes.get(0);

        // Kiểm tra nếu mã xác nhận đã hết hạn
        LocalDateTime currentTime = LocalDateTime.now();
        if (verificationCode.getExpirationTime().isBefore(currentTime)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác nhận đã hết hạn.");
        }

        // Nếu mã hợp lệ và chưa hết hạn, cho phép người dùng thay đổi mật khẩu
        return ResponseEntity.ok("Mã xác nhận hợp lệ, vui lòng nhập mật khẩu mới.");
    }




    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String code = request.getCode();  // Mã xác nhận người dùng nhập
        String newPassword = request.getNewPassword();  // Mật khẩu mới
        String confirmPassword = request.getConfirmPassword();  // Mật khẩu xác nhận

        // Kiểm tra nếu mật khẩu mới và mật khẩu xác nhận có khớp không
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu xác nhận không khớp.");
        }

        // Kiểm tra mã xác nhận hợp lệ và lấy người dùng
        User user = userService.validateVerificationCode(code);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác nhận không hợp lệ hoặc đã hết hạn.");
        }

        // Cập nhật mật khẩu cho người dùng
        boolean isPasswordUpdated = userService.updatePassword(user, newPassword);

        if (isPasswordUpdated) {
            return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Đổi mật khẩu thất bại.");
    }


    private String generateRandomCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000; // Mã 6 chữ số
        return String.valueOf(code);
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody AuthenticationRequest authenticationRequest){
        UserResponse userResponse =userService.login(authenticationRequest);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("logingoogle")
    public ResponseEntity loginGoogle(@RequestBody LoginGoogleRequest loginGoogleRequest){
        UserResponse userResponse =userService.loginGoogle(loginGoogleRequest);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("register")
    public ResponseEntity create(@Valid @RequestBody UserRequest user){
    User newUser = userService.create(user);
    return ResponseEntity.ok(newUser);
    }
        @GetMapping("get")
    public ResponseEntity getAllUser(){
        List<User> users =userService.getAllUser();
    return ResponseEntity.ok(users);
    }
    @GetMapping("{id}")
    public ResponseEntity getUserById(@PathVariable long id){
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity delete(@PathVariable long id){
        User user =userService.delete(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("{id}")
    @Secured({"ROLE_CUSTOMER", "ROLE_ADMIN"})
    public ResponseEntity updateUser(@PathVariable long id, @RequestBody UserRequest userRequest){
        User user=userService.update(id, userRequest);
        return ResponseEntity.ok(user);
    }

}
