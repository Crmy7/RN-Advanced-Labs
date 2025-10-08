# Design TP5 - SQLite & TanStack Query

**Généré avec IA** : Migrations, méthodes CRUD, hooks TanStack, debug utils  
**Architecture** : Décidée manuellement  

## Architecture en couches (manuel)

```
Présentation (UI) ← Développé manuellement
    ↓
Hooks (TanStack Query) ← Généré (patterns standards)
    ↓
Repository (CRUD) ← Méthodes générées (code répétitif)
    ↓
Database (SQLite) ← Migrations générées (SQL répétitif)
```

## Fichiers générés par IA

### 1. Migrations SQL

```sql
-- db/migrations/001_init.sql - ✅ GÉNÉRÉ
CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(...),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- db/migrations/002_add_indexes.sql - ✅ GÉNÉRÉ
CREATE INDEX idx_robots_name ON robots(name);
CREATE INDEX idx_robots_year ON robots(year);
CREATE INDEX idx_robots_type ON robots(type);

-- db/migrations/003_add_archived.sql - ✅ GÉNÉRÉ
ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
CREATE INDEX idx_robots_archived ON robots(archived);
```

**Justification** : SQL standard, code répétitif.

### 2. Système de migrations

```typescript
// db/index.ts - Logique PRAGMA - ✅ GÉNÉRÉ
async function runMigrations(db) {
  const currentVersion = await getDatabaseVersion(db);
  const pending = migrations.filter(m => m.version > currentVersion);
  
  for (const migration of pending) {
    await db.execAsync(migration.sql);
    await setDatabaseVersion(db, migration.version);
  }
}
```

**Justification** : Pattern standard de migrations.

### 3. Méthodes CRUD Repository

```typescript
// services/robotRepo.ts - Méthodes CRUD - ✅ GÉNÉRÉ
async create(input: RobotInput): Promise<Robot> {
  // Validation unicité
  // INSERT avec prepared statements
  // Gestion timestamps
}

async list(options: ListOptions): Promise<PaginatedRobots> {
  // Construction WHERE dynamique
  // Pagination, tri
  // COUNT pour total
}

// update(), delete(), getById() - ✅ GÉNÉRÉS
```

**Justification** : Patterns SQL standards, code répétitif et chronophage.

### 4. Hooks TanStack Query

```typescript
// hooks/useRobotsQuery.ts - ✅ GÉNÉRÉ
export function useRobotsQuery() {
  return useQuery({
    queryKey: ['robots'],
    queryFn: () => robotRepo.list(),
  });
}

export function useCreateRobotMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => robotRepo.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['robots'] });
    },
  });
}
```

**Justification** : Patterns TanStack Query standards.

### 5. Debug utils

```typescript
// utils/dbDebug.ts - ✅ GÉNÉRÉ
async function getDbDebugInfo() {
  const version = await getDatabaseVersion();
  const columns = await db.getAllAsync('PRAGMA table_info(robots)');
  const indexes = await db.getAllAsync('PRAGMA index_list(robots)');
  const integrity = await db.getAllAsync('PRAGMA integrity_check');
  // ...
}
```

**Justification** : Requêtes PRAGMA standards.

## Développé manuellement

- ✅ **Architecture en couches** (décision)
- ✅ **UI des écrans** (`tp5-robots-db/`)
- ✅ **Composants** (RobotFormDB, RobotListItemDB, TypeSelectorDB)
- ✅ **Export/Import** (logique métier)
- ✅ **DbDebugPanel** (UI du composant)
- ✅ **Navigation** (intégration tabs)
- ✅ **Tests manuels** (26 scénarios)

## Compréhension IA

L'IA a aidé à comprendre :
- TanStack Query (cache, invalidation)
- PRAGMA user_version
- Stratégie de migrations progressives

## Tests

**Guide de tests généré par IA** :
1. Tester v1→v2→v3 progressivement
2. Créer robots à chaque version
3. Vérifier conservation données

**Résultat** : ✅ 0 perte de données sur 7 robots

## Décisions (manuelles)

**Pourquoi Repository Pattern** : Abstraction DB  
**Pourquoi TanStack Query** : Cache automatique  
**Pourquoi 3 migrations** : Évolution progressive du schéma  
**Pourquoi expo-file-system/legacy** : API moderne bugguée (ENOENT)

## Performance

**Mesures (1000 robots)** :

| Opération | Sans index (v1) | Avec index (v2+) |
|-----------|-----------------|------------------|
| SELECT WHERE name | 85ms | 8ms |
| SELECT ORDER BY year | 120ms | 24ms |
| INSERT | 2ms | 7ms |

**Trade-off** : +5ms insert vs -70ms select → ✅ Acceptable
