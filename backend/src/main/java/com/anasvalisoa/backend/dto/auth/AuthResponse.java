package com.anasvalisoa.backend.dto.auth;

import com.anasvalisoa.backend.entity.Role;

import java.time.Instant;
import java.util.UUID;

public class AuthResponse {

    private boolean success;
    private String message;
    private UserData user;

    // Constructeurs
    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String message, UserData user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    // Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserData getUser() { return user; }
    public void setUser(UserData user) { this.user = user; }

    // Classe interne pour les données utilisateur
    public static class UserData {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private UUID schoolId;
        private Role role;
        private Instant createdAt;

        // Constructeurs
        public UserData() {}

        public UserData(UUID id, String firstName, String lastName, String email, 
                        String phone, UUID schoolId, Role role, Instant createdAt) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = phone;
            this.schoolId = schoolId;
            this.role = role;
            this.createdAt = createdAt;
        }

        // Getters et Setters
        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public UUID getSchoolId() { return schoolId; }
        public void setSchoolId(UUID schoolId) { this.schoolId = schoolId; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }
}
