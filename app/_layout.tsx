import { Stack } from "expo-router";
import { useEffect } from "react";
import { DeepLinkHandler } from "../components/deep-link-handler";
import { useRoutePersistence } from "../hooks/use-route-persistence";

/**
 * Stack global :
 * - Header visible partout
 * - Retour automatique sauf sur Home
 * - Écrans d'auth sans header
 */
export default function RootLayout() {
  useRoutePersistence();

  useEffect(() => {
    // console.log("🏗️ RootLayout - UN SEUL LAYOUT pour toute l'app");
  }, []);

  return (
    <>
      <DeepLinkHandler />

      {/* Stack racine qui accueille les groupes (main) et (auth) */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
