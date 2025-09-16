import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getLastRoute } from "../hooks/use-route-persistence";

/**
 * Point d’entrée : choisit la route de départ.
 * - Si une dernière route existe, on y va
 * - Sinon on va vers /home
 * On renvoie null pendant le chargement pour éviter tout flash.
 */
export default function Index() {
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const saved = await getLastRoute();
      if (!mounted) return;

      // Fallback propre vers /home
      setTargetRoute(saved || "/(main)/home");
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!targetRoute) {
    // Évite d'afficher quoi que ce soit avant d'avoir la route cible
    return null;
  }

  return <Redirect href={targetRoute as any} />;
}
