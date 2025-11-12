-- Migration pour changer le type de la colonne status de request_status (ENUM) vers VARCHAR
-- Cela permet à Hibernate de gérer le mapping sans problème

-- Modifier la table accommodation_guests
ALTER TABLE accommodation_guests 
ALTER COLUMN status TYPE VARCHAR(20) USING status::text;

-- Modifier la table event_participants (seulement si la colonne existe)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_participants' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE event_participants 
        ALTER COLUMN status TYPE VARCHAR(20) USING status::text;
    END IF;
END $$;

-- Supprimer le type ENUM (optionnel, on peut le garder pour compatibilité future)
-- DROP TYPE IF EXISTS request_status CASCADE;
