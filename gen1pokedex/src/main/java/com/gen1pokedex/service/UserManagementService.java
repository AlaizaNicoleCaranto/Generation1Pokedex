package com.gen1pokedex.service;

import com.gen1pokedex.dto.UserProfileDTO;
import com.gen1pokedex.entity.UserStatus;
import java.util.List;

// Service interface for admin user management operations
public interface UserManagementService {

    // Retrieve all trainers in the system
    List<UserProfileDTO> getAllUsers();

    // Get detailed information about a specific trainer
    UserProfileDTO getUserDetails(String username);

    // Update a user's account status (ACTIVE, BANNED, SUSPENDED)
    UserProfileDTO updateUserStatus(String username, UserStatus newStatus);

    // Ban a user permanently from accessing the app
    UserProfileDTO banUser(String username, String reason);

    // Suspend a user temporarily (can be reactivated later)
    UserProfileDTO suspendUser(String username, String reason);

    // Reactivate a banned or suspended user account
    UserProfileDTO reactivateUser(String username);

    // Clear all caught Pokemon from a user's collection (for rule
    // violations/cheating)
    UserProfileDTO resetUserCollection(String username);

    // Reset user's password to a temporary value (user should change on next login)
    UserProfileDTO resetUserPassword(String username);

    // Check if user account is still active before allowing gameplay
    boolean isUserActive(String username);
}
