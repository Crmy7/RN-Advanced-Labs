import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Les tabs gèrent leur propre header
        }}
      />
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: "Détail",
          presentation: "card",
        }}
      />

      {/* 👉 Zustand robots */}
      <Stack.Screen
        name="tp4-robots/index"
        options={{ title: "Robots Zustand" }}
      />
      <Stack.Screen
        name="tp4-robots/create"
        options={{ title: "Nouveau robot", presentation: "card" }}
      />
      <Stack.Screen
        name="tp4-robots/edit/[id]"
        options={{ title: "Modifier le robot", presentation: "card" }}
      />

      {/* 👉 Redux robots */}
      <Stack.Screen
        name="tp4b-robots-rtk/index"
        options={{ title: "Robots Redux" }}
      />
      <Stack.Screen
        name="tp4b-robots-rtk/create"
        options={{ title: "Créer un robot", presentation: "card" }}
      />
      <Stack.Screen
        name="tp4b-robots-rtk/edit/[id]"
        options={{ title: "Modifier le robot", presentation: "card" }}
      />
    </Stack>
  );
}
