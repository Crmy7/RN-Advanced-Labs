import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useEffect } from "react";
import 'react-native-get-random-values';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { DeepLinkHandler } from "../components/deep-link-handler";
import { useRoutePersistence } from "../hooks/use-route-persistence";
import { queryClient } from "../lib/queryClient";
import { persistor, store } from "./_store";

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
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DeepLinkHandler />

          {/* Stack racine qui accueille les groupes (main) et (auth) */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
