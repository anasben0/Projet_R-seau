-- Migration pour insérer les événements du réseau Polytech
-- Utilise l'admin dev@polyrezo.com comme créateur

-- Variable pour l'admin
-- ID admin: 316bc118-c82e-49db-ae30-d29b04040b50

-- Septembre 2024
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'WEC SAVOIE',
    'Week-End de Cohésion - Activités, soirées et découverte de la région',
    '2024-09-12 00:00:00+00',
    '2024-09-14 23:59:59+00',
    'Savoie, France',
    'Campus et alentours',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Savoie';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'WEC SACLAY',
    'Week-End de Cohésion - Activités, soirées et rencontres réseau',
    '2024-09-19 00:00:00+00',
    '2024-09-21 23:59:59+00',
    'Saclay, France',
    'Campus Polytech Paris-Saclay',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Paris-Saclay';

-- Octobre 2024
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'SALMON',
    'Soirée Salmon - Ambiance festive et conviviale',
    '2024-10-04 00:00:00+00',
    '2024-10-05 23:59:59+00',
    'Angers, France',
    'Lieu de soirée Angers',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Angers';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'MNMS',
    'MNMS Event - Soirée à thème',
    '2024-10-18 00:00:00+00',
    '2024-10-19 23:59:59+00',
    'Marseille, France',
    'Lieu de soirée Marseille',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Marseille';

-- Novembre 2024
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'DISCOUNT',
    'Soirée Discount - Ambiance économique et festive',
    '2024-11-08 00:00:00+00',
    '2024-11-09 23:59:59+00',
    'Clermont-Ferrand, France',
    'Lieu de soirée Clermont',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Clermont';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'DERRBY',
    'Derrby Racing Event - Course de tacots et soirée',
    '2024-11-15 00:00:00+00',
    '2024-11-16 23:59:59+00',
    'Saclay, France',
    'Campus Polytech Paris-Saclay',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Paris-Saclay';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'PURRPLE',
    'Soirée Purrple - Ambiance féline et festive',
    '2024-11-22 00:00:00+00',
    '2024-11-23 23:59:59+00',
    'Tours, France',
    'Lieu de soirée Tours',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Tours';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'RRED',
    'RRED Party - Soirée rouge ardente',
    '2024-11-29 00:00:00+00',
    '2024-11-30 23:59:59+00',
    'Lille, France',
    'Lieu de soirée Lille',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Lille';

-- Décembre 2024
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'CONGRES',
    'Congrès National Polytech - Assemblée générale, conférences et soirées',
    '2024-12-05 00:00:00+00',
    '2024-12-07 23:59:59+00',
    'Orléans, France',
    'Campus Polytech Orléans',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Orleans';

-- Janvier 2025
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'TPW',
    'The Polytech Week - Une semaine d''événements réseau',
    '2025-01-17 00:00:00+00',
    '2025-01-18 23:59:59+00',
    'Nantes, France',
    'Campus Polytech Nantes',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Nantes';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'PINK',
    'Pink Party - Soirée rose et glamour',
    '2025-01-24 00:00:00+00',
    '2025-01-25 23:59:59+00',
    'Annecy, France',
    'Lieu de soirée Annecy',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Annecy-Chambery';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'INTERRLISTE',
    'Soirée Interrliste - Rencontre entre listes',
    '2025-01-15 00:00:00+00',
    '2025-01-15 23:59:59+00',
    'Orléans, France',
    'Campus Polytech Orléans',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Orleans';

-- Février 2025
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'WHITE',
    'White Party - Soirée blanche immaculée',
    '2025-02-07 00:00:00+00',
    '2025-02-08 23:59:59+00',
    'Grenoble, France',
    'Lieu de soirée Grenoble',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Grenoble';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'BLUE',
    'Blue Night - Soirée bleue océanique',
    '2025-02-21 00:00:00+00',
    '2025-02-22 23:59:59+00',
    'Montpellier, France',
    'Lieu de soirée Montpellier',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Montpellier';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'GONE',
    'Gone Party - Soirée lyonnaise',
    '2025-02-28 00:00:00+00',
    '2025-03-01 23:59:59+00',
    'Lyon, France',
    'Lieu de soirée Lyon',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Lyon';

-- Mars 2025
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'CAMPAGNES SACLAY',
    'Campagnes électorales - Présentation des listes',
    '2025-03-10 00:00:00+00',
    '2025-03-10 23:59:59+00',
    'Saclay, France',
    'Campus Polytech Paris-Saclay',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Paris-Saclay';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'TIGRRESSES',
    'Soirée Tigrresses - Ambiance féline et sauvage',
    '2025-03-14 00:00:00+00',
    '2025-03-15 23:59:59+00',
    'Orléans, France',
    'Lieu de soirée Orléans',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Orleans';

INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'GS',
    'Grande Soirée - Événement majeur du réseau',
    '2025-03-28 00:00:00+00',
    '2025-03-29 23:59:59+00',
    'Paris, France',
    'Lieu de soirée Paris',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Paris-Saclay';

-- Avril 2025
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'POLYSOUND',
    'Festival PolySound - Festival de musique',
    '2025-04-04 00:00:00+00',
    '2025-04-05 23:59:59+00',
    'Nancy, France',
    'Campus Polytech Nancy',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Nancy';

-- Mai 2025
INSERT INTO events (school_id, name, activities, starts_at, ends_at, address, room, created_by)
SELECT 
    id,
    'AG',
    'Assemblée Générale - Bilan annuel et perspectives',
    '2025-05-08 00:00:00+00',
    '2025-05-10 23:59:59+00',
    'Tours, France',
    'Campus Polytech Tours',
    '316bc118-c82e-49db-ae30-d29b04040b50'
FROM schools WHERE name = 'Tours';
