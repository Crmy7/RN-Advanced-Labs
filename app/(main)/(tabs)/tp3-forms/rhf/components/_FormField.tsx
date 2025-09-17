import React, { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import type { RegistrationFormValues } from '../validation/_schema';

interface FormFieldProps extends TextInputProps {
  name: keyof RegistrationFormValues;
  label: string;
  nextFieldRef?: React.RefObject<TextInput | null>;
}

const FormField = React.forwardRef<TextInput, FormFieldProps>(({ 
  name, 
  label, 
  nextFieldRef,
  ...textInputProps 
}, ref) => {
  // 📊 Instrumentation : Log des re-rendus par champ
  const renderCount = useRef(0);
  renderCount.current += 1;
  // console.log(`⚡ [RHF] FormField "${name}" - Rendu #${renderCount.current}`);

  const { control, formState: { errors } } = useFormContext<RegistrationFormValues>();
  const error = errors[name];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={ref}
            style={[
              styles.input,
              error && styles.inputError
            ]}
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            onSubmitEditing={() => {
              if (nextFieldRef?.current) {
                nextFieldRef.current.focus();
              }
            }}
            returnKeyType={nextFieldRef ? 'next' : 'done'}
            placeholderTextColor="#9ca3af"
            {...textInputProps}
          />
        )}
      />
      {error && (
        <Text style={styles.errorText}>{error.message}</Text>
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
