import { Stack } from 'expo-router';

/**
 * Layout pour la section TP6-camera
 * Gère la navigation entre galerie, caméra et détail
 */
export default function TP6CameraLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Les écrans gèrent leurs propres headers
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Galerie Photos',
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          title: 'Caméra',
          presentation: 'card',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: 'Détail Photo',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
