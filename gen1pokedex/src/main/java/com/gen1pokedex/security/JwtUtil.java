package com.gen1pokedex.security;

import io.jsonwebtoken.Claims; // JWT claims abstraction
import io.jsonwebtoken.Jwts; // JWT builder and parser
import io.jsonwebtoken.SignatureAlgorithm; // algorithm used to sign JWTs
import io.jsonwebtoken.security.Keys; // key generator for JWT signing
import org.springframework.security.core.userdetails.UserDetails; // user details contract used for token creation
import org.springframework.stereotype.Component; // Spring component annotation

import java.security.Key; // cryptographic key for signing tokens
import java.util.Date; // token timestamp handling
import java.util.HashMap; // mutable map for JWT claims
import java.util.Map; // generic map type for claims
import java.util.function.Function; // function extractor for claim retrieval

// Utility class for JWT creation, parsing, and validation
@Component
public class JwtUtil {

    // Secret key used for signing JWTs. In production, move this to secure storage.
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token expiration time in milliseconds (24 hours)
    private final long EXPIRATION_TIME = 86400000;

    // Extract the username contained in the token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract the token expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract a specific claim from the token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parse the token and return all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Check whether the token has already expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Generate a new JWT token for a user
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDetails.getAuthorities());
        return createToken(claims, userDetails.getUsername());
    }

    // Build the signed JWT token with claims and expiration
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    // Validate that the token belongs to the user and is not expired
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}