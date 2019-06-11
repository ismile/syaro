import React, {useState} from 'react';

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import BooruGallery from './BooruGallery';
import BooruSetting from './BooruSetting';
import { createStackNavigator, createAppContainer } from "react-navigation";
import BooruImage from './BooruImage';
import Iconize, { CommunityIconize } from '../../components/iconize';
import BooruInfo from './BooruInfo';
import BooruMenu from './BooruMenu';

const BooruNavigator = createStackNavigator({
  Gallery: {
    screen: BooruGallery
  },
  Image: {
    screen: BooruImage
  },
  Info: {
    screen: BooruInfo
  },
  Menu: {
    screen: BooruMenu
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

export default createAppContainer(BooruNavigator);
