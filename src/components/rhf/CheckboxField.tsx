import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RegistrationFormValues } from '../../validation/zod-schema';

interface CheckboxFieldProps {
  name: keyof RegistrationFormValues;
  label: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label }) => {
  const { control, formState: { errors } } = useFormContext<RegistrationFormValues>();
  const error = errors[name];

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => onChange(!value)}
          >
            <View style={[
              styles.checkbox,
              value && styles.checkboxChecked,
              error && styles.checkboxError
            ]}>
              {value && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        )}
      />
      {error && (
        <Text style={styles.errorText}>{error.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxError: {
    borderColor: '#ef4444',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 32,
  },
});
