import {produce} from 'immer';
import React, {useState} from 'react';
import { View, Dimensions, RefreshControl  } from "react-native";
import FastImage from 'react-native-fast-image';
import Masonry from 'react-native-masonry-layout';
import { Appbar, Button, Card, Portal, Text } from 'react-native-paper';
import {createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

import Iconize, { CommunityIconize } from '../../components/iconize';
import { IPost, MoebooruApi } from '../../Services/Moebooru.api';

const Image = createImageProgress(FastImage);
const { width } = Dimensions.get( "window" );
const columnWidth = ( width ) / 2 - 10;


export default class KonachanGallery extends React.PureComponent<any, {posts:Array<IPost>}> {
  static navigationOptions  = {
    tabBarColor : '#2962ff',
    tabBarIcon  : CommunityIconize('folder-multiple-image')
  };

  state           = {
    posts: [],
    isRefreshing: false,
    params: {
      page: 1
    }
  }

  api:MoebooruApi = new MoebooruApi('konachan.com');


  async componentDidMount() {
    await this._fetchData()
  }

  render() {
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start' }}>
      <Appbar.Header>
        <Appbar.Action
          icon={Iconize('menu')}
          onPress={()=> {this.props.navigation.openDrawer()}}
        />
        <Appbar.Content
          title="Bajigur"
          subtitle="Gallery"
        />
        <Appbar.Action icon="search" onPress={()=> {}} />
        <Appbar.Action icon="more-vert" onPress={()=> {}} />
      </Appbar.Header>
      <View style={{flex: 1, flexGrow: 10, padding: this.state.padding}}>
        <Masonry
          ref="masonry"
          columns={2} // optional - Default: 2
          style={{ flex: 1}}
          onMomentumScrollEnd={this.handleOnEndReached}
          refreshControl={<RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleOnRefresh}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={[ '#ff0000', '#00ff00', '#0000ff' ]}
            progressBackgroundColor="#ffff00"
          />}
          renderItem={(item:{data:IPost})=><View style={{
            margin: 5,
            backgroundColor: "#fff",
            // borderRadius: 5,
            overflow: "hidden",
            // borderWidth: 1,
            // borderColor: "#dedede"
          }}>
            <Image
            source={{ uri: item.data.preview_url }}
            indicator={ProgressBar}
            style={{
              width: columnWidth,
              height: columnWidth / item.data.preview_width * item.data.preview_height,
            }}/>
          </View>}
        />
      </View>
    </View>
  }

  handleOnEndReached = (event)=> {
    const scrollHeight = Math.floor( event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height );
		const height = Math.floor( event.nativeEvent.contentSize.height );
		if ( scrollHeight >= height ) {
      this._fetchData({page: this.state.params.page+1})
		}
  }

  handleOnRefresh = ()=> {
    this._fetchData()
  }

  async _fetchData(params={page: 1}) {
    this.setState(produce(this.state, state => {
      state.isRefreshing = true
    }))
    var res = await this.api.post(params);

    if(params.page == 1) this.refs.masonry.clear();

    this.refs.masonry.addItemsWithHeight(res.data.map((d:IPost) => {
      return {
        key: d.id,
        height: columnWidth / d.preview_width * d.preview_height,
        data: d
      }
    }));

    this.setState(produce(this.state, state => {
      state.posts = state.posts.concat(res.data)
      state.params = {
        ...state.params,
        ...params
      }

      state.isRefreshing = false
    }))
  }
}
