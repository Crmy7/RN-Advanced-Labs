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

# Travaux Pratiques

## TP1 - Profile Card Screen

### **Localisation**
[`app/(main)/(tabs)/tp1-profile-card.tsx`](./app/(main)/(tabs)/tp1-profile-card.tsx)

### **Description**
Écran de carte de profil interactif comprenant :
- **Affichage profil** : Photo, nom, rôle utilisateur
- **Follow/Unfollow** : Système interactif avec styles dynamiques
- **Timer manuel** : Contrôles start/reset avec état local
- **Auto-increment** : Compteur de followers (toutes les 5 secondes)
- **Design moderne** : Responsive avec effets d'ombre et animations

### **Objectifs pédagogiques**
- [x] État local avec `useState` et `useRef`
- [x] Gestion des timers et intervalles
- [x] Styles dynamiques et animations
- [x] Design responsive et moderne

### **Status** 
**Terminé** (Tag: `tp1-done`)

---

## TP2 - Navigation, Persistance & Deep Linking

### **Localisation**
Architecture complète `app/` avec Expo Router

### **Description**
- **Navigation multi-écrans** avec Expo Router (file-based routing)
- **Architecture Stack + Tabs** avec layouts imbriqués
- **Paramètres dynamiques** avec validation robuste
- **Persistance navigation** (retour à la dernière page)
- **Deep linking complet** (cold/warm/hot start)
- **Bouton retour natif** iOS avec geste "liquid"

### **Objectifs pédagogiques**
- [x] Architecture file-based routing avec Expo Router
- [x] Navigation par onglets et stack imbriqués
- [x] Passage de paramètres avec validation
- [x] Persistance de l'état de navigation
- [x] Deep linking complet (cold/warm/hot)
- [x] Gestion d'erreurs et écrans 404
- [x] Architecture propre avec un seul layout racine
- [x] Bouton retour natif iOS avec geste "liquid" interactif

### **Status**
**Terminé** (Tag: `tp2-done`)

### **Navigation et Deep Linking**

#### **Table des Routes**

| Route | Description | Type | Navigation |
|-------|-------------|------|------------|
| `/` | Point d'entrée avec persistance | Redirect | → `/(main)/(tabs)/home` |
| `/(main)/(tabs)/home` | Page d'accueil avec liens vers TP3 | Tab | Onglet "Accueil" |
| `/(main)/(tabs)/tp1-profile-card` | Carte de profil interactive (TP1) | Tab | Onglet "Profil" |
| `/(main)/(tabs)/tp3-forms` | Vue d'ensemble des formulaires | Tab | Onglet "Formulaires" |
| `/(main)/(tabs)/tp3-forms/formik` | Formulaire Formik + Yup | Stack | Accès direct en 2 taps |
| `/(main)/(tabs)/tp3-forms/rhf` | Formulaire RHF + Zod | Stack | Accès direct en 2 taps |
| `/(main)/detail/[id]` | Page de détail avec bouton retour natif | Stack | Header iOS avec geste "liquid" |

#### **Deep Links disponibles**

```bash
# Navigation principale
rnadvancedlabs://                    → Page d'accueil
rnadvancedlabs://tp1-profile-card    → Profile Card  

# Navigation avec paramètres
rnadvancedlabs://detail/42           → Écran de détail (ID: 42)
rnadvancedlabs://detail/123          → Écran de détail (ID: 123)

# Navigation TP3 - Formulaires
rnadvancedlabs://tp3-forms           → Vue d'ensemble des formulaires
rnadvancedlabs://tp3-forms/formik    → Formulaire Formik + Yup
rnadvancedlabs://tp3-forms/rhf       → Formulaire RHF + Zod

# Gestion d'erreurs
rnadvancedlabs://detail/             → Écran 404 (ID manquant)
```

#### **Bouton Retour Natif iOS**

- **Bouton chevron natif** : Icône iOS officielle sans texte
- **Geste "liquid"** : Glissement interactif depuis le bord gauche
- **Animation fluide** : Transition native iOS entre les écrans
- **Haptic feedback** : Retour haptique lors de l'interaction

