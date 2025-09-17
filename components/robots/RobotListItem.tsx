import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Robot } from '../../validation/robotSchema';
import { robotTypeOptions } from '../../validation/robotSchema';

interface RobotListItemProps {
  robot: Robot;
  onDelete: (id: string) => void;
}

export default function RobotListItem({ robot, onDelete }: RobotListItemProps) {
  const router = useRouter();

  const getTypeLabel = (type: string) => {
    const option = robotTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  const handleEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/tp4-robots/edit/${robot.id}` as any);
  };

  const handleDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Supprimer le robot',
      `Êtes-vous sûr de vouloir supprimer "${robot.name}" ?\n\nCette action est irréversible.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete(robot.id);
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'industrial':
        return 'construct-outline';
      case 'service':
        return 'people-outline';
      case 'medical':
        return 'medical-outline';
      case 'educational':
        return 'school-outline';
      default:
        return 'hardware-chip-outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'industrial':
        return '#f59e0b';
      case 'service':
        return '#3b82f6';
      case 'medical':
        return '#ef4444';
      case 'educational':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Robot Info */}
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.name}>{robot.name}</Text>
            <View style={[
              styles.typeBadge,
              { backgroundColor: `${getTypeColor(robot.type)}20` }
            ]}>
              <Ionicons
                name={getTypeIcon(robot.type) as any}
                size={14}
                color={getTypeColor(robot.type)}
                style={styles.typeIcon}
              />
              <Text style={[styles.typeText, { color: getTypeColor(robot.type) }]}>
                {getTypeLabel(robot.type)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.label} numberOfLines={2}>
            {robot.label}
          </Text>
          
          <View style={styles.footer}>
            <Text style={styles.year}>Année: {robot.year}</Text>
            <Text style={styles.dates}>
              Créé le {robot.createdAt.toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
            accessibilityLabel={`Modifier ${robot.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            accessibilityLabel={`Supprimer ${robot.name}`}
            accessibilityRole="button"
          >
            <Ionicons name="trash" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dates: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#dbeafe',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
});
