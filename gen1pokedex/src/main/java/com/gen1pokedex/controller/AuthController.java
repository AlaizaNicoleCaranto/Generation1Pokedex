package com.gen1pokedex.controller;

import com.gen1pokedex.dto.AuthRequest;
import com.gen1pokedex.dto.AuthResponse;
import com.gen1pokedex.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

// Controller for authentication endpoints such as login and JWT token generation
@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
}