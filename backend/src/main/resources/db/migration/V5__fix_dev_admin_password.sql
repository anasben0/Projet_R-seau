-- Mise à jour du mot de passe pour l'utilisateur dev admin
-- Mot de passe: dev123
UPDATE users 
SET password_hash = '$2a$10$uyQFXLCUtGd6mJ9tyNo5KeA6ymiYxDfIV0Ro8EG/5/GwQ3msGtH2m'
WHERE email = 'dev@polyrezo.com';
