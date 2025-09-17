import { Stack } from 'expo-router';

export default function TP4RobotsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
      headerBackButtonDisplayMode: "minimal",
      gestureEnabled: true,
      headerStyle: {
        backgroundColor: '#f9fafb',
      },
      headerTintColor: '#111827',
      headerTitleStyle: {
        fontWeight: '700',
      },
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Robots',
          headerLeft: () => null, // Pas de bouton retour car accessible depuis les tabs
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Nouveau robot',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="edit/[id]" 
        options={{ 
          title: 'Modifier le robot',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
