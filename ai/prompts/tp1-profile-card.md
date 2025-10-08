# Prompts TP1 - Profile Card & Timer

**Date** : Septembre 2024  
**Modèle** : Claude Sonnet 4.5 (Cursor IDE)  
**Assistance IA** : ~10% (explications uniquement)

## Prompts principaux

### 1. StyleSheet en React Native

**Prompt** : "Comment fonctionne le CSS en React Native ? C'est quoi StyleSheet ?"

**Réponse IA (résumée)** :
- React Native utilise `StyleSheet.create()` au lieu de CSS
- Propriétés en camelCase (backgroundColor, fontSize)
- Pas d'unités (px, rem) → Valeurs numériques directes
- Flexbox par défaut

**Code exemple donné** :
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  }
});
```

---

### 2. Styles de base

**Prompt** : "Comment ajouter des ombres et bordures sur une card ?"

**Réponse IA** : Utiliser shadowOffset, shadowOpacity, shadowRadius

**Code exemple donné** :
```typescript
card: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5, // Pour Android
}
```

## Code développé manuellement

- ✅ Logique du profil (useState pour followers)
- ✅ Timer avec setInterval/useEffect
- ✅ Structure des composants
- ✅ Toute la UI

## Résultats

✅ Compréhension StyleSheet  
✅ Styles de base appliqués  
✅ Tout le code fonctionnel développé manuellement

