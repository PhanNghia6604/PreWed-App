package com.example.demo.utils;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserUtils implements ApplicationContextAware {
private static UserRepository userRepository;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        userRepository = applicationContext.getBean(UserRepository.class);
    }
public User getCurrentUser(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
}
}
