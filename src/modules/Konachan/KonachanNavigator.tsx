import React, {useState} from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import KonachanGallery from './KonachanGallery';
import KonachanSetting from './KonachanSetting';

export default createMaterialBottomTabNavigator({
  Gallery: {
    screen: KonachanGallery
  },
  Setting: {
    screen: KonachanSetting
  }
}, {
  shifting: true
});
