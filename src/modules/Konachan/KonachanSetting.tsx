import React, {useState} from 'react';
import { View } from "react-native";
import { CommunityIconize, Iconize } from '../../components/iconize';
import { Portal, Text } from 'react-native-paper';

export default class KonachanSetting extends React.PureComponent {
  static navigationOptions = {
    tabBarColor : '#00796b',
    tabBarIcon  : Iconize('settings')
  };

  render() {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text>Setting </Text>
  </View>
  }
}
