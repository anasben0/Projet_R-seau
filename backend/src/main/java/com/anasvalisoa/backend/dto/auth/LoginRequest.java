package com.anasvalisoa.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;

    // Constructeurs
    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters et Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
