-- Suppression des anciennes écoles
DELETE FROM schools;

-- Insertion des écoles Polytech (noms sans préfixe)
INSERT INTO schools (name) VALUES 
  ('Lille'),
  ('Sorbonne'),
  ('Paris-Saclay'),
  ('Nancy'),
  ('Orléans'),
  ('Tours'),
  ('Angers'),
  ('Nantes'),
  ('Dijon'),
  ('Annecy-Chambery'),
  ('Lyon'),
  ('Grenoble'),
  ('Clermont'),
  ('Montpellier'),
  ('Marseille'),
  ('Nice Sophia')
ON CONFLICT (name) DO NOTHING;
