-- Migration 001: Création de la table robots
-- Version: 1

CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('industrial', 'service', 'medical', 'educational', 'other')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

