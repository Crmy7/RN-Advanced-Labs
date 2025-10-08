import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

export interface CameraPermissionState {
  hasPermission: boolean | null;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  openSettings: () => void;
}

/**
 * Hook personnalisé pour gérer les permissions de caméra
 * Gère la demande de permission, les refus et l'ouverture des réglages
 */
export const useCameraPermissions = (): CameraPermissionState => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier les permissions au montage du composant
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions caméra:', error);
      setHasPermission(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        showPermissionDeniedAlert();
      }
      
      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission caméra:', error);
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      'Permission caméra requise',
      'Cette application a besoin d\'accéder à la caméra pour prendre des photos. Vous pouvez activer cette permission dans les réglages de votre appareil.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Ouvrir les réglages',
          onPress: openSettings,
        },
      ]
    );
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  return {
    hasPermission,
    isLoading,
    requestPermission,
    openSettings,
  };
};
