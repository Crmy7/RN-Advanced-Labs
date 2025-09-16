# RN-Advanced-Labs 📱

Laboratoire avancé de développement React Native avec Expo Router.

## 🚀 Démarrage rapide

1. Installation des dépendances

   ```bash
   npm install
   ```

2. Lancement de l'application

   ```bash
   npx expo start
   ```

Vous pouvez ouvrir l'app dans :
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

---

## 📚 Travaux Pratiques

### 🎯 TP1 - Profile Card Screen
**📁 Localisation :** [`app/(main)/tp1-profile-card.tsx`](./app/(main)/tp1-profile-card.tsx)

**📋 Description :** 
Écran de carte de profil interactif comprenant :
- 👤 Affichage d'un profil utilisateur (photo, nom, rôle)
- ❤️ Système de follow/unfollow avec styles dynamiques
- ⏱️ Timer manuel avec contrôles start/reset
- 📈 Compteur de followers qui s'incrémente automatiquement (toutes les 5 secondes)
- 🎨 Design responsive avec effets d'ombre et animations

**✅ Status :** Terminé (Tag: `tp1-done`)

### 🎯 TP2 - Navigation, Persistance & Deep Linking avec Expo Router
**📁 Localisation :** Architecture complète `app/`

**📋 Description :**
- 🧭 Navigation multi-écrans avec **Expo Router** (file-based routing)
- 📱 Architecture **Stack** et **Tabs** avec layouts imbriqués
- 🔗 **Passage de paramètres** dynamiques avec validation
- 💾 **Persistance de l'état de navigation** (retour à la dernière page)
- 🌐 **Deep linking** complet (liens internes/externes)

**✅ Status :** Terminé (Tag: `tp2-done`)

---

## 🏗️ Architecture du Projet

```
app/
  _layout.tsx                 # 🎯 LAYOUT RACINE UNIQUE (Tabs Navigator)
  index.tsx                   # Point d'entrée avec persistance
  (main)/                     # Groupe principal (PAS de _layout.tsx)
    home.tsx                  # Page d'accueil
    tp1-profile-card.tsx      # Écran du TP1 (intégré à la navigation)
    detail/
      [id].tsx                # Écran dynamique avec validation paramètres
  (auth)/                     # Groupe authentification (PAS de _layout.tsx)
    login.tsx                 # Écran de connexion (préparé pour l'avenir)
    register.tsx              # Écran d'inscription (préparé pour l'avenir)
components/                   # Composants partagés
  deep-link-handler.tsx       # Gestionnaire de deep links
  external-link.tsx           # Composants UI réutilisables
  haptic-tab.tsx
  hello-wave.tsx
  parallax-scroll-view.tsx
  themed-text.tsx
  themed-view.tsx
  ui/                         # Composants UI spécialisés
hooks/                        # Hooks personnalisés
  use-route-persistence.ts    # Gestion persistance navigation
  use-color-scheme.ts         # Gestion des thèmes
  use-theme-color.ts
lib/                          # Services et utilitaires
  deep-link-utils.ts          # Utilitaires pour deep linking
constants/                    # Constantes de l'app
  theme.ts                    # Configuration des thèmes
```

## 📋 Table des Routes

| Route | Fichier | Type | Description | Navigation |
|-------|---------|------|-------------|------------|
| `/` | `app/index.tsx` | Redirect | Point d'entrée avec persistance | → `/(main)/home` |
| `/(main)/home` | `app/(main)/home.tsx` | Tab | Page d'accueil principale | Onglet "Accueil" |
| `/(main)/tp1-profile-card` | `app/(main)/tp1-profile-card.tsx` | Tab | Carte de profil interactive (TP1) | Onglet "Profile Card" |
| `/(main)/detail/[id]` | `app/(main)/detail/[id].tsx` | Stack | Page de détail avec paramètre dynamique | Masquée des onglets |
| `/(auth)/login` | `app/(auth)/login.tsx` | Stack | Écran de connexion | Modal d'authentification |
| `/(auth)/register` | `app/(auth)/register.tsx` | Stack | Écran d'inscription | Modal d'authentification |

### Validation des Paramètres

| Paramètre | Validation | Comportement |
|-----------|------------|--------------|
| `[id]` | ✅ Non vide, longueur < 50 caractères | Écran d'erreur 404 si invalide |
| `[id]` | ✅ Nettoyage automatique (trim) | Sécurisation des entrées utilisateur |
| `[id]` | ✅ Gestion des tableaux | Protection contre les paramètres malformés |

## 🎯 Fonctionnalités

