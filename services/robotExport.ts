import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Robot } from '../types/robot';
import { RobotInput, robotRepo } from './robotRepo';

/**
 * Format d'export des robots
 */
interface RobotsExport {
  version: string;
  exportedAt: number;
  robots: Robot[];
}

/**
 * Exporte tous les robots vers un fichier JSON
 */
export async function exportRobots(): Promise<void> {
  try {
    // Récupérer tous les robots
    const robots = await robotRepo.getAll();

    if (robots.length === 0) {
      Alert.alert(
        'Aucun robot',
        'Il n\'y a aucun robot à exporter.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Créer l'objet d'export
    const exportData: RobotsExport = {
      version: '1.0',
      exportedAt: Date.now(),
      robots,
    };

    // Générer le nom de fichier avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `robots-export-${timestamp}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Écrire le fichier
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(exportData, null, 2)
    );

    // Vérifier si le partage est disponible
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      // Partager le fichier
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exporter les robots',
        UTI: 'public.json',
      });

      console.log(`[EXPORT] ${robots.length} robots exportés vers ${fileName}`);
    } else {
      Alert.alert(
        'Export réussi',
        `${robots.length} robots exportés vers:\n${fileUri}`,
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('[ERREUR] Export:', error);
    Alert.alert(
      'Erreur d\'export',
      'Une erreur est survenue lors de l\'export des robots.',
      [{ text: 'OK' }]
    );
    throw error;
  }
}

/**
 * Importe des robots depuis un fichier JSON
 */
export async function importRobots(fileUri: string): Promise<number> {
  try {
    // Lire le fichier
    const content = await FileSystem.readAsStringAsync(fileUri);

    // Parser le JSON
    const data = JSON.parse(content) as RobotsExport;

    // Valider le format
    if (!data.robots || !Array.isArray(data.robots)) {
      throw new Error('Format de fichier invalide');
    }

    // Préparer les robots pour l'import (sans id ni timestamps)
    const robotsToImport: RobotInput[] = data.robots.map((robot) => ({
      name: robot.name,
      label: robot.label,
      year: robot.year,
      type: robot.type,
    }));

    // Importer les robots
    const count = await robotRepo.importRobots(robotsToImport);

    Alert.alert(
      'Import réussi',
      `${count} robot${count > 1 ? 's' : ''} importé${count > 1 ? 's' : ''} avec succès.`,
      [{ text: 'OK' }]
    );

    console.log(`[IMPORT] ${count} robots importés`);
    return count;
  } catch (error) {
    console.error('[ERREUR] Import:', error);
    Alert.alert(
      'Erreur d\'import',
      'Une erreur est survenue lors de l\'import des robots. Vérifiez le format du fichier.',
      [{ text: 'OK' }]
    );
    throw error;
  }
}

/**
 * Ouvre un sélecteur de fichier et importe les robots
 */
export async function pickAndImportRobots(): Promise<number | null> {
  try {
    // Ouvrir le sélecteur de fichiers
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    // Vérifier si l'utilisateur a annulé
    if (result.canceled) {
      console.log('Import annulé par l\'utilisateur');
      return null;
    }

    // Récupérer le premier fichier
    const file = result.assets[0];
    if (!file || !file.uri) {
      throw new Error('Aucun fichier sélectionné');
    }

    console.log('[IMPORT] Fichier sélectionné:', file.name);

    // Importer depuis le fichier
    const count = await importRobots(file.uri);
    return count;
  } catch (error) {
    console.error('[ERREUR] Sélection/import:', error);
    Alert.alert(
      'Erreur',
      'Une erreur est survenue lors de la sélection du fichier.',
      [{ text: 'OK' }]
    );
    throw error;
  }
}

/**
 * Importe des robots depuis le presse-papiers (JSON)
 */
export async function importFromClipboard(jsonString: string): Promise<number> {
  try {
    // Parser le JSON
    const data = JSON.parse(jsonString) as RobotsExport | Robot[];

    // Gérer les deux formats possibles
    let robots: Robot[];
    if (Array.isArray(data)) {
      robots = data;
    } else if (data.robots && Array.isArray(data.robots)) {
      robots = data.robots;
    } else {
      throw new Error('Format JSON invalide');
    }

    // Préparer les robots pour l'import
    const robotsToImport: RobotInput[] = robots.map((robot) => ({
      name: robot.name,
      label: robot.label,
      year: robot.year,
      type: robot.type,
    }));

    // Importer les robots
    const count = await robotRepo.importRobots(robotsToImport);

    Alert.alert(
      'Import réussi',
      `${count} robot${count > 1 ? 's' : ''} importé${count > 1 ? 's' : ''} avec succès.`,
      [{ text: 'OK' }]
    );

    return count;
  } catch (error) {
    console.error('[ERREUR] Import depuis presse-papiers:', error);
    Alert.alert(
      'Erreur d\'import',
      'Format JSON invalide. Vérifiez le contenu.',
      [{ text: 'OK' }]
    );
    throw error;
  }
}

/**
 * Obtient des statistiques sur les robots
 */
export async function getRobotsStats() {
  const robots = await robotRepo.getAll();
  const total = robots.length;
  const byType: Record<string, number> = {};
  const byYear: Record<number, number> = {};

  robots.forEach((robot) => {
    // Comptage par type
    byType[robot.type] = (byType[robot.type] || 0) + 1;

    // Comptage par année
    byYear[robot.year] = (byYear[robot.year] || 0) + 1;
  });

  return {
    total,
    byType,
    byYear,
    oldestYear: robots.length > 0 ? Math.min(...robots.map((r) => r.year)) : 0,
    newestYear: robots.length > 0 ? Math.max(...robots.map((r) => r.year)) : 0,
  };
}

