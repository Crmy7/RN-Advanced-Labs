import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import RobotForm from '../../../../../components/robots/RobotForm';
import { useGetRobotById, useUpdateRobot } from '../../../../../store/robotsStore';
import type { Robot, RobotInput } from '../../../../../validation/robotSchema';

export default function EditRobotScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getById = useGetRobotById();
  const update = useUpdateRobot();
  const [robot, setRobot] = useState<Robot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRobot = getById(id);
      if (foundRobot) {
        setRobot(foundRobot);
      } else {
        setNotFound(true);
      }
    }
  }, [id, getById]);

  const handleSubmit = async (data: RobotInput) => {
    if (!robot) return { success: false, error: 'Robot non trouvé' };
    
    setIsLoading(true);
    
    try {
      const result = await update(robot.id, data);
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Show success message and go back
        Alert.alert(
          'Succès !',
          `Le robot "${data.name}" a été mis à jour avec succès.`,
          [
            {
              text: 'Retour à la liste',
              onPress: () => {
                router.back();
              }
            }
          ]
        );
        
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error updating robot:', error);
      return {
        success: false,
        error: 'Une erreur inattendue est survenue lors de la mise à jour du robot.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  if (notFound) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Robot non trouvé</Text>
        <Text style={styles.errorMessage}>
          Le robot avec l'ID "{id}" n'existe pas ou a été supprimé.
        </Text>
      </View>
    );
  }

  if (!robot) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RobotForm
        mode="edit"
        initialValues={{
          name: robot.name,
          label: robot.label,
          year: robot.year,
          type: robot.type,
        }}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f9fafb',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
});
