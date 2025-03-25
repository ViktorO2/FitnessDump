package com.fitnessdump.FitnessDump.Util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    // Use a securely generated key for HS256
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private long expirationTime = 86400000; // 24 hours in milliseconds

    // Generate JWT token
    public String generateToken(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // Set the username as the subject
                .setIssuedAt(new Date()) // Set the issue time as the current time
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Set the expiration time
                .signWith(secretKey) // Sign the token with the generated SecretKey
                .compact();
    }

    // Validate the JWT token
    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        try {
            // Parse and validate the token
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    // Get the username from the JWT token
    public Long getUserIdFromToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }

        try {
            return Long.parseLong(Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject());
        } catch (JwtException | NumberFormatException e) {
            logger.error("Could not extract user ID from token: {}", e.getMessage());
            throw new JwtException("Invalid token", e);
        }
    }
}
