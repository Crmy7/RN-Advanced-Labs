import { Stack } from 'expo-router';

export default function TP3FormsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
      headerBackButtonDisplayMode: "minimal",
      gestureEnabled: true,
    }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Formulaires avancés',
          headerLeft: () => null, // Pas de bouton retour car accessible depuis les tabs
        }} 
      />
      <Stack.Screen 
        name="formik/index" 
        options={{ 
          title: 'Formik + Yup',
        }} 
      />
      <Stack.Screen 
        name="rhf/index" 
        options={{ 
          title: 'RHF + Zod',
        }} 
      />
    </Stack>
  );
}
