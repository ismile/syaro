import React from 'react';
import { Dimensions, TouchableHighlight, View } from "react-native";
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import theme from '../../configs/theme';
import { IPost } from '../../Services/Moebooru.api';

const Image = createImageProgress(FastImage);
const { width } = Dimensions.get( "window" );
const columnWidth = ( width ) / 2 - 5;

class BooruGalleryDetail extends React.PureComponent<{data:IPost, handleGoToDetail:Function}, {}> {
  render() {
    return <View
      style={{ margin: 2.5, overflow: 'hidden' }}>
        <TouchableHighlight onPress={()=> {this.props.handleGoToDetail(this.props.data)}} underlayColor="white">
        <Image
        source={{ uri: this.props.data.preview_url }}
        indicator={ProgressBar}
        indicatorProps={{color: theme.colors.accent}}
        style={{
          width: columnWidth,
          height: columnWidth / this.props.data.preview_width * this.props.data.preview_height,
        }}/>
        </TouchableHighlight>
      </View>
  }
}

export default React.memo(BooruGalleryDetail)
