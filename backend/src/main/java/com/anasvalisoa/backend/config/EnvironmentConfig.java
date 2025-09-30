package com.anasvalisoa.backend.config;

import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

@Configuration
public class EnvironmentConfig {

    @PostConstruct
    public void loadEnvironmentVariables() {
        try {
            Path envFile = Paths.get(".env");
            if (Files.exists(envFile)) {
                try (Stream<String> lines = Files.lines(envFile)) {
                    lines.filter(line -> line.contains("=") && !line.startsWith("#"))
                         .forEach(line -> {
                             String[] parts = line.split("=", 2);
                             if (parts.length == 2) {
                                 System.setProperty(parts[0].trim(), parts[1].trim());
                             }
                         });
                }
                System.out.println("✅ Variables d'environnement chargées depuis .env");
            }
        } catch (IOException e) {
            System.err.println("⚠️ Erreur lors du chargement du fichier .env: " + e.getMessage());
        }
    }
}