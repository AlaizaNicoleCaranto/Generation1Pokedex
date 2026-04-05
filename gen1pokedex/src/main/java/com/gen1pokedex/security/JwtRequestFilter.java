package com.gen1pokedex.security;

import jakarta.servlet.FilterChain; // chain of servlet filters for request processing
import jakarta.servlet.ServletException; // exception thrown by servlet filters
import jakarta.servlet.http.HttpServletRequest; // incoming HTTP request representation
import jakarta.servlet.http.HttpServletResponse; // outgoing HTTP response representation
import org.springframework.beans.factory.annotation.Autowired; // injection of Spring beans
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // security token for authenticated users
import org.springframework.security.core.context.SecurityContextHolder; // holds security context for current thread
import org.springframework.security.core.userdetails.UserDetails; // details about authenticated user
import org.springframework.security.core.userdetails.UserDetailsService; // loads user details by username
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; // builds web authentication details
import org.springframework.stereotype.Component; // Spring component marker
import org.springframework.web.filter.OncePerRequestFilter; // filter executed once per request

import java.io.IOException; // exception thrown during IO operations

// Filter that extracts and validates JWT tokens from incoming HTTP requests
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    // Service to load user details for authentication
    @Autowired
    private UserDetailsService userDetailsService;

    // JWT utility for extracting and validating tokens
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        // Extract JWT token from the Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            username = jwtUtil.extractUsername(jwt);
        }

        // Validate JWT and set the security context for authenticated requests
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}