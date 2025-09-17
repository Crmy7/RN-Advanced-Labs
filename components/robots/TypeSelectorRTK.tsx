import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { RobotType } from '../../types/robot';

interface TypeOption {
  value: RobotType;
  label: string;
  icon: string;
}

const robotTypeOptions: TypeOption[] = [
  { value: 'industrial', label: 'Industriel', icon: 'construct' },
  { value: 'service', label: 'Service', icon: 'people' },
  { value: 'medical', label: 'Médical', icon: 'medical' },
  { value: 'educational', label: 'Éducatif', icon: 'school' },
  { value: 'other', label: 'Autre', icon: 'help-circle' },
];

interface TypeSelectorRTKProps {
  value: RobotType;
  onChange: (value: RobotType) => void;
  hasError?: boolean;
}

export default function TypeSelectorRTK({ value, onChange, hasError }: TypeSelectorRTKProps) {
  const selectedOption = robotTypeOptions.find(opt => opt.value === value);
  
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', ...robotTypeOptions.map(opt => opt.label)],
          cancelButtonIndex: 0,
          title: 'Choisir le type de robot',
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedType = robotTypeOptions[buttonIndex - 1];
            onChange(selectedType.value);
          }
        }
      );
    } else {
      // Pour Android
      Alert.alert(
        'Type de robot',
        'Choisissez le type de robot',
        [
          ...robotTypeOptions.map(opt => ({
            text: opt.label,
            onPress: () => onChange(opt.value)
          })),
          { text: 'Annuler' }
        ]
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.typeSelector,
        hasError && styles.inputError
      ]}
      onPress={handlePress}
    >
      <Text style={[
        styles.typeSelectorText,
        !selectedOption && styles.placeholder
      ]}>
        {selectedOption ? selectedOption.label : 'Sélectionner un type...'}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#6b7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholder: {
    color: '#9ca3af',
  },
});
