# Design TP4 - State Management

**Généré avec IA** : Validations uniquement + Vulgarisation concepts  
**Architecture** : Décidée manuellement  

## Vulgarisation IA (clé !)

L'IA a permis de comprendre Redux via analogie Vue.js :

```
State = data() en Vue
Slice = module Vuex  
Reducer = mutation Vuex
Actions = actions Vuex
Selectors = getters Vuex
```

Cette analogie a été **cruciale** pour maîtriser Redux venant de Vue.

## Code généré par IA

### Validation unicité

```typescript
// Utilisé dans TP4a (Zustand) et TP4b (Redux)
const existing = robots.find(r => r.name.toLowerCase() === name.toLowerCase());
if (existing) {
  throw new Error('Un robot avec ce nom existe déjà');
}
```

## Architecture (manuelle)

**TP4a - Zustand** :
- Store avec middlewares (persist, immer)
- Actions intégrées au store
- Persistance AsyncStorage

**TP4b - Redux Toolkit** :
- Slice avec reducers
- Selectors memoized
- Configuration store + persist

**Tous les écrans et composants** : Développés manuellement

## Décisions

**Pourquoi Zustand ET Redux** : Comparaison pédagogique  
**Pourquoi selectors memoized** : Performance (éviter re-calculs)