---

## TP3 - Formulaires avancés avec validation temps réel

### **Localisation**
`app/(main)/(tabs)/tp3-forms/` avec arborescence structurée

### **Description**
- **Deux implémentations** de formulaires d'inscription identiques
- **Formik + Yup** : Gestion classique avec `useField` et validation Yup
- **React Hook Form + Zod** : Performance optimisée avec `Controller` et validation Zod
- **Validation temps réel** avec messages d'erreur dynamiques
- **Design moderne** avec placeholders personnalisés et animations
- **Navigation croisée** pour comparer les deux approches
- **Submit bloqué** si formulaire invalide ou non modifié
- **Instrumentation** et mesure des performances avec logs

### **Objectifs pédagogiques**
- [x] Deux implémentations identiques (Formik + Yup vs RHF + Zod)
- [x] Arborescence respectée avec validation/ et components/ séparés
- [x] Navigation directe en 2 taps maximum depuis l'accueil
- [x] Liens croisés Formik ⇄ RHF pour comparaison rapide
- [x] Validation temps réel avec messages d'erreur
- [x] Submit bloqué si formulaire invalide ou non modifié
- [x] Design moderne avec placeholders personnalisés
- [x] Retour fonctionnel avec header natif
- [x] Instrumentation et mesure des performances avec logs

### **Status**
**Terminé** (Tag: `tp3-done`)

### **Navigation TP3**

#### **Accès direct en 2 taps maximum**

**Depuis l'écran d'accueil :**
1. **Tap 1** : Bouton "TP3 – Formik" → `/(main)/(tabs)/tp3-forms/formik`
2. **Tap 1** : Bouton "TP3 – RHF" → `/(main)/(tabs)/tp3-forms/rhf`

**Depuis l'onglet Formulaires :**
1. **Tap 1** : Onglet "Formulaires" → Vue d'ensemble
2. **Tap 2** : Bouton vers Formik ou RHF

#### **Liens croisés**

Chaque écran de formulaire contient un bouton de navigation croisée :
- **Formik** → Bouton "Basculer vers RHF + Zod"
- **RHF** → Bouton "Basculer vers Formik + Yup"

#### **Retour fonctionnel**

- **Header natif** avec bouton retour iOS
- **Geste liquid** depuis le bord gauche
- **Navigation programmatique** avec `router.back()`
- **Pile de navigation** préservée

---

## Architecture du Projet

