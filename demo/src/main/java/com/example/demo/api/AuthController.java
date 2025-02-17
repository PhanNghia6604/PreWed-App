package com.example.demo.api;


import com.example.demo.entity.request.UserRequest;
import com.example.demo.security.JwtUtils;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword())
            );

            final UserDetails userDetails = userService.loadUserByUsername(request.getName());
            final String jwt = jwtUtil.generateToken(userDetails.getUsername());

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login Success",
                            "status", true,
                            "token", jwt
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    Map.of(
                            "message", "Invalid username or password",
                            "status", false
                    )
            );
        }

    }

}