/**
 * @format
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import themeConfig from './src/configs/theme';
import BooruNavigator from './src/modules/booru/BooruNavigator';
import theme from './src/configs/theme';

export default class App extends Component {
  render() {
    return (
      <PaperProvider theme={themeConfig}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
        <BooruNavigator />
      </PaperProvider>
    );
  }
}