### Navigation
- ✅ **UN SEUL LAYOUT** dans `app/_layout.tsx` avec Tabs Navigator
- ✅ **Aucun layout** dans les groupes `(main)` et `(auth)`
- ✅ **Navigation par onglets** gérée directement depuis la racine
- ✅ **Écrans masqués** (détail, auth) via `href: null`
- ✅ **Validation des paramètres** avec écran d'erreur 404

### Passage de paramètres
- ✅ Route dynamique `/detail/[id]` avec validation robuste
- ✅ Récupération sécurisée avec `useLocalSearchParams()`
- ✅ Écran d'erreur 404 pour les paramètres invalides
- ✅ Titre de page dynamique selon l'ID validé
- ✅ Navigation de retour native et programmatique

## 🔄 Persistance de l'état de navigation

### Ce qui est persistant ✅

1. **Route courante** : L'application retourne à la dernière page visitée
2. **Paramètres d'URL** : Les paramètres dynamiques (ex: ID) sont conservés
3. **État des onglets** : L'onglet sélectionné est mémorisé

### Comportement UX

**Scénario de test :**
1. Utilisateur ouvre l'app → va sur l'onglet "Profile Card" → navigue vers "Detail (ID: 42)"
2. **Ferme** complètement l'app
3. **Relance** l'app
4. **Résultat** : L'utilisateur se retrouve sur l'écran "Detail (ID: 42)" avec la pile de navigation intacte

### Implémentation technique

**`lib/navigation-persistence.ts`** :
- Sauvegarde automatique de la route courante dans AsyncStorage
- API simple pour récupérer/sauvegarder/effacer les routes

**`components/navigation-tracker.tsx`** :
- Composant invisible qui track les changements de route
- Sauvegarde automatique à chaque navigation

**`app/index.tsx`** :
- Point d'entrée intelligent qui redirige vers la dernière route
- Fallback vers l'accueil si aucune route sauvegardée

### Choix UX

🎯 **Persistance complète** : L'utilisateur retrouve exactement où il était, même dans un écran de détail profond.

⚠️ **Alternative possible** : Utiliser `unstable_settings.initialRouteName` pour forcer un retour à l'accueil, mais cela casse l'expérience utilisateur.

## 🚀 Utilisation

```bash
# Installation des dépendances
npm install

# Démarrage
npm start
```

## 📦 Dépendances clés

- `expo-router` : Navigation file-based
- `@react-native-async-storage/async-storage` : Persistance locale
- `@expo/vector-icons` : Icônes pour les onglets

## 🧪 Test de la persistance

1. Naviguez vers "Profile Card" puis "Voir Détail (ID: 42)"
2. Fermez complètement l'application
3. Relancez → Vous devriez être sur l'écran de détail
4. Le bouton retour fonctionne pour revenir à l'accueil

## 🔗 Deep Linking

### 📋 Configuration

Dans `app.json` :
```json
{
  "expo": {
    "scheme": "rnadvancedlabs",
    "name": "RN Advanced Labs", 
    "slug": "rn-advanced-labs",
    "ios": { "bundleIdentifier": "com.exemple.rnadvancedlabs" },
    "android": { "package": "com.exemple.rnadvancedlabs" }
  }
}
```

- **Schéma interne** : `rnadvancedlabs://`
- **Liens web** : `https://app.votre-domaine.com/...` (préparé)
- **Bundle identifiers** : iOS et Android configurés

### 🚀 Situation actuelle et solutions

#### 📱 **Expo Go - Limitations**
- ✅ **Fonctionne** : `exp://10.25.128.212:8081` (racine uniquement)
- ❌ **Ne fonctionne pas** : `exp://10.25.128.212:8081/tp1-profile-card`

**Pourquoi ?** Expo Go attend un manifest JSON uniquement à la racine. Impossible de lancer directement une route spécifique.

#### 🔧 **Schéma personnalisé (rnadvancedlabs://)**
- ✅ **Bien déclaré** dans `app.json`
- ❌ **Safari ne peut pas ouvrir** `rnadvancedlabs://tp1-profile-card` dans Expo Go

**Pourquoi ?** Expo Go ne connaît pas votre schéma personnalisé. Safari affiche "adresse invalide".

#### 🏗️ **Dev Build - Solution complète**

Pour tester les deep links avec schéma personnalisé, il faut une **dev build** :

```bash
# Nettoyer et régénérer le projet iOS
cd ios
pod deintegrate
pod clean
cd ..
npx expo prebuild --clean
cd ios
pod install
cd ..

# Recompiler
npx expo run:ios
```

**Résultat** : Safari pourra ouvrir directement `rnadvancedlabs://tp1-profile-card` ! 🎉

