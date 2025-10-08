/**
 * Point d'entrée pour les services de caméra TP6
 * Exporte tous les types, fonctions et hooks nécessaires
 */

// Types
export * from './types';

// Services de stockage
export * from './storage';

// Hooks
export { usePhotoStorage } from '../hooks/usePhotoStorage';

// Réexport du hook de permissions pour faciliter l'import
export { useCameraPermissions } from '../../hooks/useCameraPermissions';
