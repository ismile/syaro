import React, {useState, memo} from 'react';
import { View } from "react-native";
import { Appbar, Button, Card, Portal, Text, FAB } from 'react-native-paper';
import { CommunityIconize, Iconize } from '../../components/iconize';
import { NavigationTransitionProps, NavigationProp, NavigationScreenProps } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import { IPost } from '../../Services/Moebooru.api';
import ImageViewer from 'react-native-image-zoom-viewer';
import {createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';


export default class KonachanImage extends React.PureComponent<NavigationScreenProps, any> {
  static navigationOptions = {
    title: 'Konachan'
  }

  state = {
    open: false
  }

  constructor(props:NavigationScreenProps) {
    super(props)

    console.log(props);
  }

  render() {
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start' }}>
      <ImageViewer imageUrls={[{
        url:this.props.navigation.state.params.sample_url,
        width:  this.props.navigation.state.params.sample_width,
        height: this.props.navigation.state.params.sample_height}]}
        renderImage={ImageView}
        renderIndicator={() => {}}
        />
      <Appbar.Header>

        <Appbar.Action icon="arrow-back" accessibilityLabel='Back' onPress={()=> {this.props.navigation.goBack(null)}} />
        <Appbar.Action icon="archive" accessibilityLabel='Download Original Image' onPress={() => console.log('Pressed archive')} />
        <Appbar.Action icon="info" accessibilityLabel='Info' onPress={() => console.log('Pressed mail')} />
      </Appbar.Header>
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <FAB
          style={{
            position: 'absolute',
            margin: 'auto',
            right: 20,
            bottom: 28,
            alignItems: 'center'
          }}
          icon="file-download"
          onPress={() => console.log('Pressed')}
        />
      </View>
    </View>
  }
}

const ImageProgress = createImageProgress(FastImage);
const ImageView = function(props) {
  return <ImageProgress indicator={ProgressBar} {...props} />
}
