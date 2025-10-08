import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import {
    Photo,
    PhotoDeleteResult,
    PhotoInput,
    PhotoListResult,
    PhotoStorageResult,
    SavePhotoOptions,
    StorageStats
} from './types';

/**
 * Service de stockage des photos pour TP6-camera
 * Gère la persistance, la récupération et la suppression des photos
 */

const PHOTOS_STORAGE_KEY = 'tp6_camera_photos';
const PHOTOS_DIRECTORY = `${FileSystem.documentDirectory}tp6_photos/`;

/**
 * Initialise le répertoire de stockage des photos
 */
async function ensurePhotosDirectory(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIRECTORY, { intermediates: true });
  }
}

/**
 * Génère un ID unique pour une photo
 */
function generatePhotoId(): string {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Génère un nom de fichier unique
 */
function generateFilename(id: string): string {
  return `${id}.jpg`;
}

/**
 * Sauvegarde les métadonnées des photos dans AsyncStorage
 */
async function savePhotosMetadata(photos: Photo[]): Promise<void> {
  try {
    const photosData = photos.map(photo => ({
      ...photo,
      createdAt: photo.createdAt.toISOString(), // Sérialiser la date
    }));
    await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photosData));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des métadonnées:', error);
    throw new Error('Impossible de sauvegarder les métadonnées des photos');
  }
}

/**
 * Récupère les métadonnées des photos depuis AsyncStorage
 */
