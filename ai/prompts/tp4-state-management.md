# Prompts TP4 - State Management (Zustand & Redux)

**Date** : Novembre-Décembre 2024  
**Modèle** : Claude Sonnet 4.5 (Cursor IDE)  

## Prompts principaux

### 1. Vulgarisation Redux (clé !)

**Prompt** : "J'ai l'habitude de Vue.js, peux-tu m'expliquer Redux avec des analogies Vue ?"

**Réponse IA (résumée)** :

```
State ? Slice ? Reducer ?

- State = data() en Vue
- Slice = module Vuex  
- Reducer = mutation Vuex

Actions Redux = actions Vuex
Selectors = getters Vuex
```

**Impact** : ✅ Compréhension totale de l'architecture Redux

---

### 2. Validation unicité nom

**Prompt** : "Comment valider qu'un nom de robot est unique avant de l'ajouter ?"

**Sortie générée** :
```typescript
const existing = robots.find(r => r.name.toLowerCase() === name.toLowerCase());
if (existing) {
  throw new Error('Un robot avec ce nom existe déjà');
}
```

**Utilisé dans** : TP4a (Zustand) et TP4b (Redux)

---

### 3. Zustand vs Redux

**Prompt** : "Quand utiliser Zustand vs Redux ?"

**Réponse résumée** :
- **Zustand** : Petits projets, moins de boilerplate
- **Redux** : Grands projets, DevTools, écosystème riche

## Résultats

✅ Concepts Redux maîtrisés via analogie Vue  
✅ Validations fonctionnelles  
✅ Choix éclairé entre Zustand et Redux

