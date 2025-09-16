import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

const LAST_ROUTE_KEY = 'lastRoute';

/**
 * Hook pour sauvegarder automatiquement la route courante
 */
export function useRoutePersistence() {
  const pathname = usePathname();

  useEffect(() => {
    const saveCurrentRoute = async () => {
      try {
        // Ne pas sauvegarder la route racine "/"
        if (pathname && pathname !== '/') {
          await AsyncStorage.setItem(LAST_ROUTE_KEY, pathname);
          console.log(`💾 Route sauvegardée automatiquement: ${pathname}`);
        }
      } catch (error) {
        console.log('❌ Erreur sauvegarde route:', error);
      }
    };

    saveCurrentRoute();
  }, [pathname]);
}

/**
 * Utilitaire pour récupérer la dernière route sauvegardée
 */
export async function getLastRoute(): Promise<string | null> {
  try {
    const route = await AsyncStorage.getItem(LAST_ROUTE_KEY);
    console.log('💾 Route récupérée du storage:', route);
    return route;
  } catch (error) {
    console.log('❌ Erreur récupération route:', error);
    return null;
  }
}

/**
 * Utilitaire pour effacer la route sauvegardée
 */
export async function clearSavedRoute(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LAST_ROUTE_KEY);
    console.log('💾 Route effacée du storage');
  } catch (error) {
    console.log('❌ Erreur effacement route:', error);
  }
}
