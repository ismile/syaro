import React, {useState} from 'react';
import { View, Linking } from "react-native";
import { List, Appbar } from 'react-native-paper';
import { CommunityIconize, Iconize } from '../../components/iconize';
import { Portal, Text } from 'react-native-paper';
import { NavigationScreenProps } from 'react-navigation';
import { IPost } from '../../Services/Moebooru.api';

export default class BooruMenu extends React.PureComponent<NavigationScreenProps, any> {

  state = {
    data: [{
      name: 'Konachan',
      host: 'konachan.com'
    }, {
      name: 'Yandere',
      host: 'yande.re'
    }]
  }
  render() {
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start',flexGrow: 10 }}>
    <View style={{flex: 1, backgroundColor: 'black'}}>

      {this.state.data.map((v, i) => {
        return <List.Item
          key={i}
          title={v.name}
          onPress={()=> this.handlePress(v)}
          description={v.host} />
      })}

    </View>
    <Appbar.Header>
      <Appbar.Action icon="arrow-back" accessibilityLabel='Back' onPress={()=> {this.props.navigation.goBack(null)}} />
    </Appbar.Header>
  </View>
  }

  handlePress = async (v)=> {
    await this.props.navigation.navigate('Gallery', v);
    this.props.navigation.state.params.fetch()
  }
}
