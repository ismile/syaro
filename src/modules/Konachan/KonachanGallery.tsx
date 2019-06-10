import {produce} from 'immer';
import React, {useState} from 'react';
import { View, Dimensions, RefreshControl, TouchableHighlight  } from "react-native";
import FastImage from 'react-native-fast-image';
import Masonry from 'react-native-masonry-layout';
import { Appbar, Button, Card, Portal, Text, FAB, Menu,Divider } from 'react-native-paper';
import {createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

import Iconize, { CommunityIconize } from '../../components/iconize';
import { IPost, MoebooruApi } from '../../Services/Moebooru.api';
import { NavigationTransitionProps } from 'react-navigation';

const Image = createImageProgress(FastImage);
const { width } = Dimensions.get( "window" );
const columnWidth = ( width ) / 2 - 10;


export default class KonachanGallery extends React.PureComponent<NavigationTransitionProps, {posts:Array<IPost>}> {

  api:MoebooruApi = new MoebooruApi('konachan.com');
  state           = {
    open: false,
    showMenu: false,
    posts: [],
    isRefreshing: false,
    params: {
      page: 1
    }
  }

  render() {
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start' }}>
      <View style={{flex: 1, flexGrow: 10, padding: 5}}>
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
          renderItem={(item:{data:IPost})=><View
          style={{
            margin: 5,
            backgroundColor: "#fff",
            // borderRadius: 5,
            overflow: "hidden",
            // borderWidth: 1,
            // borderColor: "#dedede"
          }}>
            <TouchableHighlight onPress={()=> {this.props.navigation.navigate('Image', item.data)}} underlayColor="white">
            <Image
            source={{ uri: item.data.preview_url }}
            indicator={ProgressBar}

            style={{
              width: columnWidth,
              height: columnWidth / item.data.preview_width * item.data.preview_height,
            }}/>
            </TouchableHighlight>
          </View>}
        />
      </View>
      <Appbar.Header>
        {/* <Appbar.Action
          icon={Iconize('menu')}
          onPress={()=> {this.props.navigation.openDrawer()}}
        /> */}
        <Appbar.Content
          title="Konachan"
          subtitle="Gallery"
        />
        <Appbar.Action icon="filter-list" onPress={()=> {}} />
        <Menu
          visible={this.state.showMenu}
          onDismiss={this.handleCloseMenu}
          anchor={
            <Appbar.Action icon="more-vert" onPress={this.handleOpenMenu} />
          }
        >
          <Menu.Item icon='settings' onPress={() => {}} title="Setting" />
          <Divider />
          <Menu.Item icon='info' onPress={() => {}} title="About" />
        </Menu>

      </Appbar.Header>
      <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <FAB
          style={{
            position: 'absolute',
            margin: 'auto',
            bottom: 28,
            alignItems: 'center'
          }}
          icon="apps"
          onPress={() => console.log('Pressed')}
        />
      </View>
    </View>
  }

  async componentDidMount() {
    await this._fetchData()
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

  handleOpenMenu = () => this.setState({ showMenu: true });

  handleCloseMenu = () => this.setState({ showMenu: false });

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
