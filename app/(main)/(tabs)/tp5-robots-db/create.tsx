import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import RobotFormDB from '../../../../components/robots/RobotFormDB';
import { useCreateRobotMutation } from '../../../../hooks/useRobotsQuery';
import { RobotInput } from '../../../../services/robotRepo';

export default function CreateRobotDBScreen() {
  const router = useRouter();
  const createMutation = useCreateRobotMutation();

  const handleSubmit = async (values: RobotInput) => {
    try {
      await createMutation.mutateAsync(values);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'Robot créé !',
        `Le robot "${values.name}" a été créé avec succès.`,
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
        error.message || 'Une erreur est survenue lors de la création du robot.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <RobotFormDB
        onSubmit={handleSubmit}
        submitButtonText="Créer le robot"
        isSubmitting={createMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});

