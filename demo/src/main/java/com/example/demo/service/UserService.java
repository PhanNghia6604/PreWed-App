package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.entity.VerificationCode;
import com.example.demo.entity.request.AuthenticationRequest;
import com.example.demo.entity.request.LoginGoogleRequest;
import com.example.demo.entity.request.UserRequest;
import com.example.demo.entity.response.UserResponse;
import com.example.demo.repository.VerificationCodeRepository;
import com.example.demo.enums.RoleEnum;
import com.example.demo.repository.UserRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.internal.constraintvalidators.bv.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;  // Repository để lưu mã xác nhận

    @Autowired
    TokenService tokenService;

    public User create(UserRequest userRequest) {
        User user = new User();
        user.setRoleEnum(RoleEnum.CUSTOMER);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setName(userRequest.getName());
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());

        User newUser = userRepository.save(user);
        return newUser;
    }

    public List<User> getAllUser() {
        return userRepository.findUsersByIsDeletedFalse();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Lấy username từ SecurityContext
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


    public User delete(long id) {
        User user = userRepository.findUserById(id);
        user.isDeleted = true;
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Authenticating {}", username);
        if (new EmailValidator().isValid(username, null)) {
            return userRepository
                    .findByUsername(username)
                    .map(this::createSpringSecurityUser)
                    .orElseThrow(() -> new UsernameNotFoundException("User with email " + username + " not found"));
        }

        final var lowerCaseLogin = username.toLowerCase(Locale.ENGLISH);
        return userRepository
                .findByUsername(lowerCaseLogin)
                .map(this::createSpringSecurityUser)
                .orElseThrow(() -> new UsernameNotFoundException("User" + lowerCaseLogin + " not found"));
    }

    private org.springframework.security.core.userdetails.User createSpringSecurityUser(com.example.demo.entity.User user) {
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), List.of(new SimpleGrantedAuthority(user.getRoleEnum().name())));
    }

    public UserResponse login(AuthenticationRequest authenticationRequest) {
        // create an instance
        final var authenticationToken = new UsernamePasswordAuthenticationToken(
                authenticationRequest.getUsername(),
                authenticationRequest.getPassword()
        );

        // authenticate
        final var authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // set auth to context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow();
        String token = tokenService.generateToken(authentication);
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setId(user.getId());
        userResponse.setFullName(user.getName());
        userResponse.setPhone(user.getPhone());
        userResponse.setAddress(user.getAddress());
        userResponse.setRoleEnum(user.getRoleEnum());
        userResponse.setToken(token);
        return userResponse;
    }


    public User update(long id, UserRequest userRequest) {
        User user = userRepository.findUserById(id);
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        return userRepository.save(user);
    }

    public User getUserById(long id) {
        return userRepository.findUserById(id);
    }


    public UserResponse loginGoogle(LoginGoogleRequest loginGoogleRequest) {

        try{
            FirebaseToken decodeToken = FirebaseAuth.getInstance().verifyIdToken(loginGoogleRequest.getToken());
            String email = decodeToken.getEmail();
            User user = userRepository.findByEmail(email);

            // neu login gg tk email nay chua duoc dk thi dk
            if(user == null){
                user = new User();
                user.setName(decodeToken.getName());
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode("123456789"));
                user.setAddress("HCM");
                user.setUsername(email);
                user.setRoleEnum(RoleEnum.CUSTOMER);
                user = userRepository.save(user);
            }

            final var authenticationToken = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    "123456789"
            );

            // authenticate
            final var authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

            // set auth to context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenService.generateToken(authentication);
            UserResponse userResponse = new UserResponse();
            userResponse.setUsername(user.getUsername());
            userResponse.setEmail(user.getEmail());
            userResponse.setId(user.getId());
            userResponse.setFullName(user.getName());
            userResponse.setPhone(user.getPhone());
            userResponse.setAddress(user.getAddress());
            userResponse.setRoleEnum(user.getRoleEnum());
            userResponse.setToken(token);
            return userResponse;
        }catch (FirebaseAuthException e){
            e.printStackTrace();
        }
        return null;
    }
    // Tìm người dùng theo email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Lưu mã xác nhận vào cơ sở dữ liệu
    public void saveVerificationCode(String verificationCode, String email) {
        User user = userRepository.findByEmail(email);  // Tìm người dùng từ email

        if (user == null) {
            throw new IllegalArgumentException("User with email " + email + " does not exist.");
        }

        VerificationCode code = new VerificationCode();
        code.setCode(verificationCode);
        code.setExpirationTime(LocalDateTime.now().plusMinutes(3));  // Mã hết hạn sau 3 phút
        code.setUser(user);  // Liên kết mã xác nhận với người dùng

        verificationCodeRepository.save(code);  // Lưu mã xác nhận vào cơ sở dữ liệu
    }


    public User validateVerificationCode(String code) {
        List<VerificationCode> codes = verificationCodeRepository.findByCode(code);

        if (codes.isEmpty()) {
            return null;  // Mã xác nhận không hợp lệ
        }

        // Nếu có nhiều hơn 1 kết quả, lấy mã xác nhận hợp lệ nhất (chưa hết hạn và mới nhất)
        VerificationCode validCode = null;
        LocalDateTime currentTime = LocalDateTime.now();
        for (VerificationCode verificationCode : codes) {
            if (verificationCode.getExpirationTime() != null && verificationCode.getExpirationTime().isAfter(currentTime)) {
                if (validCode == null || verificationCode.getExpirationTime().isAfter(validCode.getExpirationTime())) {
                    validCode = verificationCode;
                }
            }
        }

        if (validCode == null) {
            return null;  // Không có mã xác nhận hợp lệ
        }

        return validCode.getUser();  // Trả về người dùng từ mã xác nhận hợp lệ
    }




    public boolean updatePassword(User user, String newPassword) {
        if (user == null) {
            return false;  // Người dùng không tồn tại
        }

        // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
        String encodedPassword = new BCryptPasswordEncoder().encode(newPassword);
        user.setPassword(encodedPassword);  // Cập nhật mật khẩu mới
        userRepository.save(user);
        return true;
    }

}

