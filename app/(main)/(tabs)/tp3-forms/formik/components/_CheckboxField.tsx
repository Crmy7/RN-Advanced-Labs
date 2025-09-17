import { Ionicons } from '@expo/vector-icons';
import { useField } from 'formik';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CheckboxFieldProps {
  name: string;
  label: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ name, label }) => {
  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={() => helpers.setValue(!field.value)}
      >
        <View style={[
          styles.checkbox,
          field.value && styles.checkboxChecked,
          hasError && styles.checkboxError
        ]}>
          {field.value && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      {hasError && (
        <Text style={styles.errorText}>{meta.error}</Text>
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

export default CheckboxField;
