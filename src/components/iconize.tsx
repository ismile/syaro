import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Iconize = name => ({ tintColor }) => (
  <Icon
    style={{ backgroundColor: 'transparent' }}
    name={name}
    color={tintColor}
    size={24}
  />
);

export default Iconize;
