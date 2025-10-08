# Design TP1 - Profile Card & Timer

**Généré avec IA** : Rien (explications uniquement)  
**Architecture** : Décidée et développée manuellement  

## Assistance IA

L'IA a fourni des **explications pédagogiques** uniquement :

### StyleSheet.create()

```typescript
// Expliqué par l'IA
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  }
});
```

### Shadows

```typescript
// Exemple donné par l'IA
card: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5, // Android
}
```

## Architecture (manuelle)

```
Home Screen
├── ProfileCard (photo, nom, description)
├── FollowerCounter (useState)
└── Timer (useEffect + setInterval)
```

## Code développé manuellement

- ✅ Toute la logique (useState, useEffect)
- ✅ Toute la UI
- ✅ Gestion du timer
- ✅ Cleanup setInterval

**Assistance IA** : ~10% (explications concepts)

