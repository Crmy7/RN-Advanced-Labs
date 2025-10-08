import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../../../../../components/themed-text';
import { ThemedView } from '../../../../../components/themed-view';
import * as PhotoStorage from '../../../../../lib/camera/storage';
import { Photo } from '../../../../../lib/camera/types';
import { usePhotoStorage } from '../../../../../lib/hooks/usePhotoStorage';

const { width, height } = Dimensions.get('window');

/**
 * TP6 - Écran Détail d'une photo
 * Affiche une photo en grand format avec options de suppression et partage
 */
export default function PhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newPhotoId, setNewPhotoId] = useState('');
  
  const { getPhoto, deletePhoto, formatFileSize } = usePhotoStorage();

  // Charger la photo au montage
  useEffect(() => {
    loadPhoto();
  }, [id]);

  const loadPhoto = async () => {
    if (!id) {
      setError('ID de photo manquant');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const photoData = await getPhoto(id);
      if (photoData) {
        setPhoto(photoData);
      } else {
        setError('Photo non trouvée');
      }
    } catch (err) {
      setError('Erreur lors du chargement de la photo');
      console.error('Erreur lors du chargement de la photo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!photo) return;

    Alert.alert(
      'Supprimer la photo',
      'Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const success = await deletePhoto(photo.id);
            if (success) {
              Alert.alert(
                'Photo supprimée',
                'La photo a été supprimée avec succès.',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer la photo.');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!photo) return;

    try {
      await Share.share({
        url: photo.uri,
        message: `Photo prise le ${photo.createdAt.toLocaleDateString('fr-FR')}`,
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert('Erreur', 'Impossible de partager la photo.');
    }
  };

  const handleRenamePress = () => {
    if (!photo) return;
    setNewPhotoId(photo.id);
    setShowRenameModal(true);
  };

  const confirmRename = async () => {
    if (!photo || !newPhotoId || newPhotoId === photo.id) {
      setShowRenameModal(false);
      return;
    }
    const res = await PhotoStorage.renamePhoto(photo.id, newPhotoId.trim());
    if (res.success && res.photo) {
      setPhoto(res.photo);
    }
    setShowRenameModal(false);
  };

  const handleSaveToLibrary = async () => {
    if (!photo) return;
    await PhotoStorage.saveToMediaLibrary(photo.id);
  };

  const goBack = () => {
    router.back();
  };

  const goToGallery = () => {
    router.push('/(main)/(tabs)/tp6-camera');
  };

  const toggleOverlay = () => {
    setShowOverlay(prev => !prev);
  };

  useEffect(() => {
    Animated.timing(overlayAnim, {
      toValue: showOverlay ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showOverlay, overlayAnim]);

  const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatDate = (date: Date) => `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;

  // État de chargement
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Chargement...</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Chargement de la photo...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // État d'erreur
  if (error || !photo) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Erreur</ThemedText>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <ThemedText style={styles.errorTitle}>Photo introuvable</ThemedText>
          <ThemedText style={styles.errorText}>
            {error || 'Cette photo n\'existe plus ou a été supprimée.'}
          </ThemedText>
          <TouchableOpacity style={styles.errorButton} onPress={goToGallery}>
            <ThemedText style={styles.errorButtonText}>Retour à la galerie</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Image plein écran + overlay unique */}
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={toggleOverlay}
        activeOpacity={1}
      >
        <Image 
          source={{ uri: photo.uri }} 
          style={styles.image} 
          resizeMode="cover" 
        />

        <Animated.View
          pointerEvents={showOverlay ? 'auto' : 'none'}
          style={[styles.overlayFull, { opacity: overlayAnim }]}
        >
          <LinearGradient
            colors={[ 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.8)' ]}
            locations={[0, 0.5, 1]}
            style={styles.gradient}
          >
            <View style={styles.topRow}>
              <TouchableOpacity style={styles.topButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={20} color="white" />
                <ThemedText style={styles.topText}>Retour</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.topText}>{formatDate(photo.createdAt)}</ThemedText>
            </View>

            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.bottomButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={18} color="white" />
                <ThemedText style={styles.bottomText}>Partager</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButton} onPress={handleRenamePress}>
                <Ionicons name="create-outline" size={18} color="white" />
                <ThemedText style={styles.bottomText}>Renommer</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButton} onPress={handleSaveToLibrary}>
                <Ionicons name="download-outline" size={18} color="white" />
                <ThemedText style={styles.bottomText}>Galerie</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottomButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
                <ThemedText style={[styles.bottomText, { color: '#ef4444' }]}>Supprimer</ThemedText>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
      {/* Modal de renommage */}
      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Renommer la photo</ThemedText>
            <TextInput
              value={newPhotoId}
              onChangeText={setNewPhotoId}
              placeholder="Nouvel identifiant"
              style={styles.modalInput}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowRenameModal(false)}>
                <ThemedText style={styles.modalButtonText}>Annuler</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalPrimary]} onPress={confirmRename}>
                <ThemedText style={[styles.modalButtonText, styles.modalPrimaryText]}>Valider</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Définitions minimales pour éviter les erreurs de styles référencés
  header: {
    height: 0,
    width: '100%',
  },
  headerButton: {
    width: 0,
    height: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  imageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayFull: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomRow: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 30,
  },
  errorButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  modalButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  modalPrimary: {
    backgroundColor: '#007AFF',
  },
  modalPrimaryText: {
    color: '#fff',
  },
});