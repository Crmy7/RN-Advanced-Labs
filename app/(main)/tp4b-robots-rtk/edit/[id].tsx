import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../app/_hooks';
import RobotFormRTK from '../../../../components/robots/RobotFormRTK';
import { clearError, saveRobotAsync, updateRobot } from '../../../../features/robots/robotsSlice';
import { selectRobotById, selectRobotsError, selectRobotsLoading } from '../../../../features/robots/selectors';
import { RobotFormData } from '../../../../validation/robotSchemaRTK';

export default function EditRobotScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const robot = useAppSelector((state) => selectRobotById(id!)(state));
  const isLoading = useAppSelector(selectRobotsLoading);
  const error = useAppSelector(selectRobotsError);

  useEffect(() => {
    // Nettoyer les erreurs au montage
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (data: RobotFormData): Promise<{ success: boolean; error?: string }> => {
    if (!robot) {
      return { success: false, error: 'Robot non trouvé' };
    }

    try {
      // Nettoyer les erreurs précédentes
      dispatch(clearError());
      
      // Utiliser le thunk asynchrone pour la démo
      const updatedRobot = { ...robot, ...data };
      const result = await dispatch(saveRobotAsync({ 
        robot: updatedRobot, 
        isUpdate: true 
      }));
      
      if (saveRobotAsync.fulfilled.match(result)) {
        console.log('✅ [EDIT] Thunk réussi, robot mis à jour:', result.payload);
        
        // Success haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Show success message
        Alert.alert(
          'Succès !',
          `Le robot "${data.name}" a été mis à jour avec succès.`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.back();
              }
            }
          ]
        );
        
        return { success: true };
      } else if (saveRobotAsync.rejected.match(result)) {
        console.error('❌ [EDIT] Thunk rejeté:', result);
        // Le payload contient le message d'erreur personnalisé du rejectWithValue
        const errorMessage = (result.payload as string) || result.error?.message || 'Erreur lors de la mise à jour';
        return { success: false, error: errorMessage };
      } else {
        console.error('❌ [EDIT] État inattendu du thunk:', result);
        return { success: false, error: 'État inattendu lors de la mise à jour' };
      }
    } catch (err) {
      // Fallback vers le reducer synchrone en cas d'erreur
      try {
        dispatch(updateRobot({ 
          id: robot.id, 
          changes: data 
        }));
        
        if (error) {
          return { success: false, error };
        }
        
        router.back();
        return { success: true };
      } catch (syncError) {
        return { 
          success: false, 
          error: 'Erreur lors de la mise à jour du robot' 
        };
      }
    }
  };

  if (!robot) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Le robot demandé n'a pas été trouvé.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RobotFormRTK
        mode="edit"
        initialValues={robot}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});
