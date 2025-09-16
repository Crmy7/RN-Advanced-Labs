import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Linking } from "react-native";

/**
 * Gère les deep links entrants (expo go et schéma natif).
 * - Ignore l’URL racine Expo Go (exp://host:port) pour éviter une 2e redirection vers /home
 * - Ne navigue que si la cible est différente de la route courante
 */
export function DeepLinkHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const isHandlingRef = useRef(false);

  useEffect(() => {
    const setHandling = (v: boolean) => (isHandlingRef.current = v);

    const navigateIfNeeded = (target: string) => {
      // Normalise quelques cas
      const normalized =
        target === "/" || target === "" || target === "/home"
          ? "/(main)/home"
          : target.startsWith("/(main)") || target.startsWith("/(auth)")
          ? target
          : `/(main)${target.startsWith("/") ? target : `/${target}`}`;

      if (pathname === normalized) {
        // console.log("ℹ️ Déjà sur la bonne route → pas de navigation:", normalized);
        return;
      }
      // console.log("🔄 Navigation via deep link →", normalized);
      router.replace(normalized as any);
    };

    const parseToPath = (url: string): string | null => {
      try {
        // 1) Expo Go: exp://<host>:<port>[/path]
        if (url.startsWith("exp://")) {
          const match = url.match(/exp:\/\/[^/]+(.*)$/);
          const path = (match?.[1] || "").trim();

          // Si pas de chemin → c’est juste l’URL racine d’Expo Go, on ignore
          if (!path || path === "/") {
            // console.log("ℹ️ URL Expo Go racine détectée → on ignore");
            return null;
          }
          // S’assure de commencer par /
          return path.startsWith("/") ? path : `/${path}`;
        }

        // 2) Schéma natif: rnadvancedlabs://path
        if (url.startsWith("rnadvancedlabs://")) {
          const path = url.replace(/^rnadvancedlabs:\/\//, "").trim();
          return path ? (path.startsWith("/") ? path : `/${path}`) : "/";
        }

        // Autres schémas: on ignore
        // console.log("ℹ️ Schéma non géré →", url);
        return null;
      } catch (e) {
        console.log("❌ Erreur parse URL:", e);
        return null;
      }
    };

    const handleDeepLink = (url: string) => {
      if (isHandlingRef.current) return;
      setHandling(true);

      try {
        // console.log("🔗 URL à traiter:", url);
        const path = parseToPath(url);
        if (!path) {
          // Rien à faire (ex: exp://host:port sans chemin)
          return;
        }

        // Petit délai pour laisser le temps au layout/stack d’être prêt
        setTimeout(() => {
          try {
            if (path === "/tp1-profile-card") {
              navigateIfNeeded("/(main)/tp1-profile-card");
            } else if (path.startsWith("/detail/")) {
              navigateIfNeeded(`/(main)${path}`);
            } else if (path === "/home" || path === "/" || path === "") {
              navigateIfNeeded("/(main)/home");
            } else {
              // console.log("⚠️ Chemin non reconnu, fallback → /home :", path);
              navigateIfNeeded("/(main)/home");
            }
          } finally {
            setHandling(false);
          }
        }, 300);
      } catch (e) {
        console.log("❌ Erreur handleDeepLink:", e);
        setHandling(false);
      }
    };

    const handleInitialURL = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          // console.log("🔗 Deep link initial détecté:", initialURL);
          handleDeepLink(initialURL);
        }
      } catch (error) {
        console.log("❌ Erreur récupération URL initiale:", error);
      }
    };

    const subscription = Linking.addEventListener("url", (event) => {
      // console.log("🔗 Deep link reçu (event):", event.url);
      handleDeepLink(event.url);
    });

    // Laisse le temps au Router de se monter avant d’analyser l’URL initiale
    const timer = setTimeout(handleInitialURL, 600);

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, [router, pathname]);

  return null;
}
