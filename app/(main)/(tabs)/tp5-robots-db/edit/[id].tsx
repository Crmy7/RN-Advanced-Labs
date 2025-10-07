import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import RobotFormDB from '../../../../../components/robots/RobotFormDB';
import { IconSymbol } from '../../../../../components/ui/icon-symbol';
import { useRobotQuery, useUpdateRobotMutation } from '../../../../../hooks/useRobotsQuery';
import { RobotInput } from '../../../../../services/robotRepo';

export default function EditRobotDBScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: robot, isLoading, error } = useRobotQuery(id);
  const updateMutation = useUpdateRobotMutation();

  const handleSubmit = async (values: RobotInput) => {
    try {
      await updateMutation.mutateAsync({ id, updates: values });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'Robot mis à jour !',
        `Le robot "${values.name}" a été mis à jour avec succès.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        'Erreur',
        error.message || 'Une erreur est survenue lors de la mise à jour du robot.',
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error || !robot) {
    return (
      <View style={styles.centerContainer}>
        <IconSymbol name="exclamationmark.triangle" size={64} color="#9ca3af" />
        <Text style={styles.errorTitle}>Robot introuvable</Text>
        <Text style={styles.errorDescription}>
          Le robot demandé n'existe pas ou a été supprimé.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RobotFormDB
        initialValues={{
          name: robot.name,
          label: robot.label,
          year: robot.year,
          type: robot.type,
        }}
        onSubmit={handleSubmit}
        submitButtonText="Mettre à jour"
        isSubmitting={updateMutation.isPending}
      />
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
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

