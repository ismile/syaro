import React, {useState} from 'react';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';


export const CommunityIconize = name => ({ tintColor }) => (
  <IconCommunity
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

export const Iconize = name => ({ tintColor }) => (
  <Icon
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

export default Iconize;
