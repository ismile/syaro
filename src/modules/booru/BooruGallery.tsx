import {produce} from 'immer';
import React, {useState} from 'react';
import { View, Dimensions, RefreshControl, TouchableHighlight, PermissionsAndroid  } from "react-native";
import FastImage from 'react-native-fast-image';
import Masonry from 'react-native-masonry-layout';
import { Appbar, Button, Card, Portal, Text, FAB, Menu,Divider, Dialog, TextInput } from 'react-native-paper';
import {createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

import Iconize, { CommunityIconize } from '../../components/iconize';
import { IPost, MoebooruApi } from '../../Services/Moebooru.api';
import { NavigationTransitionProps } from 'react-navigation';
import theme from '../../configs/theme';

const Image = createImageProgress(FastImage);
const { width } = Dimensions.get( "window" );
const columnWidth = ( width ) / 2 - 10;


export default class BooruGallery extends React.PureComponent<NavigationTransitionProps, {posts:Array<IPost>}> {

  api:MoebooruApi = new MoebooruApi('konachan.com');
  defaultData     = {
    name: 'Konachan',
    host: 'konachan.com'
  }
  state           = {
    open: false,
    showMenu: false,
    showFilter: false,
    filterTextValue: '',
    posts: [],
    isRefreshing: false,
    params: {
      page: 1
    }
  }

  render() {
    return <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start' }}>
      <View style={{flex: 1, flexGrow: 10, padding: 5, backgroundColor: 'black'}}>
        <Masonry
          ref="masonry"
          columns={2} // optional - Default: 2
          style={{ flex: 1}}
          onMomentumScrollEnd={this.handleOnEndReached}
          refreshControl={<RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.handleOnRefresh}
            tintColor={theme.colors.accent}
            title="Loading..."
            titleColor={theme.colors.accent}
            colors={[ 'black', theme.colors.primary ]}
            progressBackgroundColor={theme.colors.accent}
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
            <TouchableHighlight onPress={()=> {this.handleGoToDetail(item)}} underlayColor="white">
            <Image
            source={{ uri: item.data.preview_url }}
            indicator={ProgressBar}
            indicatorProps={{color: theme.colors.accent}}
            style={{
              width: columnWidth,
              height: columnWidth / item.data.preview_width * item.data.preview_height,
            }}/>
            </TouchableHighlight>
          </View>}
        />
      </View>

      <Portal>
        <Dialog
          visible={this.state.showFilter}
          onDismiss={this.handleHideFilter}>
          <Dialog.Title>Filter</Dialog.Title>
          <Dialog.Content>
          <TextInput
            // label='Email'
            value={this.state.filterTextValue}
            onChangeText={text => this.setState({ filterTextValue: text })}
          />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={this.handleHideFilter}>Close</Button>
            <Button onPress={this.handleClearFilter}>Clear</Button>
            <Button onPress={this.handleFilter}>Filter</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Appbar.Header>
        {/* <Appbar.Action
          icon={Iconize('menu')}
          onPress={()=> {this.props.navigation.openDrawer()}}
        /> */}
        <Appbar.Content
          title={this.props.navigation.state.params ? this.props.navigation.state.params.name : 'Konachan'}
          subtitle={(this.props.navigation.state.params && this.props.navigation.state.params.tags) ? this.props.navigation.state.params.tags: 'All'}
        />
        <Appbar.Action icon="filter-list" onPress={this.handleShowFilter} />
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
          onPress={() => this.props.navigation.navigate('Menu', {fetch: this._fetchData.bind(this), forceUpdate: this.forceUpdate.bind(this)}) }
        />
      </View>
    </View>
  }

  async componentDidMount() {
    await this._fetchData()
    this.requestPermission()
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

  handleGoToDetail = (item)=> {
    this.props.navigation.navigate('Image', {
      data: item.data,
      site: this.props.navigation.state.params? this.props.navigation.state.params: this.defaultData
    })
  }

  handleOpenMenu = () => this.setState({ showMenu: true });

  handleCloseMenu = () => this.setState({ showMenu: false });

  handleShowFilter = () => this.setState({ showFilter: true });

  handleHideFilter = () => this.setState({ showFilter: false });

  handleFilter = async () => {
    var data = this.props.navigation.state.params ? this.props.navigation.state.params: this.defaultData
    data = {...data, page: 1, tags: this.state.filterTextValue}
    await this.props.navigation.navigate('Gallery', data)
    this.handleHideFilter()
    this._fetchData()
  }

  handleClearFilter = async () => {
    var data = this.props.navigation.state.params ? this.props.navigation.state.params: this.defaultData
    data = {...data, page: 1, tags: null}
    await this.props.navigation.navigate('Gallery', data)
    this.setState({filterTextValue: ''});
    this.handleHideFilter()
    this._fetchData()
  }

  async _fetchData(params={page: 1}) {
    this.setState(produce(this.state, state => {
      state.isRefreshing = true
    }))

    var data = this.props.navigation.state.params? this.props.navigation.state.params:{...this.defaultData}
    params.tags = data.tags;
    var res = await this.api.post(params, data);
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

  async requestPermission() {
    try {
      let check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if(!check) {
        const granted = await PermissionsAndroid.requestMultiple(
          [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

}
