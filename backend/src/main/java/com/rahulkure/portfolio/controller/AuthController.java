package com.rahulkure.portfolio.controller;

import com.rahulkure.portfolio.dto.LoginRequest;
import com.rahulkure.portfolio.dto.LoginResponse;
import com.rahulkure.portfolio.repository.AdminUserRepository;
import com.rahulkure.portfolio.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminUserRepository adminRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(AdminUserRepository adminRepo, PasswordEncoder encoder, JwtService jwtService) {
        this.adminRepo = adminRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        var user = adminRepo.findByUsername(req.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return new LoginResponse(jwtService.generateToken(user.getUsername()));
    }
}
