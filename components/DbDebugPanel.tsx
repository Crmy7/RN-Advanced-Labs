import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resetDatabase } from '../db';
import { checkDbIntegrity, DbDebugInfo, getDbDebugInfo } from '../utils/dbDebug';
import { IconSymbol } from './ui/icon-symbol';

interface IntegrityCheck {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function DbDebugPanel() {
  const [info, setInfo] = useState<DbDebugInfo | null>(null);
  const [integrity, setIntegrity] = useState<IntegrityCheck | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDebugInfo = async () => {
    setLoading(true);
    try {
      const [dbInfo, integrityCheck] = await Promise.all([
        getDbDebugInfo(),
        checkDbIntegrity(),
      ]);
      setInfo(dbInfo);
      setIntegrity(integrityCheck);
    } catch (error) {
      console.error('Erreur lors du chargement des infos debug:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const handleReset = () => {
    Alert.alert(
      'Réinitialiser la base de données ?',
      'Toutes les données seront supprimées définitivement. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetDatabase();
              await loadDebugInfo();
              Alert.alert('Succès', 'Base de données réinitialisée');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser la base de données');
            }
          },
        },
      ]
    );
  };

  if (loading || !info || !integrity) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Debug Base de Données</Text>
      </View>

      {/* Infos générales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations générales</Text>
        <InfoRow label="Version" value={`v${info.version}`} />
        <InfoRow label="Nombre de robots" value={info.robotCount.toString()} />
        <View style={styles.row}>
          <Text style={styles.label}>Colonne archived:</Text>
          <View style={styles.iconValueRow}>
            <IconSymbol
              name={info.hasArchivedColumn ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
              size={16}
              color={info.hasArchivedColumn ? '#10b981' : '#ef4444'}
            />
            <Text style={[styles.value, { marginLeft: 6 }]}>
              {info.hasArchivedColumn ? 'Présente' : 'Absente'}
            </Text>
          </View>
        </View>
      </View>

      {/* Index */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Index ({info.indexes.length})</Text>
        {info.indexes.length === 0 ? (
          <Text style={styles.emptyText}>Aucun index</Text>
        ) : (
          info.indexes.map((idx) => (
            <Text key={idx} style={styles.listItem}>
              • {idx}
            </Text>
          ))
        )}
      </View>

      {/* Structure */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Structure ({info.tableInfo.length} colonnes)</Text>
        {info.tableInfo.map((col) => (
          <View key={col.name} style={styles.row}>
            <Text style={styles.columnName}>{col.name}</Text>
            <Text style={styles.columnType}>{col.type}</Text>
          </View>
        ))}
      </View>

      {/* Intégrité */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vérification d'intégrité</Text>
        <View style={[styles.statusBadge, integrity.isValid ? styles.statusOk : styles.statusError]}>
          <IconSymbol
            name={integrity.isValid ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
            size={20}
            color={integrity.isValid ? '#10b981' : '#ef4444'}
          />
          <Text style={[styles.statusText, { marginLeft: 8 }]}>
            {integrity.isValid ? 'OK' : 'ERREURS'}
          </Text>
        </View>

        {integrity.errors.length > 0 && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorTitle}>Erreurs :</Text>
            {integrity.errors.map((err, idx) => (
              <View key={idx} style={styles.messageRow}>
                <IconSymbol name="xmark.circle.fill" size={14} color="#dc2626" />
                <Text style={[styles.errorText, { marginLeft: 6 }]}>{err}</Text>
              </View>
            ))}
          </View>
        )}

        {integrity.warnings.length > 0 && (
          <View style={styles.messageContainer}>
            <Text style={styles.warningTitle}>Avertissements :</Text>
            {integrity.warnings.map((warn, idx) => (
              <View key={idx} style={styles.messageRow}>
                <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#f59e0b" />
                <Text style={[styles.warningText, { marginLeft: 6 }]}>{warn}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadDebugInfo}>
          <IconSymbol name="arrow.clockwise" size={18} color="#fff" />
          <Text style={[styles.refreshButtonText, { marginLeft: 8 }]}>Rafraîchir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <IconSymbol name="trash.fill" size={18} color="#fff" />
          <Text style={[styles.resetButtonText, { marginLeft: 8 }]}>Réinitialiser la DB</Text>
        </TouchableOpacity>

        <View style={styles.warningRow}>
          <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#f59e0b" />
          <Text style={[styles.warning, { marginLeft: 6 }]}>
            La réinitialisation supprime TOUTES les données
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  listItem: {
    fontSize: 14,
    color: '#374151',
    paddingVertical: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  columnName: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    fontFamily: 'monospace',
  },
  columnType: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  statusBadge: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusOk: {
    backgroundColor: '#d1fae5',
  },
  statusError: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  messageContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#f59e0b',
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warning: {
    fontSize: 12,
    color: '#f59e0b',
    flex: 1,
  },
});

