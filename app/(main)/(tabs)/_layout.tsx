import { Tabs } from "expo-router";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#3b82f6",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          headerTitle: "RN Advanced Labs",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp1-profile-card"
        options={{
          title: "Profil",
          headerTitle: "Profile Card - TP1",
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp3-forms"
        options={{
          title: "Formulaires",
          headerShown: false, // Le stack gère les headers
          tabBarIcon: ({ color }) => (
            <IconSymbol name="doc.text.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp4-robots"
        options={{
          title: "Robots",
          headerShown: false, // Le stack gère les headers
          tabBarIcon: ({ color }) => (
            <IconSymbol name="gear.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
