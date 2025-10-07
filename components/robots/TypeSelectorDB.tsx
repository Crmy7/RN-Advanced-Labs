import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RobotType } from '../../types/robot';
import { IconSymbol } from '../ui/icon-symbol';

interface TypeSelectorDBProps {
  value: RobotType;
  onChange: (type: RobotType) => void;
}

const robotTypes: Array<{ value: RobotType; label: string; icon: string }> = [
  { value: 'industrial', label: 'Industriel', icon: 'building.2.fill' },
  { value: 'service', label: 'Service', icon: 'cpu' },
  { value: 'medical', label: 'Médical', icon: 'cross.case.fill' },
  { value: 'educational', label: 'Éducatif', icon: 'book.fill' },
  { value: 'other', label: 'Autre', icon: 'wrench.fill' },
];

export default function TypeSelectorDB({ value, onChange }: TypeSelectorDBProps) {
  return (
    <View style={styles.container}>
      {robotTypes.map((type) => (
        <TouchableOpacity
          key={type.value}
          style={[
            styles.typeButton,
            value === type.value && styles.typeButtonActive,
          ]}
          onPress={() => onChange(type.value)}
        >
          <IconSymbol 
            name={type.icon} 
            size={16} 
            color={value === type.value ? '#3b82f6' : '#6b7280'}
          />
          <Text
            style={[
              styles.typeText,
              value === type.value && styles.typeTextActive,
            ]}
          >
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  typeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

