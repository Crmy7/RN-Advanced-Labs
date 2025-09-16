import { Alert, Linking } from 'react-native';

/**
 * Utilitaires pour générer et partager des deep links
 */
export class DeepLinkUtils {
  private static baseScheme = 'rnadvancedlabs://';
  private static webBase = 'https://app.votre-domaine.com';
  private static expoGoBase = 'exp://10.25.128.212:8081';

  /**
   * Génère un deep link pour un écran donné
   */
  static generateLink(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseScheme}${cleanPath}`;
  }

  /**
   * Génère un lien web pour un écran donné
   */
  static generateWebLink(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.webBase}${cleanPath}`;
  }

  /**
   * Génère un lien Expo Go pour un écran donné
   */
  static generateExpoGoLink(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.expoGoBase}${cleanPath}`;
  }

  /**
   * Ouvre un deep link
   */
  static async openLink(url: string): Promise<boolean> {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return true;
      } else {
        console.log('❌ URL non supportée:', url);
        return false;
      }
    } catch (error) {
      console.log('❌ Erreur ouverture URL:', error);
      return false;
    }
  }

  /**
   * Partage un deep link via le système de partage natif
   */
  static async shareLink(path: string, title?: string): Promise<void> {
    try {
      const deepLink = this.generateLink(path);
      const webLink = this.generateWebLink(path);
      
      // Import dynamique pour éviter les erreurs sur web
      const { Share } = await import('react-native');
      
      await Share.share({
        message: `${title || 'Découvrez cette page'}\n\nApp: ${deepLink}\nWeb: ${webLink}`,
        url: deepLink,
        title: title || 'Partager'
      });
    } catch (error) {
      console.log('❌ Erreur partage:', error);
      Alert.alert('Erreur', 'Impossible de partager le lien');
    }
  }

  /**
   * Exemples de liens pour votre application
   */
  static getExampleLinks() {
    return {
      home: {
        deep: this.generateLink('/'),
        web: this.generateWebLink('/'),
        expo: this.generateExpoGoLink('/')
      },
      profile: {
        deep: this.generateLink('/tp1-profile-card'),
        web: this.generateWebLink('/tp1-profile-card'),
        expo: this.generateExpoGoLink('/tp1-profile-card')
      },
      detail: {
        deep: this.generateLink('/detail/42'),
        web: this.generateWebLink('/detail/42'),
        expo: this.generateExpoGoLink('/detail/42')
      }
    };
  }

  /**
   * Teste si l'application peut gérer un deep link
   */
  static async testDeepLink(url: string): Promise<void> {
    console.log('🧪 Test du deep link:', url);
    const success = await this.openLink(url);
    if (success) {
      console.log('✅ Deep link testé avec succès');
    } else {
      console.log('❌ Échec du test de deep link');
      Alert.alert('Test échoué', `Impossible d'ouvrir: ${url}`);
    }
  }
}
