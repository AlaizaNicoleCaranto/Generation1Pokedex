package com.gen1pokedex.service;

import com.gen1pokedex.dto.UserProfileDTO;
import com.gen1pokedex.entity.User; // user entity for database operations
import com.gen1pokedex.entity.UserStatus; // enum for user account status
import com.gen1pokedex.exception.UserNotFoundException; // thrown when user not found
import com.gen1pokedex.repository.UserRepo; // user data persistence access
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // password hashing
import org.springframework.stereotype.Service; // marks as service component
import org.springframework.transaction.annotation.Transactional; // manages transactions for data integrity

import java.time.LocalDateTime; // timestamp tracking
import java.util.List; // collections for lists
import java.util.Random; // random password generation
import java.util.stream.Collectors; // stream operations for data transformation

// Service implementation for admin user management operations
@Service
public class UserManagementServiceImpl implements UserManagementService {

    @Autowired
    private UserRepo userRepository; // access user records from database

    @Autowired
    private BCryptPasswordEncoder encoder; // hash passwords securely

    @Autowired
    private AuditLogService auditLogService; // log all admin actions for accountability

    @Override
    public List<UserProfileDTO> getAllUsers() {
        // Retrieve all users from database
        List<User> allUsers = userRepository.findAll();

        // Convert to DTOs to avoid exposing passwords
        return allUsers.stream()
                .map(this::mapToProfileDTO) // transform each User to UserProfileDTO
                .collect(Collectors.toList()); // collect into List
    }

    @Override
    public UserProfileDTO getUserDetails(String username) {
        // Find user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Convert to safe DTO before returning
        return mapToProfileDTO(user);
    }

    @Override
    public UserProfileDTO updateUserStatus(String username, UserStatus newStatus) {
        // Find the user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Store old status for audit logging
        UserStatus oldStatus = user.getStatus();

        // Update status to new value
        user.setStatus(newStatus);

        // Update the timestamp for this modification
        user.setUpdatedAt(LocalDateTime.now());

        // Save changes to database
        User updatedUser = userRepository.save(user);

        // Log this status change for transparency
        auditLogService.log("SYSTEM", "STATUS_CHANGED", "User", user.getId(),
                "Username: " + username + " | Changed from " + oldStatus + " to " + newStatus, null); // log status
                                                                                                      // change event

        // Return updated profile
        return mapToProfileDTO(updatedUser);
    }

    @Override
    @Transactional
    public UserProfileDTO banUser(String username, String reason) {
        // Find user to ban
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Check user is not already banned
        if (user.getStatus() == UserStatus.BANNED) {
            throw new RuntimeException("User is already banned");
        }

        // Set status to BANNED
        user.setStatus(UserStatus.BANNED);

        // Update modification timestamp
        user.setUpdatedAt(LocalDateTime.now());

        // Save banned user
        User bannedUser = userRepository.save(user);

        // Log ban action with reason for admin review
        auditLogService.log("SYSTEM", "USER_BANNED", "User", user.getId(),
                "Username: " + username + " | Reason: " + reason, null); // log suspension event

        // Return updated profile
        return mapToProfileDTO(bannedUser);
    }

    @Override
    @Transactional
    public UserProfileDTO suspendUser(String username, String reason) {
        // Find user to suspend
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Check user is not already suspended
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("User is already suspended");
        }

        // Set status to SUSPENDED
        user.setStatus(UserStatus.SUSPENDED);

        // Update modification timestamp
        user.setUpdatedAt(LocalDateTime.now());

        // Save suspended user
        User suspendedUser = userRepository.save(user);

        // Log suspension with reason for admin records
        auditLogService.log("SYSTEM", "USER_SUSPENDED", "User", user.getId(),
                "Username: " + username + " | Reason: " + reason, null); // log suspension event

        // Return updated profile
        return mapToProfileDTO(suspendedUser);
    }

    @Override
    public UserProfileDTO reactivateUser(String username) {
        // Find user to reactivate
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Store previous status for logging
        UserStatus previousStatus = user.getStatus();

        // Set status back to ACTIVE
        user.setStatus(UserStatus.ACTIVE);

        // Update modification timestamp
        user.setUpdatedAt(LocalDateTime.now());

        // Save reactivated user
        User reactivatedUser = userRepository.save(user);

        // Log reactivation action
        auditLogService.log("SYSTEM", "USER_REACTIVATED", "User", user.getId(),
                "Username: " + username + " | From: " + previousStatus, null); // log reactivation event

        // Return updated profile
        return mapToProfileDTO(reactivatedUser);
    }

    @Override
    @Transactional
    public UserProfileDTO resetUserCollection(String username) {
        // Find user whose collection will be reset
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Store count for logging purposes
        int removedCount = user.getPokemons().size();

        // Clear all caught Pokemon from collection
        user.getPokemons().clear();

        // Also clear any favorited Pokemon
        user.getFavorites().clear();

        // Update modification timestamp
        user.setUpdatedAt(LocalDateTime.now());

        // Save user with empty collection
        User resetUser = userRepository.save(user);

        // Log this action with count for accountability
        auditLogService.log("SYSTEM", "COLLECTION_RESET", "User", user.getId(),
                "Username: " + username + " | Removed " + removedCount + " Pokemon", null); // log collection reset

        // Return updated profile
        return mapToProfileDTO(resetUser);
    }

    @Override
    public UserProfileDTO resetUserPassword(String username) {
        // Find user whose password will be reset
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Generate temporary password (8 random alphanumeric characters)
        String temporaryPassword = generateTemporaryPassword();

        // Hash the temporary password before storing
        user.setPassword(encoder.encode(temporaryPassword));

        // Update modification timestamp
        user.setUpdatedAt(LocalDateTime.now());

        // Save user with new hashed password
        User updatedUser = userRepository.save(user);

        // Log password reset for security audit trail
        auditLogService.log("SYSTEM", "PASSWORD_RESET", "User", user.getId(),
                "Username: " + username + " | Admin-initiated password reset", null); // log password reset event

        // Note: In production, send temporary password to user's email
        System.out.println("TEMP PASSWORD FOR " + username + ": " + temporaryPassword);

        // Return updated profile
        return mapToProfileDTO(updatedUser);
    }

    @Override
    public boolean isUserActive(String username) {
        // Try to find user in database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

        // Return true only if status is ACTIVE
        return user.getStatus() == UserStatus.ACTIVE;
    }

    // Helper method to convert User entity to UserProfileDTO safely (no password
    // exposure)
    private UserProfileDTO mapToProfileDTO(User user) {
        // Create new profile DTO
        UserProfileDTO profile = new UserProfileDTO();

        // Set all user data (no password)
        profile.setUsername(user.getUsername());
        profile.setRole(user.getRole());
        profile.setEmail(user.getEmail());
        profile.setBio(user.getBio());
        profile.setPokemonCount(user.getPokemons().size());
        profile.setFavoriteCount(user.getFavorites().size());

        // Calculate completion percentage (caught / 151 * 100)
        double completionPercentage = (user.getPokemons().size() / 151.0) * 100;
        profile.setCompletionPercentage(completionPercentage);

        // Also set user status for admin visibility
        profile.setStatus(user.getStatus() != null ? user.getStatus().toString() : "ACTIVE");

        // Return complete profile DTO
        return profile;
    }

    // Helper method to generate a temporary password for reset scenarios
    private String generateTemporaryPassword() {
        // Character pool for password generation
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        // Random number generator
        Random random = new Random();

        // Build 8-character password
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            // Pick random character from pool
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }

        // Return generated password
        return password.toString();
    }
}
