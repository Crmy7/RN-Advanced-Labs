import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

const LAST_ROUTE_KEY = 'lastRoute';
const NAVIGATION_STACK_KEY = 'navigationStack';

/**
 * Hook pour sauvegarder automatiquement la route courante et construire la stack de navigation
 */
export function useRoutePersistence() {
  const pathname = usePathname();

  useEffect(() => {
    const saveCurrentRoute = async () => {
      try {
        // Ne pas sauvegarder la route racine "/"
        if (pathname && pathname !== '/') {
          await AsyncStorage.setItem(LAST_ROUTE_KEY, pathname);
          
          // Construire et sauvegarder la stack de navigation logique
          const navigationStack = buildNavigationStack(pathname);
          await AsyncStorage.setItem(NAVIGATION_STACK_KEY, JSON.stringify(navigationStack));
          
          // console.log(`💾 Route sauvegardée automatiquement: ${pathname}`);
          // console.log(`📚 Stack de navigation: ${JSON.stringify(navigationStack)}`);
        }
      } catch (error) {
        console.log('❌ Erreur sauvegarde route:', error);
      }
    };

    saveCurrentRoute();
  }, [pathname]);
}

/**
 * Construit une stack de navigation logique basée sur la route actuelle
 */
function buildNavigationStack(pathname: string): string[] {
  const stack: string[] = [];
  
  // Toujours commencer par l'accueil
  stack.push('/(main)/(tabs)/home');
  
  // Analyser le chemin pour construire la stack logique
  if (pathname.includes('/tp3-forms')) {
    // Si on est dans tp3-forms, ajouter l'index des formulaires
    stack.push('/(main)/(tabs)/tp3-forms');
    
    // Si on est sur un formulaire spécifique, l'ajouter
    if (pathname.includes('/formik')) {
      stack.push('/(main)/(tabs)/tp3-forms/formik');
    } else if (pathname.includes('/rhf')) {
      stack.push('/(main)/(tabs)/tp3-forms/rhf');
    }
  } else if (pathname.includes('/detail/')) {
    // Pour les détails, venir de l'accueil
    stack.push(pathname);
  } else if (pathname !== '/(main)/(tabs)/home') {
    // Pour les autres routes, les ajouter directement
    stack.push(pathname);
  }
  
  return stack;
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
 * Utilitaire pour récupérer la stack de navigation sauvegardée
 */
export async function getNavigationStack(): Promise<string[] | null> {
  try {
    const stackJson = await AsyncStorage.getItem(NAVIGATION_STACK_KEY);
    if (stackJson) {
      const stack = JSON.parse(stackJson) as string[];
      console.log('📚 Stack de navigation récupérée:', stack);
      return stack;
    }
    return null;
  } catch (error) {
    console.log('❌ Erreur récupération stack de navigation:', error);
    return null;
  }
}

/**
 * Utilitaire pour effacer la route sauvegardée
 */
export async function clearSavedRoute(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LAST_ROUTE_KEY);
    await AsyncStorage.removeItem(NAVIGATION_STACK_KEY);
    console.log('💾 Route et stack effacées du storage');
  } catch (error) {
    console.log('❌ Erreur effacement route:', error);
  }
}
