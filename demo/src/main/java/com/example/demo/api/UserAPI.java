package com.example.demo.api;

import com.example.demo.entity.User;
import com.example.demo.entity.request.AuthenticationRequest;
import com.example.demo.entity.request.UserRequest;
import com.example.demo.entity.response.UserResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class UserAPI {

    @Autowired
    UserService userService;

    @PostMapping("login")
    public ResponseEntity login(@RequestBody AuthenticationRequest authenticationRequest){
        UserResponse userResponse =userService.login(authenticationRequest);
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
    @DeleteMapping("{id}")
    public ResponseEntity delete(@PathVariable long id){
        User user =userService.delete(id);
        return ResponseEntity.ok(user);
    }
    @PutMapping("{id}")
    public ResponseEntity updateUser(@PathVariable long id, @RequestBody UserRequest userRequest){
        User user=userService.update(id, userRequest);
        return ResponseEntity.ok(user);
    }
}
