import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CameraPermissionGuard } from '../../../../components/camera/CameraPermissionGuard';
import { ThemedText } from '../../../../components/themed-text';
import { ThemedView } from '../../../../components/themed-view';
import { usePhotoStorage } from '../../../../lib/hooks/usePhotoStorage';

/**
 * TP6 - Écran de prise de vue (camera)
 * Interface dédiée à la capture de photos
 */
export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  const { savePhoto, isLoading, photos, refreshPhotos } = usePhotoStorage();

  // Charger la dernière photo à l'arrivée sur l'écran
  useFocusEffect(
    useCallback(() => {
      const loadLast = async () => {
        await refreshPhotos();
        if (photos && photos.length > 0) {
          // Trouver la plus récente par createdAt
          const latest = photos.reduce((acc, p) =>
            !acc || (p.createdAt && acc.createdAt && p.createdAt > acc.createdAt) ? p : acc,
          undefined as any);
          if (latest?.uri) setLastPhoto(latest.uri);
        }
      };
      loadLast();
    }, [refreshPhotos, photos])
  );

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing || !isCameraReady) return;

    setIsCapturing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        setLastPhoto(photo.uri);
        
        // Sauvegarder la photo via le service de stockage
        const success = await savePhoto({ uri: photo.uri });

        if (success) {
          // Mettre à jour l'aperçu puis retour auto à la galerie
          setLastPhoto(photo.uri);
          router.push('/(main)/(tabs)/tp6-camera');
        } else {
          console.warn('Impossible de sauvegarder la photo.');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const goToGallery = () => {
    router.push('/(main)/(tabs)/tp6-camera');
  };

  const goBack = () => {
    router.back();
  };

  return (
    <CameraPermissionGuard onPermissionDenied={goBack}>
      <ThemedView style={styles.container}>
        {/* Header avec glassmorphisme */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ThemedText style={styles.headerTitle}>Caméra</ThemedText>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={goToGallery}>
            <Ionicons name="images" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Caméra */}
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={() => setIsCameraReady(true)}
          />
        </View>

        {/* Contrôles avec glassmorphisme */}
        <View style={styles.controls}>
          {/* Aperçu de la dernière photo */}
          <View style={styles.photoPreview}>
            {lastPhoto ? (
              <TouchableOpacity onPress={goToGallery} style={styles.thumbnailContainer}>
                <Image source={{ uri: lastPhoto }} style={styles.thumbnail} />
                <View style={styles.thumbnailOverlay}>
                  <Ionicons name="images" size={16} color="white" />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={goToGallery} style={styles.emptyThumbnail}>
                <Ionicons name="images-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
          </View>

          {/* Bouton de capture moderne */}
          <TouchableOpacity
            style={[
              styles.captureButton,
              isCapturing || !isCameraReady ? styles.captureButtonDisabled : undefined
            ]}
            onPress={takePicture}
            disabled={isCapturing || !isCameraReady}
          >
            <View style={styles.captureButtonOuter}>
              <View style={[
                styles.captureButtonInner,
                (isCapturing || !isCameraReady) && styles.captureButtonInnerDisabled
              ]}>
                {isCapturing && (
                  <Ionicons name="hourglass" size={20} color="white" />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Bouton flip (après galerie et capture) */}
          <TouchableOpacity style={styles.flipFooterButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={22} color="white" />
          </TouchableOpacity>
        </View>

      </ThemedView>
    </CameraPermissionGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backdropFilter: 'blur(20px)',
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
    backdropFilter: 'blur(10px)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72, // Espace pour le header
    paddingRight: 16,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    padding: 12,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 12,
    backdropFilter: 'blur(20px)',
  },
  photoPreview: {
    width: 60,
    height: 60,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 2,
  },
  emptyThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  captureButton: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonInnerDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  flipFooterButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
  },
});
