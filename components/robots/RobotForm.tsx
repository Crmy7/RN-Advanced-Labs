import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import type { RobotInput } from '../../validation/robotSchema';
import { robotSchema } from '../../validation/robotSchema';
import TypeSelector from './TypeSelector';

interface RobotFormProps {
  initialValues?: Partial<RobotInput>;
  onSubmit: (data: RobotInput) => Promise<{ success: boolean; error?: string }>;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export default function RobotForm({ 
  initialValues, 
  onSubmit, 
  mode, 
  isLoading = false 
}: RobotFormProps) {
  const labelRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<RobotInput>({
    resolver: zodResolver(robotSchema),
    defaultValues: {
      name: initialValues?.name || '',
      label: initialValues?.label || '',
      year: initialValues?.year || new Date().getFullYear(),
      type: initialValues?.type || 'industrial',
    },
    mode: 'onChange',
  });

  const onSubmitForm = async (data: RobotInput) => {
    try {
      const result = await onSubmit(data);
      
      if (result.success) {
        // Success haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        if (mode === 'create') {
          reset(); // Reset form after successful creation
        }
      } else {
        // Error haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
        // Show error alert
        Alert.alert(
          'Erreur',
          result.error || 'Une erreur est survenue',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Erreur',
        'Une erreur inattendue est survenue',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const isSubmitDisabled = !isValid || isLoading || (mode === 'edit' && !isDirty);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nom du robot *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.name && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ex: R2-D2, WALL-E..."
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
                onSubmitEditing={() => labelRef.current?.focus()}
                maxLength={50}
                autoCapitalize="words"
                autoCorrect={false}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Label Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Libellé *</Text>
          <Controller
            control={control}
            name="label"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={labelRef}
                style={[
                  styles.input,
                  errors.label && styles.inputError
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Description courte du robot..."
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
                onSubmitEditing={() => yearRef.current?.focus()}
                maxLength={100}
                autoCapitalize="sentences"
                multiline={false}
              />
            )}
          />
          {errors.label && (
            <Text style={styles.errorText}>{errors.label.message}</Text>
          )}
        </View>

        {/* Year Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Année de création *</Text>
          <Controller
            control={control}
            name="year"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={yearRef}
                style={[
                  styles.input,
                  errors.year && styles.inputError
                ]}
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const numValue = parseInt(text, 10);
                  onChange(isNaN(numValue) ? undefined : numValue);
                }}
                onBlur={onBlur}
                placeholder="Ex: 2020"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={4}
              />
            )}
          />
          {errors.year && (
            <Text style={styles.errorText}>{errors.year.message}</Text>
          )}
        </View>

        {/* Type Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Type de robot *</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <TypeSelector
                value={value}
                onChange={onChange}
                hasError={!!errors.type}
              />
            )}
          />
          {errors.type && (
            <Text style={styles.errorText}>{errors.type.message}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit(onSubmitForm)}
          disabled={isSubmitDisabled}
        >
          <Ionicons
            name={mode === 'create' ? 'add-circle' : 'save'}
            size={20}
            color={isSubmitDisabled ? '#9ca3af' : '#ffffff'}
            style={styles.submitIcon}
          />
          <Text style={[
            styles.submitButtonText,
            isSubmitDisabled && styles.submitButtonTextDisabled
          ]}>
            {isLoading 
              ? 'En cours...' 
              : mode === 'create' 
                ? 'Créer le robot' 
                : 'Mettre à jour'
            }
          </Text>
        </TouchableOpacity>

        {/* Form Info */}
        <Text style={styles.infoText}>
          * Champs obligatoires
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#9ca3af',
  },
  infoText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
