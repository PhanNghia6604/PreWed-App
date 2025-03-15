package com.example.demo.api;

import com.example.demo.entity.User;
import com.example.demo.entity.request.AuthenticationRequest;
import com.example.demo.entity.request.UserRequest;
import com.example.demo.entity.response.UserResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
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
    @Secured("ROLE_ADMIN")
    public ResponseEntity updateUser(@PathVariable long id, @RequestBody UserRequest userRequest){
        User user=userService.update(id, userRequest);
        return ResponseEntity.ok(user);
    }

}
