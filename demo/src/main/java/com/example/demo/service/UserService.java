package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.entity.request.UserRequest;
import com.example.demo.enums.RoleEnum;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public User create(UserRequest userRequest) {
        User user = new User();
        user.setRoleEnum(RoleEnum.CUSTOMER);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setAddress(userRequest.getAddress());

        User newUser = userRepository.save(user);
        return newUser;
    }

    public List<User> getAllUser() {
        return userRepository.findUsersByIsDeletedFalse();
    }

    public User delete(long id) {
        User user = userRepository.findUserById(id);
        user.isDeleted = true;
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
