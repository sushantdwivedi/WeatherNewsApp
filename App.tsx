import React from 'react';
// import { AppProvider } from './src/context/AppProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppProvider';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}