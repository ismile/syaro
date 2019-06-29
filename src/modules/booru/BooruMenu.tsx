import React from 'react';
import { StyleSheet, View } from "react-native";
import { Appbar, List } from 'react-native-paper';
import { NavigationScreenProps } from 'react-navigation';

export default class BooruMenu extends React.PureComponent<NavigationScreenProps, any> {

  state               = {
    data: [{
      name: 'Konachan',
      host: 'konachan.com'
    }, {
      name: 'Yandere',
      host: 'yande.re'
    }]
  }

  style               = StyleSheet.create({
    container         : { flex: 1, flexDirection: 'column', alignContent: 'flex-start',flexGrow: 10 },
    view              : { flex: 1, backgroundColor: 'black'}
  })

  render() {
    return <View style={this.style.container}>
    <View style={this.style.view}>

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