```
app/
  _layout.tsx                 # LAYOUT RACINE (Stack avec header natif)
  index.tsx                   # Point d'entrée avec persistance
  (main)/                     # Groupe principal avec Stack Navigator
    _layout.tsx               # Stack avec bouton retour natif iOS
    (tabs)/                   # Groupe onglets
      _layout.tsx             # Tabs Navigator (Accueil + Profil + Formulaires)
      home.tsx                # Page d'accueil avec liens vers TP3
      tp1-profile-card.tsx    # Écran du TP1 (intégré à la navigation)
      tp3-forms/              # TP3 - Formulaires avancés
        _layout.tsx           # Stack Navigator pour les formulaires
        index.tsx             # Vue d'ensemble des formulaires
        formik/               # Implémentation Formik + Yup
          index.tsx           # Écran principal Formik
          validation/
            schema.ts         # Schéma de validation Yup
          components/
            FormField.tsx     # Composant champ avec useField
            CheckboxField.tsx # Composant checkbox avec useField
        rhf/                  # Implémentation React Hook Form + Zod
          index.tsx           # Écran principal RHF
          validation/
            schema.ts         # Schéma de validation Zod
          components/
            FormField.tsx     # Composant champ avec Controller
            CheckboxField.tsx # Composant checkbox avec Controller
    detail/
      [id].tsx                # Écran dynamique avec bouton retour natif
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

### **Validation des Paramètres**

| Paramètre | Validation | Comportement |
|-----------|------------|--------------|
| `[id]` | Non vide, longueur < 50 caractères | Écran d'erreur 404 si invalide |
| `[id]` | Nettoyage automatique (trim) | Sécurisation des entrées utilisateur |
| `[id]` | Gestion des tableaux | Protection contre les paramètres malformés |

## Fonctionnalités

### Navigation
- **UN SEUL LAYOUT** dans `app/_layout.tsx` avec Tabs Navigator
- **Aucun layout** dans les groupes `(main)` et `(auth)`
- **Navigation par onglets** gérée directement depuis la racine
- **Écrans masqués** (détail, auth) via `href: null`
- **Validation des paramètres** avec écran d'erreur 404
- **Bouton retour natif iOS** avec geste "liquid" interactif

### Passage de paramètres
- Route dynamique `/detail/[id]` avec validation robuste
- Récupération sécurisée avec `useLocalSearchParams()`
- Écran d'erreur 404 pour les paramètres invalides
- Titre de page dynamique selon l'ID validé
- Navigation de retour native et programmatique

## Persistance de l'état de navigation

### Ce qui est persistant

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

# Navigation TP3 - Formulaires
rnadvancedlabs://tp3-forms                   → Vue d'ensemble des formulaires
rnadvancedlabs://tp3-forms/formik            → Formulaire Formik + Yup
rnadvancedlabs://tp3-forms/rhf               → Formulaire RHF + Zod
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

## 🔙 Bouton Retour Natif iOS

### 🎯 **Configuration**

L'application utilise le **Native Stack Navigator** d'Expo Router pour bénéficier du bouton retour natif iOS avec toutes ses fonctionnalités.

**Structure :**
```
app/(main)/_layout.tsx    # Stack Navigator avec options natives
├── (tabs)/               # Groupe Tabs (Accueil + Profil)
└── detail/[id].tsx       # Écran avec bouton retour natif
```

### ✨ **Fonctionnalités natives iOS**

- ✅ **Bouton chevron natif** : Icône iOS officielle sans texte (`headerBackButtonDisplayMode: "minimal"`)
- ✅ **Geste "liquid"** : Glissement interactif depuis le bord gauche de l'écran
- ✅ **Animation fluide** : Transition native iOS entre les écrans
- ✅ **Haptic feedback** : Retour haptique lors de l'interaction

### 🎮 **Utilisation**

1. **Navigation vers Détail** : Depuis Accueil ou Profil → "Voir Détail (ID: 42)"
2. **Retour par bouton** : Appuyer sur le chevron en haut à gauche
3. **Retour par geste** : Glisser depuis le bord gauche vers la droite
4. **Retour programmatique** : `router.back()` en cas d'erreur

### ⚙️ **Configuration technique**

```typescript
// app/(main)/_layout.tsx
<Stack
  screenOptions={{
    headerShown: true,
    gestureEnabled: true,                    // Active le geste de retour
    headerBackButtonDisplayMode: "minimal", // Masque le texte, garde l'icône
  }}
>
  <Stack.Screen
    name="detail/[id]"
    options={{
      title: "Détail",
      presentation: "card", // Animation de présentation en carte
    }}
  />
</Stack>
```

### 📱 **Comportement UX**

- **TabBar masquée** : Sur l'écran Détail, seul le header Stack est visible
- **TabBar visible** : Sur Accueil et Profil, les onglets restent accessibles
- **Navigation cohérente** : Le retour ramène toujours vers l'onglet d'origine


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

## Récapitulatif des TP

### **Objectifs pédagogiques globaux atteints**

| TP | Thème | Objectifs clés | Technologies |
|----|-------|----------------|-------------|
| **TP1** | Composants interactifs | État local, timers, animations | React Hooks, StyleSheet |
| **TP2** | Navigation avancée | File-based routing, deep linking | Expo Router, AsyncStorage |
| **TP3** | Formulaires avancés | Validation, performance, comparaison | Formik+Yup vs RHF+Zod |


## Ressources et documentation

- [Documentation Expo](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Navigation](https://reactnavigation.org/)
- [Deep Linking Guide](https://docs.expo.dev/guides/linking/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [Communauté Discord Expo](https://chat.expo.dev)

---

## Commandes utiles

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
