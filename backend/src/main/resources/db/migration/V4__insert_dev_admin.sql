-- Insertion d'un utilisateur développeur avec rôle admin
-- Email: dev@polyrezo.com
-- Password: dev123 (hashé avec BCrypt)

-- Le hash BCrypt pour "dev123" avec salt 10
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO users (school_id, role, first_name, last_name, phone, email, password_hash)
SELECT 
    (SELECT id FROM schools WHERE name = 'Lyon' LIMIT 1),  -- École par défaut: Lyon
    'admin',                                                 -- Rôle admin
    'Dev',                                                   -- Prénom
    'Admin',                                                 -- Nom
    '0600000000',                                           -- Téléphone
    'dev@polyrezo.com',                                     -- Email
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'  -- Password hash
ON CONFLICT (email) DO NOTHING;  -- Évite les doublons si déjà existant
