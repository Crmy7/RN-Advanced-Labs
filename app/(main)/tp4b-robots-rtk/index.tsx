import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import RobotListItemRTK from '../../../components/robots/RobotListItemRTK';
import { clearError, deleteRobot } from '../../../features/robots/robotsSlice';
import { selectRobotsCount, selectRobotsError, selectRobotsSortedByName } from '../../../features/robots/selectors';

export default function RobotsListScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const robots = useAppSelector(selectRobotsSortedByName);
  const error = useAppSelector(selectRobotsError);
  const robotsCount = useAppSelector(selectRobotsCount);

  // Nettoyer les erreurs au focus de l'écran
  useFocusEffect(
    useCallback(() => {
      if (error) {
        dispatch(clearError());
      }
    }, [dispatch, error])
  );

  const handleDeleteRobot = async (robotId: string) => {
    try {
      dispatch(deleteRobot(robotId));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Erreur',
        'Impossible de supprimer le robot',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCreateRobot = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(main)/tp4b-robots-rtk/create');
  };

  const handleRefresh = () => {
    // Pour l'instant, juste nettoyer les erreurs
    if (error) {
      dispatch(clearError());
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="construct-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyTitle}>Aucun robot</Text>
      <Text style={styles.emptyDescription}>
        Commencez par créer votre premier robot !
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleCreateRobot}
      >
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.emptyButtonText}>Créer un robot</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.subtitle}>
        {robotsCount === 0 
          ? 'Aucun robot' 
          : `${robotsCount} robot${robotsCount > 1 ? 's' : ''}`
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => dispatch(clearError())}
          >
            <Text style={styles.errorButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={robots}
        renderItem={({ item }) => (
          <RobotListItemRTK
            robot={item}
            onDelete={handleDeleteRobot}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={robots.length === 0 ? styles.emptyContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />


      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateRobot}
        accessibilityLabel="Créer un nouveau robot"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  errorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dc2626',
    borderRadius: 4,
    marginLeft: 8,
  },
  errorButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
