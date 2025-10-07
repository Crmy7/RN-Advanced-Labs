import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Robot } from '../../types/robot';
import { IconSymbol } from '../ui/icon-symbol';

interface RobotListItemDBProps {
  robot: Robot;
  onEdit: () => void;
  onDelete: () => void;
}

const typeIcons: Record<string, string> = {
  industrial: 'building.2.fill',
  service: 'cpu',
  medical: 'cross.case.fill',
  educational: 'book.fill',
  other: 'wrench.fill',
};

const typeColors: Record<string, string> = {
  industrial: '#f59e0b',
  service: '#3b82f6',
  medical: '#ef4444',
  educational: '#10b981',
  other: '#6b7280',
};

export default function RobotListItemDB({ robot, onEdit, onDelete }: RobotListItemDBProps) {
  const handleDelete = () => {
    Alert.alert(
      'Supprimer le robot',
      `Êtes-vous sûr de vouloir supprimer "${robot.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  const typeColor = typeColors[robot.type] || '#6b7280';
  const isArchived = robot.archived === 1;

  return (
    <View style={[styles.container, isArchived && styles.containerArchived]}>
      <View style={styles.content}>
        {/* Icône et informations */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              name={typeIcons[robot.type] || 'cpu'} 
              size={28} 
              color={typeColor}
            />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, isArchived && styles.archivedText]}>
              {robot.name}
            </Text>
            <Text style={[styles.label, isArchived && styles.archivedText]}>
              {robot.label}
            </Text>
            <View style={styles.metadata}>
              <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
                <Text style={styles.typeBadgeText}>{robot.type}</Text>
              </View>
              <Text style={styles.year}>• {robot.year}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <IconSymbol name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <IconSymbol name="trash" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {isArchived && (
        <View style={styles.archivedBanner}>
          <IconSymbol name="shippingbox.fill" size={12} color="#9ca3af" />
          <Text style={styles.archivedBannerText}>Archivé</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerArchived: {
    backgroundColor: '#f3f4f6',
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  archivedText: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  year: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  archivedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  archivedBannerText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

