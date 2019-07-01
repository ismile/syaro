import React from 'react';
import { View, StyleSheet } from "react-native";
import FastImage from 'react-native-fast-image';
import Image, { createImageProgress } from 'react-native-image-progress';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Appbar, FAB } from 'react-native-paper';
import ProgressBar from 'react-native-progress/Bar';
import { NavigationScreenProps } from 'react-navigation';
import RNFetchBlob from 'rn-fetch-blob';
import theme from '../../configs/theme';
import { IPost } from '../../Services/Moebooru.api';

export default class BooruImage extends React.PureComponent<NavigationScreenProps, any> {
  state              = {
    open: false
  }

  style               = StyleSheet.create({
    container         : { flex: 1, flexDirection: 'column', alignContent: 'flex-start' },
    fabContainer      : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'},
    fab               : { position: 'absolute', margin: 'auto', bottom: 28, right: 20, alignItems: 'center' }
  })

  render() {
    let data:IPost = this.props.navigation.state.params.data;
    return <View style={this.style.container}>
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
      <View style={this.style.fabContainer}>
        <FAB
          style={this.style.fab}
          icon="file-download"
          onPress={() => this.download()}
        />
      </View>
    </View>
  }

  async download(type='ori') {
    let data:IPost = this.props.navigation.state.params.data;
    let site = this.props.navigation.state.params.site

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

    try {
      let d = await RNFetchBlob
      .config({
        fileCache: true,
        addAndroidDownloads : {
          useDownloadManager : true,
          notification : true,
          description : `Downloading Konachan - ${data.id}.${ext}`,
          mime: mime,
          path : `${RNFetchBlob.fs.dirs.DownloadDir}/syaro_tmp/${site.name} - ${data.id}.${ext}`
        }
      })
      .fetch('GET', url)

      if(!(await RNFetchBlob.fs.exists(`${RNFetchBlob.fs.dirs.PictureDir}/syaro`))) {
        await RNFetchBlob.fs.mkdir(`${RNFetchBlob.fs.dirs.PictureDir}/syaro`)
      }

      // mv file to prevent files being deleted after uninstalling app
      if(await RNFetchBlob.fs.exists(d.path())) {
        await RNFetchBlob.fs.mv(d.path(), `${RNFetchBlob.fs.dirs.PictureDir}/syaro/${site.name} - ${data.id}.${ext}`)
      }

    } catch (error) {
      console.log(error)
    }
  }

}

const ImageProgress = createImageProgress(FastImage);
const ImageView = function(props:any) {
  return <Image indicator={ProgressBar} indicatorProps={{color: theme.colors.accent}} {...props} />
}
