import React from 'react';
import { DefaultTheme, DarkTheme, Provider as PaperProvider, Theme } from 'react-native-paper';

const theme:Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  }
};

export default theme;
