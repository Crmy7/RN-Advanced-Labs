import { useField } from 'formik';
import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface FormFieldProps extends TextInputProps {
  name: string;
  label: string;
  nextFieldRef?: React.RefObject<TextInput | null>;
}

export const FormField = React.forwardRef<TextInput, FormFieldProps>(({ 
  name, 
  label, 
  nextFieldRef,
  ...textInputProps 
}, ref) => {
  // 📊 Instrumentation : Log des re-rendus par champ
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(`🔧 [Formik] FormField "${name}" - Rendu #${renderCount.current}`);

  const [field, meta, helpers] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          hasError && styles.inputError
        ]}
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        onSubmitEditing={() => {
          if (nextFieldRef?.current) {
            nextFieldRef.current.focus();
          }
        }}
        returnKeyType={nextFieldRef ? 'next' : 'done'}
        placeholderTextColor="#9ca3af"
        {...textInputProps}
      />
      {hasError && (
        <Text style={styles.errorText}>{meta.error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
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
});

export default FormField;
