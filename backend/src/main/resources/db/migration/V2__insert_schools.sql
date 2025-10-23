-- Insertion des écoles Polytech
INSERT INTO schools (name) VALUES 
  ('Polytech Annecy-Chambéry'),
  ('Polytech Clermont-Ferrand'),
  ('Polytech Dijon'),
  ('Polytech Grenoble'),
  ('Polytech Lille'),
  ('Polytech Lyon'),
  ('Polytech Marseille'),
  ('Polytech Montpellier'),
  ('Polytech Nancy'),
  ('Polytech Nantes'),
  ('Polytech Nice Sophia'),
  ('Polytech Orléans'),
  ('Polytech Paris-Saclay'),
  ('Polytech Paris-UPMC'),
  ('Polytech Sorbonne'),
  ('Polytech Tours')
ON CONFLICT (name) DO NOTHING;
