-- Migration 002: Ajout des index pour optimiser les requêtes
-- Version: 2

-- Index sur le nom pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);

-- Index sur l'année pour le tri et les filtres
CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);

-- Index sur le type pour les filtres par catégorie
CREATE INDEX IF NOT EXISTS idx_robots_type ON robots(type);

