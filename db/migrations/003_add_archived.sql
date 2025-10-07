-- Migration 003: Ajout de la colonne archived pour soft delete
-- Version: 3

-- Ajout de la colonne archived avec valeur par défaut à 0 (false)
ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;

-- Index sur archived pour filtrer facilement les robots actifs/archivés
CREATE INDEX IF NOT EXISTS idx_robots_archived ON robots(archived);

