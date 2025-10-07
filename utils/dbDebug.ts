import { getDatabase } from '../db';

/**
 * Informations de debug sur la base de données
 */
export interface DbDebugInfo {
  version: number;
  robotCount: number;
  hasArchivedColumn: boolean;
  indexes: string[];
  tableInfo: Array<{ name: string; type: string }>;
}

/**
 * Récupère les informations de debug de la base de données
 */
export async function getDbDebugInfo(): Promise<DbDebugInfo> {
  const db = getDatabase();

  // Version
  const versionResult = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = versionResult?.user_version || 0;

  // Nombre de robots
  const countResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM robots');
  const robotCount = countResult?.count || 0;

  // Structure de la table
  const tableInfo = await db.getAllAsync<{ name: string; type: string }>(
    'PRAGMA table_info(robots)'
  );

  // Vérifier si la colonne archived existe
  const hasArchivedColumn = tableInfo.some((col) => col.name === 'archived');

  // Liste des index
  const indexList = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='robots'"
  );
  const indexes = indexList.map((idx) => idx.name);

  return {
    version,
    robotCount,
    hasArchivedColumn,
    indexes,
    tableInfo,
  };
}

/**
 * Vérifie la cohérence de la base de données
 */
export async function checkDbIntegrity(): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info = await getDbDebugInfo();

  // Vérifications selon la version
  if (info.version >= 1) {
    // V1 : table robots doit exister avec les colonnes de base
    const requiredColumns = ['id', 'name', 'label', 'year', 'type', 'created_at', 'updated_at'];
    const columnNames = info.tableInfo.map((col) => col.name);

    requiredColumns.forEach((col) => {
      if (!columnNames.includes(col)) {
        errors.push(`Colonne manquante: ${col}`);
      }
    });
  }

  if (info.version >= 2) {
    // V2 : index doivent exister
    const requiredIndexes = ['idx_robots_name', 'idx_robots_year', 'idx_robots_type'];
    requiredIndexes.forEach((idx) => {
      if (!info.indexes.includes(idx)) {
        warnings.push(`Index manquant: ${idx}`);
      }
    });
  }

  if (info.version >= 3) {
    // V3 : colonne archived doit exister
    if (!info.hasArchivedColumn) {
      errors.push('Colonne "archived" manquante');
    }
    if (!info.indexes.includes('idx_robots_archived')) {
      warnings.push('Index manquant: idx_robots_archived');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Affiche un rapport de debug dans la console
 */
export async function printDbDebugReport(): Promise<void> {
  console.log('\n========== DEBUG DB ==========');
  
  const info = await getDbDebugInfo();
  console.log(`Version: ${info.version}`);
  console.log(`Nombre de robots: ${info.robotCount}`);
  console.log(`Colonne archived: ${info.hasArchivedColumn ? 'OUI' : 'NON'}`);
  console.log(`Indexes (${info.indexes.length}):`);
  info.indexes.forEach((idx) => console.log(`  - ${idx}`));
  
  console.log(`\nStructure de la table (${info.tableInfo.length} colonnes):`);
  info.tableInfo.forEach((col) => console.log(`  - ${col.name}: ${col.type}`));
  
  const integrity = await checkDbIntegrity();
  console.log(`\nIntégrité: ${integrity.isValid ? 'OK' : 'ERREURS'}`);
  
  if (integrity.errors.length > 0) {
    console.log('Erreurs:');
    integrity.errors.forEach((err) => console.log(`  [ERREUR] ${err}`));
  }
  
  if (integrity.warnings.length > 0) {
    console.log('Avertissements:');
    integrity.warnings.forEach((warn) => console.log(`  [WARN] ${warn}`));
  }
  
  console.log('==============================\n');
}

