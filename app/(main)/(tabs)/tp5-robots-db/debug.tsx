import { Stack } from 'expo-router';
import React from 'react';
import { DbDebugPanel } from '../../../../components/DbDebugPanel';

export default function DebugScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Debug DB',
          headerShown: true,
        }}
      />
      <DbDebugPanel />
    </>
  );
}

