package com.anasvalisoa.backend.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anasvalisoa.backend.dto.auth.AuthResponse;
import com.anasvalisoa.backend.dto.auth.LoginRequest;
import com.anasvalisoa.backend.dto.auth.RegisterRequest;
import com.anasvalisoa.backend.entity.User;
import com.anasvalisoa.backend.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PersistenceContext
    private EntityManager entityManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Cet email est déjà utilisé");
        }

        // Générer un UUID pour le nouvel utilisateur
        UUID userId = UUID.randomUUID();
        Instant now = Instant.now();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        // Déterminer le rôle (par défaut "member" si non spécifié)
        String role = (request.getRole() != null && request.getRole().equalsIgnoreCase("admin")) 
                      ? "admin" 
                      : "member";
        
        // Insérer directement avec SQL natif pour éviter les problèmes d'enum
        String sql = "INSERT INTO users (id, school_id, role, first_name, last_name, phone, email, password_hash, created_at) " +
                     "VALUES (:id, :schoolId, CAST(:role AS user_role), :firstName, :lastName, :phone, :email, :passwordHash, :createdAt)";
        
        entityManager.createNativeQuery(sql)
            .setParameter("id", userId)
            .setParameter("schoolId", request.getSchoolId())
            .setParameter("role", role)
            .setParameter("firstName", request.getFirstName())
            .setParameter("lastName", request.getLastName())
            .setParameter("phone", request.getPhone())
            .setParameter("email", request.getEmail())
            .setParameter("passwordHash", hashedPassword)
            .setParameter("createdAt", now)
            .executeUpdate();
        
        // Récupérer l'utilisateur créé
        User savedUser = userRepository.findById(userId).orElseThrow();

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
