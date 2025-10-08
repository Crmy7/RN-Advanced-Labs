import { useCallback, useEffect, useState } from 'react';
import * as PhotoStorage from '../camera/storage';
import {
    Photo,
    PhotoInput,
    SavePhotoOptions,
    StorageStats
} from '../camera/types';

/**
 * Hook pour gérer le stockage des photos avec état React
 * Wrapper stateful autour de lib/camera/storage.ts
 */
export interface UsePhotoStorageReturn {
  // État
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  stats: StorageStats | null;
  
  // Actions
  savePhoto: (photoInput: PhotoInput, options?: SavePhotoOptions) => Promise<boolean>;
  deletePhoto: (id: string) => Promise<boolean>;
  refreshPhotos: () => Promise<void>;
  clearAllPhotos: () => Promise<boolean>;
  getPhoto: (id: string) => Promise<Photo | null>;
  
  // Utilitaires
  formatFileSize: (bytes: number) => string;
}

export const usePhotoStorage = (): UsePhotoStorageReturn => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StorageStats | null>(null);

  /**
   * Charge la liste des photos
   */
  const refreshPhotos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PhotoStorage.listPhotos();
      if (result.success) {
        setPhotos(result.photos);
        
        // Mettre à jour les statistiques
        const storageStats = await PhotoStorage.getStorageStats();
        setStats(storageStats);
      } else {
        setError(result.error || 'Erreur lors du chargement des photos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sauvegarde une nouvelle photo
   */
  const savePhoto = useCallback(async (
    photoInput: PhotoInput, 
    options?: SavePhotoOptions
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PhotoStorage.savePhoto(photoInput, options);
      if (result.success && result.photo) {
        // Ajouter la nouvelle photo en tête de liste
        setPhotos(prev => [result.photo!, ...prev]);
        
        // Mettre à jour les statistiques
        const storageStats = await PhotoStorage.getStorageStats();
        setStats(storageStats);
        
        return true;
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Supprime une photo
   */
  const deletePhoto = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PhotoStorage.deletePhoto(id);
      if (result.success) {
        // Supprimer la photo de la liste
        setPhotos(prev => prev.filter(photo => photo.id !== id));
        
        // Mettre à jour les statistiques
        const storageStats = await PhotoStorage.getStorageStats();
        setStats(storageStats);
        
        return true;
      } else {
        setError(result.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Supprime toutes les photos
   */
  const clearAllPhotos = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await PhotoStorage.clearAllPhotos();
      if (result.success) {
        setPhotos([]);
        setStats({
          totalPhotos: 0,
          totalSize: 0,
        });
        return true;
      } else {
        setError(result.error || 'Erreur lors de la suppression');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupère une photo par son ID
   */
  const getPhoto = useCallback(async (id: string): Promise<Photo | null> => {
    try {
      return await PhotoStorage.getPhoto(id);
    } catch (err) {
      console.error('Erreur lors de la récupération de la photo:', err);
      return null;
    }
  }, []);

  /**
   * Formate la taille d'un fichier
   */
  const formatFileSize = useCallback((bytes: number): string => {
    return PhotoStorage.formatFileSize(bytes);
  }, []);

  // Charger les photos au montage du hook
  useEffect(() => {
    refreshPhotos();
  }, [refreshPhotos]);

  return {
    // État
    photos,
    isLoading,
    error,
    stats,
    
    // Actions
    savePhoto,
    deletePhoto,
    refreshPhotos,
    clearAllPhotos,
    getPhoto,
    
    // Utilitaires
    formatFileSize,
  };
};
