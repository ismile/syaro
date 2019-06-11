import React, {useState} from 'react';
import { View, Linking } from "react-native";
import { List, Appbar } from 'react-native-paper';
import { CommunityIconize, Iconize } from '../../components/iconize';
import { Portal, Text } from 'react-native-paper';
import { NavigationScreenProps } from 'react-navigation';
import { IPost } from '../../Services/Moebooru.api';

export default class BooruInfo extends React.PureComponent<NavigationScreenProps, any> {
  render() {
    let data:IPost = this.props.navigation.state.params;
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start',flexGrow: 10 }}>
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <List.Item
        title='Source'
        onPress={()=> Linking.openURL(data.source)}
        description={data.source} />
      <List.Item
        title='Author'
        description={data.author} />
      <List.Item
        title='Rating'
        description={data.rating} />
      <List.Item
        title='Image Url'
        onPress={()=> Linking.openURL(data.file_url)}
        description={data.file_url} />
      <List.Item
        title='Size'
        description={`${data.file_size} (${data.width} x ${data.height})`} />
      <List.Item
        title='JPEG Url'
        onPress={()=> Linking.openURL(data.jpeg_url)}
        description={data.jpeg_url} />
      <List.Item
        title='JPEG Size'
        description={`${data.jpeg_file_size} (${data.jpeg_width} x ${data.jpeg_height})`} />
      <List.Item
        title='Tags'
        description={data.tags} />
    </View>
    <Appbar.Header>
      <Appbar.Action icon="arrow-back" accessibilityLabel='Back' onPress={()=> {this.props.navigation.goBack(null)}} />
    </Appbar.Header>
  </View>
  }
}
