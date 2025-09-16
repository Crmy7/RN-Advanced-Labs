# RN-Advanced-Labs 📱

Laboratoire avancé de développement React Native avec Expo.

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
**📁 Dossier :** [`app/tp1-profile-card/`](./app/tp1-profile-card/)

**📋 Description :** 
Écran de carte de profil interactif comprenant :
- 👤 Affichage d'un profil utilisateur (photo, nom, rôle)
- ❤️ Système de follow/unfollow avec styles dynamiques
- ⏱️ Timer manuel avec contrôles start/reset
- 📈 Compteur de followers qui s'incrémente automatiquement (toutes les 5 secondes)
- 🎨 Design responsive avec effets d'ombre et animations

**✅ Status :** Terminé (Tag: `tp1-done`)

---

## 📁 Arborescence du projet

```
app/
├── _layout.tsx                 # Layout principal de l'app
├── (tabs)/                     # Navigation par onglets
│   ├── _layout.tsx            # Layout des onglets
│   ├── explore.tsx            # Onglet Explorer
│   └── index.tsx              # Onglet d'accueil
├── modal.tsx                   # Écran modal
├── tp1-profile-card/           # 🎯 TP1 - Profile Card
│   ├── assets/                # Ressources du TP1
│   │   └── img/
│   ├── components/            # Composants du TP1
│   ├── index.tsx              # Écran principal du TP1
│   └── screens/               # Écrans du TP1
└── tp2-minimal-screen/         # 🚧 TP2 - À venir
```

---

## 🛠️ Technologies utilisées

- **React Native** avec Expo
- **TypeScript**
- **Expo Router** (file-based routing)
- **React Hooks** (useState, useRef, useEffect)

## 📖 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Tutoriel Expo](https://docs.expo.dev/tutorial/introduction/)
- [Communauté Discord](https://chat.expo.dev)
