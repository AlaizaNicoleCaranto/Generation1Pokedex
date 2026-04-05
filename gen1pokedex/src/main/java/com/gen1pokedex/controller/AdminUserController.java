package com.gen1pokedex.controller;

import com.gen1pokedex.dto.UserProfileDTO; // transfer object for user profiles
import com.gen1pokedex.entity.UserStatus; // enum for account status
import com.gen1pokedex.service.UserManagementService; // admin user management operations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // wrapper for response with status
import org.springframework.security.access.prepost.PreAuthorize; // authorization annotation
import org.springframework.web.bind.annotation.*; // REST endpoint annotations
import java.util.List; // collections import

// REST controller for admin user management endpoints
// All routes protected by @PreAuthorize requiring ROLE_ADMIN
@RestController
@RequestMapping("/api/admin/users") // base path for all user management endpoints
public class AdminUserController {

    @Autowired
    private UserManagementService userManagementService; // service for user operations

    // Get list of all trainers in the system
    // Endpoint: GET /api/admin/users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        // Retrieve all users via service layer
        List<UserProfileDTO> users = userManagementService.getAllUsers();

        // Return list with 200 OK status
        return ResponseEntity.ok(users);
    }

    // Get detailed information about a specific trainer
    // Endpoint: GET /api/admin/users/{username}
    @GetMapping("/{username}")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> getUserDetails(@PathVariable String username) {
        // Retrieve specific user by username
        UserProfileDTO userProfile = userManagementService.getUserDetails(username);

        // Return user details with 200 OK status
        return ResponseEntity.ok(userProfile);
    }

    // Ban a trainer permanently from the app
    // Endpoint: POST /api/admin/users/{username}/ban
    @PostMapping("/{username}/ban")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> banUser(
            @PathVariable String username, // trainer username to ban
            @RequestParam String reason) { // admin's reason for ban

        // Call service to ban user with provided reason
        UserProfileDTO bannedUser = userManagementService.banUser(username, reason);

        // Return updated profile with user now banned
        return ResponseEntity.ok(bannedUser);
    }

    // Suspend a trainer temporarily from the app
    // Endpoint: POST /api/admin/users/{username}/suspend
    @PostMapping("/{username}/suspend")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> suspendUser(
            @PathVariable String username, // trainer username to suspend
            @RequestParam String reason) { // admin's reason for suspension

        // Call service to suspend user with provided reason
        UserProfileDTO suspendedUser = userManagementService.suspendUser(username, reason);

        // Return updated profile with user now suspended
        return ResponseEntity.ok(suspendedUser);
    }

    // Reactivate a banned or suspended trainer account
    // Endpoint: POST /api/admin/users/{username}/reactivate
    @PostMapping("/{username}/reactivate")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> reactivateUser(@PathVariable String username) {
        // Call service to reactivate user back to ACTIVE status
        UserProfileDTO reactivatedUser = userManagementService.reactivateUser(username);

        // Return updated profile with user now active
        return ResponseEntity.ok(reactivatedUser);
    }

    // Clear all caught Pokemon from a trainer's collection (for rule
    // violations/cheating)
    // Endpoint: DELETE /api/admin/users/{username}/collection
    @DeleteMapping("/{username}/collection")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> resetUserCollection(@PathVariable String username) {
        // Call service to clear all Pokemon from user's collection
        UserProfileDTO resetUser = userManagementService.resetUserCollection(username);

        // Return updated profile showing empty collection (0 Pokemon)
        return ResponseEntity.ok(resetUser);
    }

    // Reset a trainer's password to temporary value
    // Endpoint: POST /api/admin/users/{username}/reset-password
    @PostMapping("/{username}/reset-password")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> resetUserPassword(@PathVariable String username) {
        // Call service to generate and set temporary password
        UserProfileDTO updatedUser = userManagementService.resetUserPassword(username);

        // Return updated profile with password reset
        return ResponseEntity.ok(updatedUser);
    }

    // Update a trainer's account status manually
    // Endpoint: PUT /api/admin/users/{username}/status
    @PutMapping("/{username}/status")
    @PreAuthorize("hasRole('ADMIN')") // require admin role to access
    public ResponseEntity<UserProfileDTO> updateUserStatus(
            @PathVariable String username, // trainer username
            @RequestParam UserStatus newStatus) { // new status (ACTIVE, BANNED, SUSPENDED)

        // Call service to update user status
        UserProfileDTO updatedUser = userManagementService.updateUserStatus(username, newStatus);

        // Return updated profile with new status applied
        return ResponseEntity.ok(updatedUser);
    }
}
