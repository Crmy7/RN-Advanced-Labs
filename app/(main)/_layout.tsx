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
    </Stack>
  );
}
