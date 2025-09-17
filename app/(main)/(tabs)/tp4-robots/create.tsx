import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import RobotForm from '../../../../components/robots/RobotForm';
import { useCreateRobot } from '../../../../store/robotsStore';
import type { RobotInput } from '../../../../validation/robotSchema';

export default function CreateRobotScreen() {
  const router = useRouter();
  const create = useCreateRobot();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RobotInput) => {
    setIsLoading(true);
    
    try {
      const result = await create(data);
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Show success message
        Alert.alert(
          'Succès !',
          `Le robot "${data.name}" a été créé avec succès.`,
          [
            {
              text: 'Continuer',
              onPress: () => {
                // Form is already reset in RobotForm component
              }
            },
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
      console.error('Error creating robot:', error);
      return {
        success: false,
        error: 'Une erreur inattendue est survenue lors de la création du robot.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <RobotForm
        mode="create"
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
});
