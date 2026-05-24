package com.gen1pokedex.security;

// Import for reading application.properties values
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

// JWT libraries for token creation and validation
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

// Java utilities for key handling, dates, and collections
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utility class for JWT (JSON Web Token) creation, parsing, and validation.
 * Handles generating tokens for authenticated users and validating incoming
 * tokens.
 * The secret key is read from application.properties for consistency across
 * server restarts.
 */
@Component
public class JwtUtil {

    // Secret key read from application.properties - FIXED to use consistent key
    @Value("${jwt.secret:Gen1PokedexDefaultSecretKey2026}")
    private String secret;

    // Token expiration time in milliseconds (24 hours = 24 * 60 * 60 * 1000)
    private final long EXPIRATION_TIME = 86400000;

    /**
     * Generates the signing key from the configured secret string.
     * Uses HMAC-SHA256 algorithm for cryptographic signing.
     * 
     * @return Key object used for signing and verifying JWT tokens
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Extracts the username (subject) from the JWT token.
     * 
     * @param token JWT token string from Authorization header
     * @return username stored in the token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from the JWT token.
     * 
     * @param token JWT token string
     * @return Date when the token expires
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic method to extract any claim from the token.
     * Uses a function resolver to get specific claim types.
     * 
     * @param token          JWT token string
     * @param claimsResolver function that extracts a claim from Claims object
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parses the JWT token and returns all claims (payload data).
     * 
     * @param token JWT token string
     * @return Claims object containing all token data
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // FIXED: Uses consistent secret from properties
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if the token has already expired.
     * 
     * @param token JWT token string
     * @return true if expired, false if still valid
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates a new JWT token for an authenticated user.
     * Includes the user's role in the token claims.
     * 
     * @param userDetails Spring Security UserDetails object containing user info
     * @return signed JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Add user role to token claims for authorization
        claims.put("role", userDetails.getAuthorities());
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Builds the actual JWT token with claims, subject, issued date, and
     * expiration.
     * 
     * @param claims  map of custom claims to include in token
     * @param subject username of the authenticated user
     * @return compact JWT string ready to send to client
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey()) // FIXED: Uses consistent secret from properties
                .compact();
    }

    /**
     * Validates the JWT token against the user details.
     * Checks that the username matches and the token hasn't expired.
     * 
     * @param token       JWT token string from request
     * @param userDetails UserDetails of the authenticated user
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}