import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'robots.db';

// Migrations SQL
const migrations = [
  {
    version: 1,
    name: '001_init',
    sql: `
      CREATE TABLE IF NOT EXISTS robots (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL,
        year INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('industrial', 'service', 'medical', 'educational', 'other')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `,
  },
  {
    version: 2,
    name: '002_add_indexes',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);
      CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);
      CREATE INDEX IF NOT EXISTS idx_robots_type ON robots(type);
    `,
  },
  {
    version: 3,
    name: '003_add_archived',
    sql: `
      ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
      CREATE INDEX IF NOT EXISTS idx_robots_archived ON robots(archived);
    `,
  },
];

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Obtient la version actuelle de la base de données
 */
async function getDatabaseVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  try {
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    return result?.user_version || 0;
  } catch (error) {
    console.error('[ERREUR] Récupération de la version:', error);
    return 0;
  }
}

/**
 * Définit la version de la base de données
 */
async function setDatabaseVersion(db: SQLite.SQLiteDatabase, version: number): Promise<void> {
  try {
    await db.execAsync(`PRAGMA user_version = ${version}`);
    console.log(`[OK] Version de la base mise à jour: ${version}`);
  } catch (error) {
    console.error('[ERREUR] Mise à jour de la version:', error);
    throw error;
  }
}

/**
 * Exécute les migrations nécessaires
 */
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    const currentVersion = await getDatabaseVersion(db);
    console.log(`[DB] Version actuelle: ${currentVersion}`);

    const pendingMigrations = migrations.filter(m => m.version > currentVersion);

    if (pendingMigrations.length === 0) {
      console.log('[OK] Base de données à jour');
      return;
    }

    console.log(`[MIGRATION] ${pendingMigrations.length} migration(s) à exécuter`);

    for (const migration of pendingMigrations) {
      console.log(`[MIGRATION] Exécution: ${migration.name} (v${migration.version})...`);
      
      try {
        await db.execAsync(migration.sql);
        await setDatabaseVersion(db, migration.version);
        console.log(`[OK] Migration ${migration.name} terminée`);
      } catch (error) {
        // Pour la migration 003, ignorer l'erreur si la colonne existe déjà
        if (migration.version === 3 && error instanceof Error && error.message.includes('duplicate column')) {
          console.log(`[WARN] Colonne 'archived' existe déjà, passage à la version 3`);
          await setDatabaseVersion(db, migration.version);
        } else {
          console.error(`[ERREUR] Migration ${migration.name}:`, error);
          throw error;
        }
      }
    }

    console.log('[OK] Toutes les migrations sont terminées');
  } catch (error) {
    console.error('[ERREUR] Exécution des migrations:', error);
    throw error;
  }
}

/**
 * Ouvre la base de données et exécute les migrations
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    console.log('[DB] Ouverture de la base de données...');
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    
    // Exécuter les migrations
    await runMigrations(db);
    
    dbInstance = db;
    console.log('[OK] Base de données prête');
    
    return db;
  } catch (error) {
    console.error('[ERREUR] Ouverture de la base:', error);
    throw error;
  }
}

/**
 * Obtient l'instance de la base de données (doit être ouverte d'abord)
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('La base de données n\'est pas encore ouverte. Appelez openDatabase() d\'abord.');
  }
  return dbInstance;
}

/**
 * Ferme la base de données
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    console.log('[OK] Base de données fermée');
  }
}

/**
 * Réinitialise complètement la base de données (pour le développement)
 */
export async function resetDatabase(): Promise<void> {
  try {
    await closeDatabase();
    const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath);
      console.log('[DB] Base de données supprimée');
    }
    
    // Réouvrir la base
    await openDatabase();
    console.log('[OK] Base de données réinitialisée');
  } catch (error) {
    console.error('[ERREUR] Réinitialisation:', error);
    throw error;
  }
}

