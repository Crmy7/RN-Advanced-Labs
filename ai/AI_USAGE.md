# Documentation de l'utilisation de l'IA - Projet RN Advanced Labs

## Vue d'ensemble

**Modèle utilisé** : Claude Sonnet 4.5 et Claude Sonnet 4 et GPT-4 via Cursor IDE ou VSCode
**Période** : Septembre 2025 - Janvier 2026  
**Développeur** : Charles Remy  

### Objectifs

L'IA a été utilisée principalement comme **assistant pédagogique** et **générateur de code répétitif** pour :
1. **Vulgariser** les concepts React Native complexes
2. **Générer** les schémas de validation et code répétitif
3. **Expliquer** les architectures (navigation, state management)
4. **Comprendre** les nouvelles bibliothèques (TanStack Query)

### Modules concernés et niveau d'assistance

| TP | Ce qui a été généré par IA | Assistance | Type |
|----|---------------------------|------------|------|
| **TP1** | Explications StyleSheet, quelques styles de base | ~10% | Pédagogique |
| **TP2** | Explications navigation (tabs/stack, niveaux, bouton retour) | ~15% | Pédagogique |
| **TP3** | **Schémas validation Yup/Zod** + aide champs formulaires + doc | ~40% | Génération + Doc |
| **TP4a/b** | Validations + **vulgarisation concepts Redux** (State/Slice/Reducer vs Vue) | ~25% | Validation + Pédagogique |
| **TP5** | **Migrations SQL**, **tests**, méthodes répétitives + **compréhension TanStack Query** | ~60% | Génération + Pédagogique |
| **TP6** | Bugfix caméra (isCameraReady/isCapturing), aperçu dernière photo | ~15% | Bugfix + Doc |

### Vulgarisation clé (TP4)

L'IA m'a aidé à comprendre Redux en comparant avec Vue :

```
State ? Slice ? Reducer ?

- State = Objet de données
- Slice = Groupe de méthodes 
- Reducer = Une méthode spécifique
```

Cette analogie a été **cruciale** pour comprendre l'architecture Redux.

## Détails par TP

### TP1 - Profile Card & Timer (~10% IA)

**Généré par IA :**
- Explications sur `StyleSheet.create()`
- Quelques styles de base (shadows, borders)

**Développé manuellement :**
- Logique du profil (useState)
- Timer avec setInterval
- Toute la structure des composants

---

### TP2 - Navigation & Deep Linking (~15% IA)

**Généré par IA :**
- Explications architecture Expo Router (file-based)
- Différences tabs/stack
- Compréhension des niveaux de navigation
- Pourquoi le bouton retour apparaît/disparaît

**Développé manuellement :**
- Structure de dossiers `(main)/(tabs)/`
- Écrans About/Contact
- Configuration deep linking
- AsyncStorage

---

### TP3 - Formulaires (~40% IA)

**Généré par IA :**
- ✅ **Schémas de validation Yup** (complets)
- ✅ **Schémas de validation Zod** (complets)
- Aide sur les champs de formulaires Formik
- Documentation comparative Formik vs RHF

**Fichiers concernés :**
- `validation/contactSchema.ts` (Yup) - **généré**
- `validation/contactSchemaZod.ts` (Zod) - **généré**
- Parties de `app/(main)/(tabs)/tp3-forms/formik/index.tsx` - **assisté**
- Parties de `app/(main)/(tabs)/tp3-forms/rhf/index.tsx` - **assisté**

**Développé manuellement :**
- Structure de navigation
- UI des formulaires
- Gestion des erreurs
- KeyboardAvoidingView

---

### TP4a/b - State Management (~25% IA)

**Généré par IA :**
- Validations (unicité nom, etc.)
- **Vulgarisation Redux** (comparaison avec Vue)
- Explications Zustand vs Redux

**Vulgarisation clé :**
```
Redux expliqué avec Vue.js comme référence :
- State = data() en Vue
- Slice = module Vuex
- Reducer = mutation Vuex
```

**Développé manuellement :**
- Store Zustand complet
- Slice Redux complet
- Selectors memoized
- Tous les écrans CRUD
- Tous les composants (RobotForm, RobotListItem, etc.)
- Configuration persist

---

### TP5 - SQLite & TanStack Query (~60% IA)

**Généré par IA :**
- **Migrations SQL** (v1, v2, v3) - **générées** (code répétitif)
- **Système de migrations** (`db/index.ts` - logique PRAGMA) - **généré**
- **Tests de migrations** (guide étape par étape) - **généré**
- **Méthodes CRUD répétitives** dans Repository - **générées**
- **Hooks TanStack Query** (patterns standards) - **générés**
- Explications TanStack Query (cache, invalidation)
- Aide debug migrations progressives