async function loadPhotosMetadata(): Promise<Photo[]> {
  try {
    const photosData = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
    if (!photosData) return [];
    
    const parsedPhotos = JSON.parse(photosData);
    return parsedPhotos.map((photo: any) => ({
      ...photo,
      createdAt: new Date(photo.createdAt), // Désérialiser la date
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des métadonnées:', error);
    return [];
  }
}

/**
 * Sauvegarde une photo dans le stockage local
 */
export async function savePhoto(
  photoInput: PhotoInput, 
  options: SavePhotoOptions = {}
): Promise<PhotoStorageResult> {
  try {
    await ensurePhotosDirectory();
    
    const photoId = generatePhotoId();
    const filename = generateFilename(photoId);
    const localUri = `${PHOTOS_DIRECTORY}${filename}`;
    
    // Copier la photo vers le répertoire de stockage
    await FileSystem.copyAsync({
      from: photoInput.uri,
      to: localUri,
    });
    
    // Obtenir les informations du fichier
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    const fileSize = fileInfo.exists ? fileInfo.size : undefined;
    
    // Créer l'objet Photo
    const photo: Photo = {
      id: photoId,
      uri: localUri,
      createdAt: new Date(),
      size: fileSize || photoInput.size,
      filename,
      dimensions: photoInput.dimensions,
    };
    
    // Charger les photos existantes et ajouter la nouvelle
    const existingPhotos = await loadPhotosMetadata();
    const updatedPhotos = [photo, ...existingPhotos]; // Nouvelle photo en premier
    
    // Sauvegarder les métadonnées
    await savePhotosMetadata(updatedPhotos);
    
    // Optionnel : sauvegarder dans la galerie système
    if (options.saveToGallery) {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          await MediaLibrary.saveToLibraryAsync(localUri);
        }
      } catch (error) {
        console.warn('Impossible de sauvegarder dans la galerie:', error);
        // Ne pas faire échouer la sauvegarde principale
      }
    }
    
    return {
      success: true,
      photo,
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Récupère la liste de toutes les photos
 */
export async function listPhotos(): Promise<PhotoListResult> {
  try {
    const photos = await loadPhotosMetadata();
    
    // Vérifier que les fichiers existent toujours
    const validPhotos: Photo[] = [];
    for (const photo of photos) {
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (fileInfo.exists) {
        validPhotos.push(photo);
      }
    }
    
    // Si des photos ont été supprimées, mettre à jour les métadonnées
    if (validPhotos.length !== photos.length) {
      await savePhotosMetadata(validPhotos);
    }
    
    return {
      success: true,
      photos: validPhotos,
    };
  } catch (error) {
    console.error('Erreur lors du chargement des photos:', error);
    return {
      success: false,
      photos: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Récupère une photo par son ID
 */
export async function getPhoto(id: string): Promise<Photo | null> {
  try {
    const photos = await loadPhotosMetadata();
    const photo = photos.find(p => p.id === id);
    
    if (!photo) return null;
    
    // Vérifier que le fichier existe
    const fileInfo = await FileSystem.getInfoAsync(photo.uri);
    if (!fileInfo.exists) {
      // Supprimer la photo des métadonnées si le fichier n'existe plus
      const updatedPhotos = photos.filter(p => p.id !== id);
      await savePhotosMetadata(updatedPhotos);
      return null;
    }
    
    return photo;
  } catch (error) {
    console.error('Erreur lors de la récupération de la photo:', error);
    return null;
  }
}

/**
 * Supprime une photo
 */
export async function deletePhoto(id: string): Promise<PhotoDeleteResult> {
  try {
    const photos = await loadPhotosMetadata();
    const photo = photos.find(p => p.id === id);
    
    if (!photo) {
      return {
        success: false,
        error: 'Photo non trouvée',
      };
    }
    
    // Supprimer le fichier physique
    try {
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(photo.uri);
      }
    } catch (error) {
      console.warn('Impossible de supprimer le fichier physique:', error);
      // Continuer pour supprimer les métadonnées
    }
    
    // Supprimer des métadonnées
    const updatedPhotos = photos.filter(p => p.id !== id);
    await savePhotosMetadata(updatedPhotos);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Renomme une photo (change l'ID et le nom de fichier)
 */
export async function renamePhoto(id: string, newId: string): Promise<{ success: boolean; photo?: Photo; error?: string }> {
  try {
    await ensurePhotosDirectory();
    const photos = await loadPhotosMetadata();
    const photo = photos.find(p => p.id === id);
    if (!photo) return { success: false, error: 'Photo non trouvée' };

    const newFilename = generateFilename(newId);
    const newUri = `${PHOTOS_DIRECTORY}${newFilename}`;

    // Déplacer/renommer le fichier
    await FileSystem.moveAsync({ from: photo.uri, to: newUri });

    // Mettre à jour les métadonnées
    const updated: Photo = { ...photo, id: newId, filename: newFilename, uri: newUri };
    const updatedList = photos.map(p => (p.id === id ? updated : p));
    await savePhotosMetadata(updatedList);

    return { success: true, photo: updated };
  } catch (error) {
    console.error('Erreur lors du renommage de la photo:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

/**
 * Sauvegarde une photo dans la galerie système (Media Library)
 */
export async function saveToMediaLibrary(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const photos = await loadPhotosMetadata();
    const photo = photos.find(p => p.id === id);
    if (!photo) return { success: false, error: 'Photo non trouvée' };

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return { success: false, error: 'Permission refusée' };

    await MediaLibrary.saveToLibraryAsync(photo.uri);
    return { success: true };
  } catch (error) {
    console.error('Erreur Media Library:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
}

/**
 * Supprime toutes les photos
 */
export async function clearAllPhotos(): Promise<PhotoDeleteResult> {
  try {
    // Supprimer tous les fichiers du répertoire
    const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIRECTORY);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(PHOTOS_DIRECTORY);
    }
    
    // Vider les métadonnées
    await AsyncStorage.removeItem(PHOTOS_STORAGE_KEY);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les photos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Obtient les statistiques de stockage
 */
export async function getStorageStats(): Promise<StorageStats> {
  try {
    const photos = await loadPhotosMetadata();
    
    const totalPhotos = photos.length;
    const totalSize = photos.reduce((sum, photo) => sum + (photo.size || 0), 0);
    
    const sortedByDate = [...photos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const latestPhoto = sortedByDate[0];
    const oldestPhoto = sortedByDate[sortedByDate.length - 1];
    
    return {
      totalPhotos,
      totalSize,
      latestPhoto,
      oldestPhoto,
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    return {
      totalPhotos: 0,
      totalSize: 0,
    };
  }
}

/**
 * Formate la taille en octets en format lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