### 📋 Tests de Deep Linking

#### 🧊 **Test 1 : App fermée (Cold Start)**
- **Action** : Ouvrir `rnadvancedlabs://detail/42` depuis Safari
- **Résultat attendu** : L'app se lance et affiche directement l'écran de détail avec ID=42
- **Résultat obtenu** : ✅ L'app s'ouvre sur l'écran `[id].tsx` avec `id=42`

#### 🔄 **Test 2 : App en arrière-plan (Warm)**
- **Action** : App minimisée, puis ouvrir `rnadvancedlabs://tp1-profile-card`
- **Résultat attendu** : L'app revient au premier plan sur l'onglet Profile Card
- **Résultat obtenu** : ✅ Navigation directe vers ProfileCard

#### ⚡ **Test 3 : App déjà ouverte (Hot)**
- **Action** : App ouverte sur Accueil, puis ouvrir `rnadvancedlabs://detail/123`
- **Résultat attendu** : Navigation vers l'écran de détail avec ID=123
- **Résultat obtenu** : ✅ Navigation instantanée vers Detail avec le nouvel ID

### 🔗 Liens disponibles

```bash
# Navigation principale
rnadvancedlabs://                    → Page d'accueil
rnadvancedlabs://tp1-profile-card    → Profile Card  

# Navigation avec paramètres
rnadvancedlabs://detail/42           → Écran de détail (ID: 42)
rnadvancedlabs://detail/123          → Écran de détail (ID: 123)
rnadvancedlabs://detail/abc          → Écran de détail (ID: abc)

# Gestion d'erreurs
rnadvancedlabs://detail/             → Écran 404 (ID manquant)
rnadvancedlabs://detail/trop-long-id-invalide → Écran 404 (ID trop long)
```

### 🛠️ Implémentation technique

**Composants clés :**
- `components/deep-link-handler.tsx` : Gestionnaire principal des liens entrants
- `lib/deep-link-utils.ts` : Utilitaires pour générer et tester les liens
- `hooks/use-route-persistence.ts` : Sauvegarde automatique des routes

**Fonctionnalités :**
- ✅ Parsing automatique des URLs (exp://, rnadvancedlabs://, https://)
- ✅ Navigation sécurisée avec gestion d'erreurs
- ✅ Validation des paramètres avant navigation
- ✅ Logs détaillés pour le débogage

---

## 🛠️ Technologies utilisées

### 📦 **Packages principaux**
- **React Native** avec Expo SDK 54
- **TypeScript** pour la sécurité de type
- **Expo Router 6.0.4** pour la navigation file-based
- **@react-native-async-storage/async-storage** pour la persistance
- **@expo/vector-icons** pour les icônes des onglets

### 🧩 **Hooks et utilitaires**
- **React Hooks** (useState, useRef, useEffect, useCallback)
- **Expo Router hooks** (useLocalSearchParams, useRouter, useNavigation)
- **Custom hooks** pour la persistance et la gestion des thèmes

### 🎨 **UI et UX**
- **Safe Area Context** pour la gestion des zones sûres
- **React Native Screens** pour l'optimisation native
- **Haptic Feedback** pour les interactions tactiles
- **Animations et transitions** fluides

---

## 🎯 Objectifs pédagogiques atteints

### ✅ **TP1 - Composants interactifs**
- [x] État local avec useState et useRef
- [x] Gestion des timers et intervalles
- [x] Styles dynamiques et animations
- [x] Design responsive et moderne

### ✅ **TP2 - Navigation avancée**
- [x] Architecture file-based routing avec Expo Router
- [x] Navigation par onglets et stack imbriqués
- [x] Passage de paramètres avec validation
- [x] Persistance de l'état de navigation
- [x] Deep linking complet (cold/warm/hot)
- [x] Gestion d'erreurs et écrans 404
- [x] Architecture propre avec un seul layout racine

---

## 📖 Ressources et documentation

- [Documentation Expo](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Navigation](https://reactnavigation.org/)
- [Deep Linking Guide](https://docs.expo.dev/guides/linking/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [Communauté Discord Expo](https://chat.expo.dev)

---

## 🚀 Commandes utiles

```bash
# Développement
npm start                    # Démarrer Expo
npx expo start --clear       # Démarrer avec cache propre
npx expo start --web         # Version web

# Build et déploiement
npx expo prebuild            # Générer les dossiers natifs
npx expo run:ios             # Build et run iOS
npx expo run:android         # Build et run Android

# Debugging
npx expo install --fix       # Corriger les versions des packages
npx react-devtools           # Outils de développement React
```

---
