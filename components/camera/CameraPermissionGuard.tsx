import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCameraPermissions } from '../../hooks/useCameraPermissions';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface CameraPermissionGuardProps {
  children: React.ReactNode;
  onPermissionDenied?: () => void;
}

/**
 * Composant garde qui vérifie les permissions caméra avant d'afficher le contenu
 * Affiche une interface explicite en cas de refus avec action pour ouvrir les réglages
 */
export const CameraPermissionGuard: React.FC<CameraPermissionGuardProps> = ({
  children,
  onPermissionDenied,
}) => {
  const { hasPermission, isLoading, requestPermission, openSettings } = useCameraPermissions();

  // État de chargement
  if (hasPermission === null || isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>
          Vérification des permissions...
        </ThemedText>
      </ThemedView>
    );
  }

  // Permission accordée - afficher le contenu
  if (hasPermission) {
    return <>{children}</>;
  }

  // Permission refusée - afficher l'interface explicite
  return (
    <ThemedView style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="camera-outline" size={80} color="#999" />
      </View>
      
      <ThemedText style={styles.title}>
        Permission caméra requise
      </ThemedText>
      
      <ThemedText style={styles.description}>
        Cette application a besoin d'accéder à la caméra pour prendre des photos de robots.
        Veuillez autoriser l'accès à la caméra pour continuer.
      </ThemedText>
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={requestPermission}
      >
        <Ionicons name="camera" size={20} color="white" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>
          Autoriser la caméra
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={openSettings}
      >
        <Ionicons name="settings-outline" size={20} color="#007AFF" style={styles.buttonIcon} />
        <Text style={styles.secondaryButtonText}>
          Ouvrir les réglages
        </Text>
      </TouchableOpacity>
      
      {onPermissionDenied && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onPermissionDenied}
        >
          <Text style={styles.cancelButtonText}>
            Retour
          </Text>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    opacity: 0.8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 200,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 200,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});
