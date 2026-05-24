package com.gen1pokedex.controller;

import com.gen1pokedex.dto.AuthRequest;
import com.gen1pokedex.dto.AuthResponse;
import com.gen1pokedex.security.JwtUtil;
import com.gen1pokedex.dto.ForgotPasswordRequest;
import com.gen1pokedex.dto.ResetPasswordRequest;
import com.gen1pokedex.dto.ChangePasswordRequest;
import com.gen1pokedex.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

// Controller for authentication endpoints such as login and JWT token generation
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PasswordResetService passwordResetService;

    // Authentication manager for login verification
    @Autowired
    private AuthenticationManager authenticationManager;

    // Load user details to generate JWT tokens
    @Autowired
    private UserDetailsService userDetailsService;

    // JWT utility for token creation and validation
    @Autowired
    private JwtUtil jwtUtil;

    // Login endpoint that authenticates credentials and returns a JWT token
    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        // Authenticate the supplied credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()));

        // Load user details and generate a JWT for the authenticated user
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        return new AuthResponse(jwt, userDetails.getUsername());
    }

    // Forgot Password - Send reset link to email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.createPasswordResetToken(request.getEmail());
            return ResponseEntity.ok().body(Map.of("message", "Password reset link sent to email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Reset Password - Use token to set new password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok().body(Map.of("message", "Password reset successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Change Password - For logged in users
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            passwordResetService.changePassword(request.getUsername(), request.getCurrentPassword(),
                    request.getNewPassword());
            return ResponseEntity.ok().body(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}