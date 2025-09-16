import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

/**
 * Composant pour gérer les deep links entrants
 */
export function DeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    let isHandlingLink = false;

    // Gérer les liens lors du lancement de l'app
    const handleInitialURL = async () => {
      if (isHandlingLink) return;
      
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          console.log('🔗 Deep link initial détecté:', initialURL);
          handleDeepLink(initialURL);
        }
      } catch (error) {
        console.log('❌ Erreur récupération URL initiale:', error);
      }
    };

    // Gérer les liens lorsque l'app est déjà ouverte
    const handleURL = (event: { url: string }) => {
      if (isHandlingLink) return;
      
      console.log('🔗 Deep link reçu:', event.url);
      handleDeepLink(event.url);
    };

    // Parser et router vers la bonne page
    const handleDeepLink = (url: string) => {
      if (isHandlingLink) return;
      isHandlingLink = true;
      
      try {
        console.log('🔗 URL à traiter:', url);
        
        let path = '';
        
        // Gérer les différents formats d'URL
        if (url.includes('exp://')) {
          // Format Expo Go: exp://10.25.128.212:8081/tp1-profile-card
          const match = url.match(/exp:\/\/[^\/]+(.*)$/);
          path = match ? match[1] : '';
        } else if (url.startsWith('rnadvancedlabs://')) {
          // Format schéma personnalisé: rnadvancedlabs://tp1-profile-card
          path = url.replace(/^rnadvancedlabs:\/\//, '');
        }
        
        // S'assurer que le path commence par /
        if (path && !path.startsWith('/')) {
          path = '/' + path;
        }
        
        console.log('🎯 Chemin extrait:', path);
        
        // Délai pour laisser le temps à l'app de se charger
        setTimeout(() => {
          try {
            // Router vers le bon écran
            if (path === '/tp1-profile-card') {
              console.log('🔄 Navigation vers profile card');
              router.replace('/(main)/tp1-profile-card');
            } else if (path.startsWith('/detail/')) {
              const fullPath = `/(main)${path}`;
              console.log('🔄 Navigation vers détail:', fullPath);
              router.replace(fullPath as any);
            } else if (path === '/home' || path === '/' || path === '') {
              console.log('🔄 Navigation vers home');
              router.replace('/(main)/home');
            } else {
              console.log('⚠️ Chemin non reconnu:', path, '- redirection vers home');
              router.replace('/(main)/home');
            }
          } catch (navError) {
            console.log('❌ Erreur navigation:', navError);
            router.replace('/(main)/home');
          } finally {
            isHandlingLink = false;
          }
        }, 500);
        
      } catch (error) {
        console.log('❌ Erreur parsing deep link:', error);
        router.replace('/(main)/home');
        isHandlingLink = false;
      }
    };

    // Écouter les événements
    const subscription = Linking.addEventListener('url', handleURL);
    
    // Délai pour s'assurer que l'app est prête
    const timer = setTimeout(() => {
      handleInitialURL();
    }, 1000);

    // Cleanup
    return () => {
      subscription?.remove();
      clearTimeout(timer);
    };
  }, [router]);

  return null; // Composant invisible
}
