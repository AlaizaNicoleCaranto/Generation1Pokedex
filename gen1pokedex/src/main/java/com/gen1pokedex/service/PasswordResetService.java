package com.gen1pokedex.service;

import com.gen1pokedex.entity.PasswordResetToken;
import com.gen1pokedex.entity.User;
import com.gen1pokedex.exception.UserNotFoundException;
import com.gen1pokedex.repository.PasswordResetTokenRepo;
import com.gen1pokedex.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordResetTokenRepo tokenRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Create password reset token and "send" to email (console for now)
    @Transactional
    public void createPasswordResetToken(String email) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        // Delete any existing tokens for this user
        tokenRepository.deleteByUser_Id(user.getId());

        // Generate new token
        String token = UUID.randomUUID().toString();
        
        // Create token entity (expires in 1 hour)
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        resetToken.setUsed(false);
        
        tokenRepository.save(resetToken);
        
        // For development: Print token to console
        // In production: Send email with reset link
        System.out.println("=========================================");
        System.out.println("PASSWORD RESET TOKEN FOR " + user.getUsername());
        System.out.println("Token: " + token);
        System.out.println("Reset link: http://localhost:3000/reset-password?token=" + token);
        System.out.println("=========================================");
    }

    // Reset password using token
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Find token
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));
        
        // Check if token is used
        if (resetToken.isUsed()) {
            throw new RuntimeException("Token has already been used");
        }
        
        // Check if token is expired
        if (resetToken.isExpired()) {
            throw new RuntimeException("Token has expired");
        }
        
        // Get user
        User user = resetToken.getUser();
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    // Change password for logged in user
    public void changePassword(String username, String currentPassword, String newPassword) {
        // Find user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Validate new password length
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}