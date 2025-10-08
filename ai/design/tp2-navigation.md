# Design TP2 - Navigation & Deep Linking

**Généré avec IA** : Rien (explications uniquement)  
**Architecture** : Décidée et développée manuellement  

## Assistance IA

L'IA a fourni des **explications pédagogiques** uniquement :

### File-based routing

```
app/
├── (main)/           ← Stack (racine)
│   └── (tabs)/       ← Tabs
│       ├── home.tsx
│       └── about.tsx
```

### Compréhension bouton retour

**Concept clé expliqué par l'IA** :
- Stack niveau 1 = racine → Pas de bouton retour
- Écrans enfants du Stack → Bouton retour

### Deep linking

**Configuration expliquée** :
```json
// app.json
{
  "scheme": "myapp"
}
```

## Architecture (manuelle)

- ✅ Structure de navigation complète
- ✅ Configuration tabs/stack
- ✅ Écrans About/Contact
- ✅ Deep linking configuré
- ✅ AsyncStorage pour persistance

## Code développé manuellement

- ✅ Tous les layouts
- ✅ Tous les écrans
- ✅ Toute la logique

**Assistance IA** : ~15% (explications concepts navigation)

