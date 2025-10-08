# Prompts TP6 – Caméra, Galerie & Détail (Traçabilité IA)

## Métadonnées
- Modèles: GPT-4 / Claude Sonnet 4.5 (Cursor)
- Période: Octobre 2025
- Confidentialité: Aucune donnée sensible (0 clés, 0 perso)

## Prompts majeurs

### 2) Caméra – isCameraReady et capture fiable
**Prompt**: « la prise de photo ne fonctionne plus » et « sablier qui bug »

**Sortie résumée**:
- État `isCameraReady`, callback `onCameraReady`
- Désactiver le bouton tant que non prêt
- `isCapturing` pour contrôler l’icône sablier

### 3) Dernière photo à l’arrivée
**Prompt**: « afficher la dernière photo ou celle qui vient d'être prise »

**Sortie résumée**:
- `listPhotos()` au focus/montage pour récupérer la plus récente
- Mettre à jour l’aperçu `lastPhoto` après `takePictureAsync`

### 4) Galerie – refresh automatique
**Prompt**: « la liste doit être à jour au retour »

**Sortie résumée**:
- `useFocusEffect(() => refreshPhotos())` dans `index.tsx`

## Extraits clés

```typescript
// useFocusEffect pour refresh Galerie
useFocusEffect(useCallback(() => {
  refreshPhotos();
}, [refreshPhotos]));
```

```typescript
// Contrôle capture fiable
const onCameraReady = () => setIsCameraReady(true);
if (!isCameraReady || isCapturing) return;
```

```typescript
// Overlay unique (détail)
<LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.8)']}>...</LinearGradient>
```

## Zones concernées (liens)
- `app/(main)/(tabs)/tp6-camera/index.tsx` (Galerie)
- `app/(main)/(tabs)/tp6-camera/camera.tsx` (Caméra)
- `app/(main)/(tabs)/tp6-camera/detail/[id].tsx` (Détail)
- `lib/hooks/usePhotoStorage.ts` (état photos)
- `lib/camera/storage.ts` (services purs)

## Tests & vérifs
- Build, lint, typage: OK
- Tests manuels: 
  - Galerie se met à jour au retour
  - Modale Renommer s’affiche et renomme
  - Dernière photo visible sur caméra


