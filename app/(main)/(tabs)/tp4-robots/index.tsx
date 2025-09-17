import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RobotListItem from '../../../../components/robots/RobotListItem';
import { useRemoveRobot, useRobotsSorted } from '../../../../store/robotsStore';
import type { Robot } from '../../../../validation/robotSchema';

export default function RobotsListScreen() {
  const router = useRouter();
  const robots = useRobotsSorted();
  const remove = useRemoveRobot();

  const handleCreateRobot = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/tp4-robots/create' as any);
  };

  const handleDeleteRobot = useCallback(async (id: string) => {
    const success = remove(id);
    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [remove]);

  const renderRobotItem = useCallback(({ item }: { item: Robot }) => (
    <RobotListItem
      robot={item}
      onDelete={handleDeleteRobot}
    />
  ), [handleDeleteRobot]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="hardware-chip-outline" size={80} color="#d1d5db" />
      <Text style={styles.emptyTitle}>Aucun robot</Text>
      <Text style={styles.emptySubtitle}>
        Commencez par créer votre premier robot !
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleCreateRobot}
      >
        <Ionicons name="add-circle" size={20} color="#ffffff" />
        <Text style={styles.emptyButtonText}>Créer un robot</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Mes Robots</Text>
      <Text style={styles.headerSubtitle}>
        {robots.length} robot{robots.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={robots}
        renderItem={renderRobotItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          robots.length === 0 && styles.listContentEmpty
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              // Les données sont déjà synchronisées via Zustand
              // Ici on pourrait ajouter un sync avec un serveur
            }}
            tintColor="#3b82f6"
          />
        }
      />

      {/* Floating Action Button */}
      {robots.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateRobot}
          accessibilityLabel="Créer un nouveau robot"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  listContentEmpty: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#f9fafb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
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
