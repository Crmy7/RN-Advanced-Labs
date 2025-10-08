/**
 * Types pour la gestion des photos dans TP6-camera
 */

export interface Photo {
  /** Identifiant unique de la photo */
  id: string;
  
  /** URI de la photo (chemin vers le fichier) */
  uri: string;
  
  /** Date de création de la photo */
  createdAt: Date;
  
  /** Taille du fichier en octets (optionnel) */
  size?: number;
  
  /** Nom du fichier (optionnel) */
  filename?: string;
  
  /** Dimensions de l'image (optionnel) */
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface PhotoInput {
  /** URI de la photo source */
  uri: string;
  
  /** Taille du fichier en octets (optionnel) */
  size?: number;
  
  /** Dimensions de l'image (optionnel) */
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface PhotoStorageResult {
  success: boolean;
  photo?: Photo;
  error?: string;
}

export interface PhotoListResult {
  success: boolean;
  photos: Photo[];
  error?: string;
}

export interface PhotoDeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Options pour la sauvegarde de photos
 */
export interface SavePhotoOptions {
  /** Sauvegarder aussi dans la galerie système */
  saveToGallery?: boolean;
  
  /** Qualité de compression (0-1) */
  quality?: number;
}

/**
 * Statistiques de stockage
 */
export interface StorageStats {
  /** Nombre total de photos */
  totalPhotos: number;
  
  /** Taille totale en octets */
  totalSize: number;
  
  /** Photo la plus récente */
  latestPhoto?: Photo;
  
  /** Photo la plus ancienne */
  oldestPhoto?: Photo;
}
