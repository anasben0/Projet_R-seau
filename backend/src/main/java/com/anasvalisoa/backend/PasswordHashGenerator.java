package com.anasvalisoa.backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "dev123";
        String hash = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("Hash: " + hash);
        System.out.println("\nTest match: " + encoder.matches(password, hash));
        
        // Test avec le hash de la migration
        String oldHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
        System.out.println("\nTest avec l'ancien hash:");
        System.out.println("Matches: " + encoder.matches(password, oldHash));
    }
}
