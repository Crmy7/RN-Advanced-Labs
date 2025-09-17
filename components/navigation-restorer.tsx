import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getLastRoute, getNavigationStack } from '../hooks/use-route-persistence';

interface NavigationRestorerProps {
  children: React.ReactNode;
}

/**
 * Composant qui restaure la navigation avec la stack complète
 * au lieu d'une simple redirection
 */
export function NavigationRestorer({ children }: NavigationRestorerProps) {
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreNavigation = async () => {
      try {
        const lastRoute = await getLastRoute();
        const navigationStack = await getNavigationStack();

        if (lastRoute && navigationStack && navigationStack.length > 1) {
          console.log('🔄 Restauration de la navigation avec stack...');
          console.log('📚 Stack complète:', navigationStack);
          
          // Pour les formulaires, utiliser une approche simplifiée
          if (lastRoute.includes('/tp3-forms/')) {
            // D'abord aller à l'index des formulaires
            router.replace('/(main)/(tabs)/tp3-forms' as any);
            
            // Puis naviguer vers le formulaire spécifique après un délai
            setTimeout(() => {
              router.push(lastRoute as any);
            }, 100);
          } else {
            // Pour les autres routes, navigation séquentielle
            for (let i = 0; i < navigationStack.length - 1; i++) {
              const route = navigationStack[i];
              console.log(`📍 Navigation vers: ${route}`);
              
              if (i === 0) {
                router.replace(route as any);
              } else {
                router.push(route as any);
              }
              
              await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            const finalRoute = navigationStack[navigationStack.length - 1];
            console.log(`🎯 Navigation finale vers: ${finalRoute}`);
            router.push(finalRoute as any);
          }
          
        } else if (lastRoute) {
          // Fallback : navigation simple si pas de stack
          console.log('🔄 Navigation simple vers:', lastRoute);
          router.replace(lastRoute as any);
        } else {
          // Aucune route sauvegardée : aller à l'accueil
          console.log('🏠 Aucune route sauvegardée, navigation vers l\'accueil');
          router.replace('/(main)/(tabs)/home' as any);
        }
      } catch (error) {
        console.log('❌ Erreur lors de la restauration de navigation:', error);
        router.replace('/(main)/(tabs)/home' as any);
      } finally {
        setIsRestoring(false);
      }
    };

    // Délai pour laisser le temps à l'app de se monter
    const timer = setTimeout(restoreNavigation, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  // Afficher les enfants seulement après la restauration
  if (isRestoring) {
    return null;
  }

  return <>{children}</>;
}
