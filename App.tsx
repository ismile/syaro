/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import themeConfig from './src/configs/theme';
import BooruNavigator from './src/modules/booru/BooruNavigator';

export default class App extends Component {
  render() {
    return (
      <PaperProvider theme={themeConfig}>
      <BooruNavigator />
      </PaperProvider>
    );
  }
}
