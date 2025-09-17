import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFormik } from 'formik';
import React, { useRef } from 'react';
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
import { Robot } from '../../types/robot';
import { RobotFormData, robotValidationSchema } from '../../validation/robotSchemaRTK';
import TypeSelectorRTK from './TypeSelectorRTK';

interface RobotFormRTKProps {
  initialValues?: Partial<Robot>;
  onSubmit: (data: RobotFormData) => Promise<{ success: boolean; error?: string }>;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export default function RobotFormRTK({ 
  initialValues, 
  onSubmit, 
  mode, 
  isLoading = false 
}: RobotFormRTKProps) {
  const labelRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const formik = useFormik<RobotFormData>({
    initialValues: {
      name: initialValues?.name || '',
      label: initialValues?.label || '',
      year: initialValues?.year || new Date().getFullYear(),
      type: initialValues?.type || 'industrial',
    },
    validationSchema: robotValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await onSubmit(values);
        
        if (result.success) {
          // Success is handled by the parent component
          if (mode === 'create') {
            resetForm(); // Reset form after successful creation
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
    },
  });

  const isSubmitDisabled = !formik.isValid || isLoading || (mode === 'edit' && !formik.dirty);

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
          <TextInput
            style={[
              styles.input,
              formik.touched.name && formik.errors.name && styles.inputError
            ]}
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            placeholder="Ex: R2-D2, WALL-E..."
            placeholderTextColor="#9ca3af"
            returnKeyType="next"
            onSubmitEditing={() => labelRef.current?.focus()}
            maxLength={50}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {formik.touched.name && formik.errors.name && (
            <Text style={styles.errorText}>{formik.errors.name}</Text>
          )}
        </View>

        {/* Label Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Libellé *</Text>
          <TextInput
            ref={labelRef}
            style={[
              styles.input,
              formik.touched.label && formik.errors.label && styles.inputError
            ]}
            value={formik.values.label}
            onChangeText={formik.handleChange('label')}
            onBlur={formik.handleBlur('label')}
            placeholder="Description courte du robot..."
            placeholderTextColor="#9ca3af"
            returnKeyType="next"
            onSubmitEditing={() => yearRef.current?.focus()}
            maxLength={100}
            autoCapitalize="sentences"
            multiline={false}
          />
          {formik.touched.label && formik.errors.label && (
            <Text style={styles.errorText}>{formik.errors.label}</Text>
          )}
        </View>

        {/* Year Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Année de création *</Text>
          <TextInput
            ref={yearRef}
            style={[
              styles.input,
              formik.touched.year && formik.errors.year && styles.inputError
            ]}
            value={formik.values.year?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseInt(text, 10);
              formik.setFieldValue('year', isNaN(numValue) ? undefined : numValue);
            }}
            onBlur={formik.handleBlur('year')}
            placeholder="Ex: 2020"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={4}
          />
          {formik.touched.year && formik.errors.year && (
            <Text style={styles.errorText}>{formik.errors.year}</Text>
          )}
        </View>

        {/* Type Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Type de robot *</Text>
          <TypeSelectorRTK
            value={formik.values.type}
            onChange={(value) => formik.setFieldValue('type', value)}
            hasError={!!(formik.touched.type && formik.errors.type)}
          />
          {formik.touched.type && formik.errors.type && (
            <Text style={styles.errorText}>{formik.errors.type}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.submitButtonDisabled
          ]}
          onPress={formik.handleSubmit}
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
