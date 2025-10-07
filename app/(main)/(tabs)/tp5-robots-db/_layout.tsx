import { Stack } from 'expo-router';
import React from 'react';

export default function TP5RobotsDBLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: 'minimal',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Robots SQLite',
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Créer un robot',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Modifier un robot',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}

