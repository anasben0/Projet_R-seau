-- Insérer les écoles (nom = ville)
INSERT INTO schools (name) VALUES
('Annecy-Chambery'),
('Angers'),
('Clermont-Ferrand'),
('Dijon'),
('Grenoble'),
('Lille'),
('Lyon'),
('Marseille'),
('Montpellier'),
('Nancy'),
('Nantes'),
('Nice'),
('Orleans'),
('Paris-Saclay'),
('Sorbonne'),
('Tours');

-- Créer un utilisateur admin "dev" rattaché à l’école "Paris-Saclay"
INSERT INTO users (school_id, role, first_name, last_name, email, password_hash)
VALUES (
  (SELECT id FROM schools WHERE name = 'Paris-Saclay'),
  'admin',
  'Dev',
  'Dev',
  'dev@universite-paris-saclay.fr',
  'changeme'  -- à remplacer par un vrai hash plus tard (bcrypt/argon2)
);

-- Créer un utilisateur membre rattaché à l’école "Paris-Saclay"
INSERT INTO users (school_id, role, first_name, last_name, email, password_hash)
VALUES (
  (SELECT id FROM schools WHERE name = 'Paris-Saclay'),
  'member',
  'Valisoa',
  'Randrianoelina',
  'valisoa.randrianoelina@universite-paris-saclay.fr',
  'changeme'  -- à remplacer par un vrai hash plus tard (bcrypt/argon2)
);