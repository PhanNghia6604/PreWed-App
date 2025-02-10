package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public User create(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUser() {
        return userRepository.findUsersByIsDeletedFalse();
    }

    public User delete(long id) {
        User user = userRepository.findUserById(id);
        user.isDeleted = true;
        return userRepository.save(user);
    }
}
