import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RobotListItemDB from '../../../../components/robots/RobotListItemDB';
import { IconSymbol } from '../../../../components/ui/icon-symbol';
import { openDatabase } from '../../../../db';
import { useDeleteRobotMutation, useRobotsQuery } from '../../../../hooks/useRobotsQuery';
import { exportRobots, pickAndImportRobots } from '../../../../services/robotExport';

export default function RobotsDBListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser la base de données au montage
  useEffect(() => {
    let mounted = true;

    const initDB = async () => {
      try {
        await openDatabase();
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation de la DB:', error);
      }
    };

    initDB();

    return () => {
      mounted = false;
    };
  }, []);

  const { data, isLoading, refetch, isRefetching } = useRobotsQuery({
    q: searchQuery,
    sort: 'name',
    order: 'ASC',
  });

  const deleteMutation = useDeleteRobotMutation();

  const handleCreate = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/tp5-robots-db/create');
  };

  const handleEdit = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/tp5-robots-db/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleExport = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await exportRobots();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const handleImport = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const count = await pickAndImportRobots();
      
      if (count !== null && count > 0) {
        // Recharger la liste après import
        await refetch();
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Erreur lors de l\'import:', error);
    }
  };

  const showMenu = () => {
    Alert.alert(
      'Options',
      'Choisissez une action',
      [
        {
          text: 'Exporter les robots',
          onPress: handleExport,
        },
        {
          text: 'Importer des robots',
          onPress: handleImport,
        },
        {
          text: 'Debug DB',
          onPress: () => router.push('/(main)/(tabs)/tp5-robots-db/debug'),
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  if (!isInitialized) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Initialisation de la base de données...</Text>
      </View>
    );
  }

  const robots = data?.robots || [];
  const isEmpty = robots.length === 0 && !searchQuery;

  return (
    <View style={styles.container}>
      {/* Barre de recherche et menu */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un robot..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.menuButton} onPress={showMenu}>
          <IconSymbol name="ellipsis.circle" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      {isLoading && !isRefetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : isEmpty ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="cpu" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Aucun robot</Text>
          <Text style={styles.emptyDescription}>
            Commencez par créer votre premier robot !
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleCreate}>
            <Text style={styles.emptyButtonText}>Créer un robot</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={robots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RobotListItemDB
              robot={item}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
          }
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.emptyContainer}>
                <IconSymbol name="magnifyingglass" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>Aucun résultat</Text>
                <Text style={styles.emptyDescription}>
                  Aucun robot ne correspond à votre recherche
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* FAB */}
      {!isEmpty && (
        <TouchableOpacity style={styles.fab} onPress={handleCreate}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Compteur */}
      {robots.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {data?.total || 0} robot{(data?.total || 0) > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
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
  footer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

