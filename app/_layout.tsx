import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { DeepLinkHandler } from "../components/deep-link-handler";
import { useRoutePersistence } from "../hooks/use-route-persistence";

/**
 * Layout racine UNIQUE de l'application
 * Gère directement la navigation par onglets
 * Groupes (main) et (auth) distincts SANS leurs propres layouts
 * Seuls Accueil et Profile Card visibles dans les onglets
 */
export default function RootLayout() {
  useRoutePersistence();

  useEffect(() => {
    console.log("🏗️ RootLayout - Layout racine unique avec groupes distincts");
  }, []);

  return (
    <>
      <DeepLinkHandler />
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3b82f6",
          tabBarInactiveTintColor: "#6b7280", 
          headerShown: true,
          tabBarStyle: {
            paddingBottom: 8,
            height: 88,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        {/* GROUPE (main) - 2 ONGLETS VISIBLES */}
        
        <Tabs.Screen
          name="(main)/home"
          options={{
            title: "Accueil",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
              />
            ),
            headerTitle: "RN Advanced Labs",
          }}
        />
        
        <Tabs.Screen
          name="(main)/tp1-profile-card"
          options={{
            title: "Profile Card", 
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={24} 
                color={color} 
              />
            ),
            headerTitle: "Profile Card - TP1",
          }}
        />
        
        {/* TOUS LES AUTRES ÉCRANS MASQUÉS */}
        <Tabs.Screen
          name="index"
          options={{
            href: null, // Masquer index des onglets
          }}
        />
        
        <Tabs.Screen
          name="(main)/detail/[id]"
          options={{
            href: null, // Masquer détail des onglets
            headerTitle: "Détail",
          }}
        />
        
        <Tabs.Screen
          name="(auth)/login"
          options={{
            href: null, // Masquer login des onglets
            headerShown: false,
          }}
        />
        
        <Tabs.Screen
          name="(auth)/register"
          options={{
            href: null, // Masquer register des onglets
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