**Fichiers générés/assistés :**
- `db/index.ts` - **système migrations généré (PRAGMA user_version, boucle)**
- `db/migrations/001_init.sql` - **SQL généré**
- `db/migrations/002_add_indexes.sql` - **SQL généré**
- `db/migrations/003_add_archived.sql` - **SQL généré**
- `services/robotRepo.ts` - **méthodes CRUD générées** (create, update, delete, list)
- `hooks/useRobotsQuery.ts` - **hooks TanStack générés** (patterns standards)
- `utils/dbDebug.ts` - **méthodes PRAGMA générées**

**Développé manuellement :**
- Architecture en couches
- UI des écrans
- Composants (RobotFormDB, RobotListItemDB, TypeSelectorDB)
- Export/Import (logique métier)
- DbDebugPanel (UI)
- Intégration navigation

**Justification du 60% :**
Les migrations SQL, le système PRAGMA, et les méthodes CRUD sont du **code répétitif** qui suit des patterns standards. L'IA les a générées pour **gagner du temps** sur des tâches chronophages.

---

### TP6 - Caméra & Galerie (~15% IA)

**Généré par IA :**
- Corrections caméra : `isCameraReady` + désactivation du bouton capture tant que non prêt
- Contrôle `isCapturing` pour l'icône sablier (éviter clignotements au montage)
- Affichage de la dernière photo sur l'écran caméra (au montage et juste après capture)
- Alerte `CameraView` sans enfants → UI superposée hors `CameraView`

**Fichiers concernés :**
- `app/(main)/(tabs)/tp6-camera/camera.tsx` – gestion readiness/capture, aperçu dernière photo
- `app/(main)/(tabs)/tp6-camera/index.tsx` – pas d'accès FS direct (consomme services)
- `lib/hooks/usePhotoStorage.ts` – source des données pour l'aperçu
- `ai/design/tp6-bugfixes-and-last-photo.md` – décisions et pseudo-code
- `ai/prompts/tp6-camera.md` – prompts et extraits

**Développé manuellement :**
- UI/UX (glassmorphisme caméra, overlay détail, navigation)
- Services purs de stockage (`lib/camera/storage.ts`)
- Hook stateful (`lib/hooks/usePhotoStorage.ts`) et intégration écrans

**Vérifications :**
- Build/lint/typage : OK
- Tests manuels : dernière photo visible sur caméra, capture fiable, retour auto galerie


## Propriété du code

**Tout le code compris** : Chaque ligne générée a été relue et comprise  
**Adaptations personnelles** : Code ajusté aux besoins (qualité, UI,emoji → SF Symbols, etc.)  
**Architecture maîtrisée** : Décisions d'architecture prises manuellement  
**Tests manuels** : 26 tests effectués et validés pour TP5  

## Limites et risques

### Limites identifiées

1. **API dépréciées** : L'IA suggère parfois d'anciennes API
   - Exemple : `expo-file-system` → Corrigé en `/legacy`

2. **Sur-génération** : Tendance à générer trop de code
   - Mitigation : Revue critique et simplification
   - Cassage du README.md

3. **Patterns génériques** : Code parfois trop "académique"
   - Mitigation : Adaptation au contexte du projet

### Confidentialité

**0 donnée sensible dans les prompts** :
- Pas de clés API
- Pas de données personnelles
- Exemples fictifs (ASIMO, R2-D2, etc.)

## Tests et validation

### Vérifications techniques

**Build** : `npm run start` → OK  
**Runtime** : Aucune erreur console  
**Navigation** : Tous les écrans accessibles  
**Persistance** : Données conservées au redémarrage  

### Tests manuels TP5

| Test | Résultat | Notes |
|------|----------|-------|
| Migration v0→v3 | ✅ OK | 3 migrations exécutées |
| Migration v1→v2→v3 progressive | ✅ OK | 0 perte données |
| CRUD complet | ✅ OK | Create/Read/Update/Delete |
| Export/Import | ✅ OK | 15 robots testés |
| Debug panel | ✅ OK | Infos correctes |

## Apprentissages clés

### Via vulgarisation IA

1. **Navigation Expo Router** : Compréhension niveaux et bouton retour
2. **Redux** : Analogie avec Vue.js (State/Slice/Reducer)
3. **TanStack Query** : Cache automatique et invalidation
4. **Migrations SQL** : PRAGMA user_version et versioning

### Autonomie

- **TP1-TP2** : Découverte (IA = prof)
- **TP3-TP4** : Consolidation (IA = assistant)
- **TP5** : Efficacité (IA = générateur de code répétitif)

## Conclusion

L'IA a été utilisée de manière **responsable et pédagogique** :
- **Pédagogie** : Vulgarisation concepts complexes
- **Efficacité** : Génération code répétitif (migrations, validations)
- **Compréhension** : Tout le code maîtrisé
- **Qualité** : Tests manuels exhaustifs

**Propriété du code** : 100% maîtrisé  
**Traçabilité** : Documentation complète  
**Sécurité** : 0 donnée sensible  

---
 
**Projet** : RN Advanced Labs - MBA2 Dev Mobile
