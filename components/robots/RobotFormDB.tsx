import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Yup from 'yup';
import { RobotInput } from '../../services/robotRepo';
import { RobotType } from '../../types/robot';
import TypeSelectorDB from './TypeSelectorDB';

interface RobotFormDBProps {
  initialValues?: Partial<RobotInput>;
  onSubmit: (values: RobotInput) => Promise<void>;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

const robotValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .required('Le nom est requis'),
  
  label: Yup.string()
    .min(3, 'Le libellé doit contenir au moins 3 caractères')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères')
    .required('Le libellé est requis'),
  
  year: Yup.number()
    .integer("L'année doit être un nombre entier")
    .min(1950, "L'année doit être supérieure ou égale à 1950")
    .max(new Date().getFullYear(), "L'année ne peut pas être future")
    .required("L'année est requise"),
  
  type: Yup.mixed<RobotType>()
    .oneOf(['industrial', 'service', 'medical', 'educational', 'other'])
    .required('Le type est requis'),
});

export default function RobotFormDB({
  initialValues,
  onSubmit,
  submitButtonText = 'Enregistrer',
  isSubmitting = false,
}: RobotFormDBProps) {
  const labelRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const defaultValues: RobotInput = {
    name: '',
    label: '',
    year: new Date().getFullYear(),
    type: 'service',
    ...initialValues,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={robotValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isValid, dirty }) => (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Nom */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={[styles.input, touched.name && errors.name && styles.inputError]}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Ex: R2-D2"
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
                onSubmitEditing={() => labelRef.current?.focus()}
                autoCapitalize="words"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Libellé */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Libellé *</Text>
              <TextInput
                ref={labelRef}
                style={[styles.input, touched.label && errors.label && styles.inputError]}
                value={values.label}
                onChangeText={handleChange('label')}
                onBlur={handleBlur('label')}
                placeholder="Ex: Robot astromécano"
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
                onSubmitEditing={() => yearRef.current?.focus()}
              />
              {touched.label && errors.label && (
                <Text style={styles.errorText}>{errors.label}</Text>
              )}
            </View>

            {/* Année */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Année *</Text>
              <TextInput
                ref={yearRef}
                style={[styles.input, touched.year && errors.year && styles.inputError]}
                value={values.year.toString()}
                onChangeText={(text) => {
                  const year = parseInt(text, 10);
                  setFieldValue('year', isNaN(year) ? '' : year);
                }}
                onBlur={handleBlur('year')}
                placeholder="Ex: 2024"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                returnKeyType="done"
              />
              {touched.year && errors.year && (
                <Text style={styles.errorText}>{errors.year}</Text>
              )}
            </View>

            {/* Type */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Type *</Text>
              <TypeSelectorDB
                value={values.type}
                onChange={(type) => setFieldValue('type', type)}
              />
              {touched.type && errors.type && (
                <Text style={styles.errorText}>{errors.type}</Text>
              )}
            </View>

            {/* Bouton de soumission */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isValid || !dirty || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={() => handleSubmit()}
              disabled={!isValid || !dirty || isSubmitting}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  (!isValid || !dirty || isSubmitting) && styles.submitButtonTextDisabled,
                ]}
              >
                {isSubmitting ? 'Enregistrement...' : submitButtonText}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 16,
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
    backgroundColor: '#fff',
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
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#9ca3af',
  },
});

