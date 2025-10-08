# Prompts TP5 - SQLite & TanStack Query

**Date** : Janvier 2025  
**Modèle** : Claude Sonnet 4.5 (Cursor IDE)  

## Prompts principaux

### 1. Système de migrations

**Prompt** : "Créer un système de migrations SQL versionnées avec PRAGMA user_version"

**Sortie générée** :
```typescript
// Système complet généré
const migrations = [
  { version: 1, name: '001_init', sql: '...' },
  { version: 2, name: '002_add_indexes', sql: '...' },
  { version: 3, name: '003_add_archived', sql: '...' },
];

async function runMigrations(db) {
  const currentVersion = await getDatabaseVersion(db);
  const pending = migrations.filter(m => m.version > currentVersion);
  
  for (const migration of pending) {
    await db.execAsync(migration.sql);
    await setDatabaseVersion(db, migration.version);
  }
}
```

**Fichiers générés** :
- `db/index.ts` (logique migrations)
- `db/migrations/001_init.sql`
- `db/migrations/002_add_indexes.sql`
- `db/migrations/003_add_archived.sql`

---

### 2. Méthodes CRUD répétitives

**Prompt** : "Générer les méthodes CRUD pour la table robots (create, list, update, delete)"

**Sortie générée** : Méthodes complètes avec:
- Prepared statements
- Gestion erreurs
- Timestamps automatiques
- Pagination

**Fichier** : `services/robotRepo.ts` (méthodes CRUD)

**Justification** : Code répétitif suivant patterns SQL standards.

---

### 3. TanStack Query

**Prompt** : "Comment utiliser TanStack Query pour cacher les requêtes SQL ?"

**Sortie générée** :
```typescript
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

**Fichier** : `hooks/useRobotsQuery.ts` ✅ Généré (patterns standards)

**Réponse IA** : Explication du cache, invalidation, optimistic updates.

---

### 4. Tests migrations

**Prompt** : "Comment tester les migrations progressives v1→v2→v3 sans perte de données ?"

**Sortie générée** : Guide étape par étape
1. Commenter migrations v2 et v3
2. Lancer app, créer 5 robots (DB en v1)
3. Décommenter v2, relancer, ajouter 2 robots
4. Décommenter v3, vérifier les 7 robots présents

**Impact** : ✅ Migrations testées avec succès (0 perte de données)

---

### 5. Debug utils

**Prompt** : "Créer des fonctions pour debugger la DB (PRAGMA table_info, index_list, etc.)"

**Sortie générée** : Fonctions PRAGMA complètes

**Fichier** : `utils/dbDebug.ts` ✅ Généré

## Résultats

✅ Système migrations fonctionnel  
✅ CRUD complet testé  
✅ TanStack Query maîtrisé  
✅ 26 tests manuels validés  
✅ 0 perte de données lors migrations
