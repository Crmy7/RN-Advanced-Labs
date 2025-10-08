# Prompts TP2 - Navigation & Deep Linking

**Date** : Octobre 2024  
**Modèle** : Claude Sonnet 4.5 (Cursor IDE)  
**Assistance IA** : ~15% (explications uniquement)

## Prompts principaux

### 1. Architecture Expo Router

**Prompt** : "Comment fonctionne Expo Router ? Quelle est la différence entre Stack et Tabs ?"

**Réponse IA (résumée)** :
- **File-based routing** : Structure de dossiers = routes
- **Stack** : Navigation avec bouton retour (empilée)
- **Tabs** : Navigation horizontale (onglets en bas)
- Layouts : `_layout.tsx` définit la navigation

---

### 2. Niveaux de navigation

**Prompt** : "Pourquoi le bouton retour apparaît sur certains écrans et pas d'autres ?"

**Réponse IA (résumée)** :
- Un **Stack en niveau 1** devient une racine
- Pas de bouton retour pour la racine
- Les écrans enfants du Stack ont le bouton retour

**Schéma explicatif donné** :
```
app/
├── (main)/           ← Stack niveau 1 (racine)
│   ├── (tabs)/       ← Tabs niveau 2
│   │   ├── home.tsx  ← Pas de retour (racine tabs)
│   │   └── about.tsx ← Pas de retour (racine tabs)
│   └── details.tsx   ← Bouton retour (enfant du Stack)
```

---

### 3. Deep linking

**Prompt** : "Comment configurer les deep links avec Expo ?"

**Réponse IA** : 
- Ajouter `scheme` dans `app.json`
- Utiliser `Linking.createURL()` pour générer URLs
- Tester cold/warm/hot start

## Code développé manuellement

- ✅ Structure de navigation complète
- ✅ Écrans About/Contact
- ✅ Configuration deep linking
- ✅ Persistance AsyncStorage
- ✅ Toute la logique

## Résultats

✅ Compréhension navigation Expo Router  
✅ Compréhension niveaux et bouton retour  
✅ Deep links fonctionnels  
✅ Tout le code développé manuellement

