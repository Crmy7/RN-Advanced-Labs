import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/_hooks';
import RobotFormRTK from '../../../components/robots/RobotFormRTK';
import { clearError, saveRobotAsync } from '../../../features/robots/robotsSlice';
import { selectRobotsError, selectRobotsLoading } from '../../../features/robots/selectors';
import { RobotFormData } from '../../../validation/robotSchemaRTK';

export default function CreateRobotScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const isLoading = useAppSelector(selectRobotsLoading);
  const error = useAppSelector(selectRobotsError);

  const handleSubmit = async (data: RobotFormData): Promise<{ success: boolean; error?: string }> => {
    console.log('🚀 [CREATE] Début de la création du robot:', data);
    
    try {
      // Nettoyer les erreurs précédentes
      dispatch(clearError());
      console.log('✅ [CREATE] Erreurs précédentes nettoyées');
      
      // Utiliser le thunk asynchrone
      console.log('🔄 [CREATE] Dispatch du thunk saveRobotAsync...');
      const result = await dispatch(saveRobotAsync({ 
        robot: data, 
        isUpdate: false 
      }));
      
      console.log('📦 [CREATE] Résultat du thunk:', result);
      
      if (saveRobotAsync.fulfilled.match(result)) {
        console.log('✅ [CREATE] Thunk réussi, robot créé:', result.payload);
        
        // Success haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Show success message
        Alert.alert(
          'Succès !',
          `Le robot "${data.name}" a été créé avec succès.`,
          [
            {
              text: 'Continuer',
              onPress: () => {
                // Le formulaire sera réinitialisé automatiquement
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
        
        return { success: true };
      } else if (saveRobotAsync.rejected.match(result)) {
        console.error('❌ [CREATE] Thunk rejeté:', result);
        // Le payload contient le message d'erreur personnalisé du rejectWithValue
        const errorMessage = (result.payload as string) || result.error?.message || 'Erreur lors de la création';
        return { success: false, error: errorMessage };
      } else {
        console.error('❌ [CREATE] État inattendu du thunk:', result);
        return { success: false, error: 'État inattendu lors de la création' };
      }
    } catch (err) {
      console.error('💥 [CREATE] Exception attrapée:', err);
      return { 
        success: false, 
        error: 'Erreur lors de la création du robot' 
      };
    }
  };

  return (
    <View style={styles.container}>
      <RobotFormRTK
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
