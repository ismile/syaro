import React from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import KonachanNavigator from './modules/Konachan/KonachanNavigator';

const AppNavigator = createDrawerNavigator({
  Konachan: {
    screen: KonachanNavigator
  }
});

  export default createAppContainer(AppNavigator);
