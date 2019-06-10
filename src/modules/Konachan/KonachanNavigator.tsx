import React, {useState} from 'react';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import KonachanGallery from './KonachanGallery';
import KonachanSetting from './KonachanSetting';
import { createStackNavigator, createAppContainer } from "react-navigation";
import KonachanImage from './KonachanImage';
import Iconize, { CommunityIconize } from '../../components/iconize';

const GalleryNavigator = createStackNavigator({
  Home: {
    screen: KonachanGallery
  },
  Image: {
    screen: KonachanImage
  }
},{
  defaultNavigationOptions: {
    header: () => null,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }
});

export default GalleryNavigator;


// export default createMaterialBottomTabNavigator({
//   Gallery: {
//     screen: GalleryNavigator,
//     navigationOptions: {
//       tabBarColor : '#2962ff',
//       tabBarIcon  : CommunityIconize('folder-multiple-image')
//     }
//   },
//   Setting: {
//     screen: KonachanSetting,
//     navigationOptions: {
//       tabBarColor : '#00796b',
//       tabBarIcon  : Iconize('settings')
//     }
//   }
// }, {
//   shifting: true
// });
