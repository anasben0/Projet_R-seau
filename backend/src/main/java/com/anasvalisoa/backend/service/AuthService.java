package com.anasvalisoa.backend.service;

import com.anasvalisoa.backend.dto.auth.AuthResponse;
import com.anasvalisoa.backend.dto.auth.LoginRequest;
import com.anasvalisoa.backend.dto.auth.RegisterRequest;
import com.anasvalisoa.backend.entity.Role;
import com.anasvalisoa.backend.entity.User;
import com.anasvalisoa.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Cet email est déjà utilisé");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setSchoolId(request.getSchoolId());
        user.setRole(Role.member); // Par défaut, tous les nouveaux utilisateurs sont "member"
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);

        // Créer les données utilisateur pour la réponse (sans le mot de passe)
        AuthResponse.UserData userData = new AuthResponse.UserData(
            savedUser.getId(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getEmail(),
            savedUser.getPhone(),
            savedUser.getSchoolId(),
            savedUser.getRole(),
            savedUser.getCreatedAt()
        );

        return new AuthResponse(true, "Inscription réussie", userData);
    }

    public AuthResponse login(LoginRequest request) {
        // Rechercher l'utilisateur par email
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        
        if (optionalUser.isEmpty()) {
            return new AuthResponse(false, "Email ou mot de passe incorrect");
        }

        User user = optionalUser.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return new AuthResponse(false, "Email ou mot de passe incorrect");
        }

        // Créer les données utilisateur pour la réponse (sans le mot de passe)
        AuthResponse.UserData userData = new AuthResponse.UserData(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPhone(),
            user.getSchoolId(),
            user.getRole(),
            user.getCreatedAt()
        );

        return new AuthResponse(true, "Connexion réussie", userData);
    }
}
