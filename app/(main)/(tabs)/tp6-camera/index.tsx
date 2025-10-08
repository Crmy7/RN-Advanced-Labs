import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../../../../components/themed-text';
import { ThemedView } from '../../../../components/themed-view';
import { Photo } from '../../../../lib/camera/types';
import { usePhotoStorage } from '../../../../lib/hooks/usePhotoStorage';

const { width } = Dimensions.get('window');
const SPACING = 4;
const ITEM_SIZE = (width - (SPACING * 10)) / 3; // 3 colonnes avec marges optimisées

/**
 * TP6 - Écran Galerie (index)
 * Affiche la liste des photos sous forme de grille avec miniatures
 */
export default function PhotoGalleryScreen() {
  const {
    photos,
    isLoading,
    error,
    stats,
    refreshPhotos,
    clearAllPhotos,
    formatFileSize,
  } = usePhotoStorage();

  // Rafraîchir automatiquement quand l'écran reprend le focus
  useFocusEffect(
    useCallback(() => {
      refreshPhotos();
    }, [refreshPhotos])
  );

  const handlePhotoPress = (photo: Photo) => {
    router.push(`/(main)/(tabs)/tp6-camera/detail/${photo.id}`);
  };

  const handleCameraPress = () => {
    router.push('/(main)/(tabs)/tp6-camera/camera');
  };

  const handleClearAll = () => {
    if (photos.length === 0) return;

    Alert.alert(
      'Supprimer toutes les photos',
      `Êtes-vous sûr de vouloir supprimer toutes les ${photos.length} photos ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer tout',
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllPhotos();
            if (success) {
              Alert.alert('Succès', 'Toutes les photos ont été supprimées.');
            } else {
              Alert.alert('Erreur', 'Impossible de supprimer toutes les photos.');
            }
          },
        },
      ]
    );
  };

  const renderPhotoItem = ({ item, index }: { item: Photo; index: number }) => {
    const isLeftColumn = index % 3 === 0;
    const isRightColumn = index % 3 === 2;
    
    return (
      <TouchableOpacity
        style={[
          styles.photoItem,
          { 
            marginLeft: isLeftColumn ? SPACING : SPACING / 2,
            marginRight: isRightColumn ? SPACING : SPACING / 2,
          }
        ]}
        onPress={() => handlePhotoPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="camera-outline" size={80} color="#999" />
      <ThemedText style={styles.emptyTitle}>Aucune photo</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Appuyez sur le bouton caméra pour prendre votre première photo
      </ThemedText>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCameraPress}>
        <Ionicons name="camera" size={20} color="white" />
        <ThemedText style={styles.emptyButtonText}>Prendre une photo</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <ThemedText style={styles.title}>Galerie Photos</ThemedText>
        <View style={styles.headerButtons}>
          {photos.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleCameraPress}
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {stats && (
        <View style={styles.statsContainer}>
          <ThemedText style={styles.statsText}>
            {stats.totalPhotos} photo{stats.totalPhotos > 1 ? 's' : ''}
          </ThemedText>
          {stats.totalSize > 0 && (
            <>
              <ThemedText style={styles.statsSeparator}>•</ThemedText>
              <ThemedText style={styles.statsText}>
                {formatFileSize(stats.totalSize)}
              </ThemedText>
            </>
          )}
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {photos.length === 0 && !isLoading ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: SPACING }} />}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#1f2937',
    opacity: 0.7,
  },
  statsSeparator: {
    fontSize: 14,
    opacity: 0.7,
    marginHorizontal: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginBottom: 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 30,
    color: '#1f2937',
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
