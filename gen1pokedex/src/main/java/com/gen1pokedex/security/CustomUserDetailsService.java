package com.gen1pokedex.security;

import com.gen1pokedex.entity.User; // entity model used for authentication
import com.gen1pokedex.entity.UserStatus; // enum for user account status
import com.gen1pokedex.exception.UserBannedException; // thrown when user account is banned
import com.gen1pokedex.exception.UserSuspendedException; // thrown when user account is suspended
import com.gen1pokedex.repository.UserRepo; // repository to load user credentials and roles
import org.springframework.beans.factory.annotation.Autowired; // dependency injection helper
import org.springframework.security.core.authority.SimpleGrantedAuthority; // wrap roles for security context
import org.springframework.security.core.userdetails.UserDetails; // Spring Security user contract
import org.springframework.security.core.userdetails.UserDetailsService; // service interface for loading users
import org.springframework.security.core.userdetails.UsernameNotFoundException; // exception when user is missing
import org.springframework.stereotype.Service; // service component annotation
import java.time.LocalDateTime; // timestamp for login tracking

import java.util.Collections;

// Service that loads user details for Spring Security authentication
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Repository to load user authentication data
    @Autowired
    private UserRepo userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find user by username in database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Check if user account is banned - prevent login immediately
        if (user.getStatus() == UserStatus.BANNED) {
            throw new UserBannedException("Your account has been permanently banned");
        }

        // Check if user account is suspended - prevent login temporarily
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UserSuspendedException("Your account has been temporarily suspended");
        }

        // Update last login timestamp on successful authentication
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user); // persist login time

        // Create granted authority based on the user's role
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());

        // Return Spring Security UserDetails with username, password, and role
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority));
    }
}