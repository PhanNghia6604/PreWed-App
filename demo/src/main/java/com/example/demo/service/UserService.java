package com.example.demo.service;

import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.User;
import com.example.demo.entity.request.AuthenticationRequest;
import com.example.demo.entity.request.UserRequest;
import com.example.demo.entity.response.UserResponse;
import com.example.demo.enums.RoleEnum;
import com.example.demo.exception.exceptions.NotFoundException;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

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

    @PreAuthorize("hasRole('MANAGER')")
    public List<User> getAllUser() {
        return userRepository.findUsersByIsDeletedFalse();
    }
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('MANAGER')")
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
        return userRepository.findByUsername(username) // Tìm user theo tên
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
    public UserResponse login(AuthenticationRequest authenticationRequest) {
    try{
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()
                )
        );
    }catch (Exception e){
        e.printStackTrace();
        throw new NullPointerException("Wrong username or password");
    }
 User user = userRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow();
    String token= tokenService.generateToken(user);
    UserResponse userResponse =new UserResponse();
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
        user.setPassword(userRequest.getPassword());
        return userRepository.save(user);
    }

    public User getUserById(long id) {
        return userRepository.findUserById(id);
    }
}
