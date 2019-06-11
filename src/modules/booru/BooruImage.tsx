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
import RNFetchBlob from 'rn-fetch-blob'

export default class BooruImage extends React.PureComponent<NavigationScreenProps, any> {
  static navigationOptions = {
    title: 'Konachan'
  }

  state = {
    open: false
  }

  render() {
    let data:IPost = this.props.navigation.state.params;
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start' }}>
      <ImageViewer imageUrls={[{
        url: data.sample_url,
        width: data.sample_width,
        height: data.sample_height}]}
        renderImage={ImageView}
        renderIndicator={() => {}}
        />
      <Appbar.Header>

        <Appbar.Action icon="arrow-back" accessibilityLabel='Back' onPress={()=> {this.props.navigation.goBack(null)}} />
        <Appbar.Action icon="archive" accessibilityLabel='Download jpg image' disabled={!data.jpeg_url || data.jpeg_url == ''} onPress={() => this.download('jpg') } />
        <Appbar.Action icon="info" accessibilityLabel='Info' onPress={() => this.props.navigation.navigate('Info', data) } />
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
          onPress={() => this.download()}
        />
      </View>
    </View>
  }

  download(type='ori') {
    let data:IPost = this.props.navigation.state.params;
    var url = data.file_url;
    switch (type) {
      case 'jpg':
        url = data.jpeg_url
        break;
      case 'sample':
        url = data.sample_url
        break;
    }
    var ext:String = url.split('.').pop();
    var mime = 'image/jpeg';
    if(ext.toLowerCase() == 'png') mime = 'image/png'

    RNFetchBlob
    .config({
        fileCache: true,
        addAndroidDownloads : {
            useDownloadManager : true, // <-- this is the only thing required
            // Optional, override notification setting (default to true)
            notification : true,
            description : `Downloading Konachan - ${data.id}.${ext}`,
            mime: mime,
            path : `${RNFetchBlob.fs.dirs.PictureDir}/booru/Konachan - ${data.id}.${ext}`
        }
    })
    .fetch('GET', url)
    .then((resp) => {
      console.log(resp, resp.path())
      // the path of downloaded file
      resp.path()
    })
  }
}

const ImageProgress = createImageProgress(FastImage);
const ImageView = function(props) {
  return <ImageProgress indicator={ProgressBar} {...props} />
}
