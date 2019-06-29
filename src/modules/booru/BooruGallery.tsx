import { produce } from 'immer';
import React from 'react';
import { PermissionsAndroid, StyleSheet, View, Dimensions, ProgressBarAndroid, Linking } from "react-native";
import { WaterfallList } from 'react-native-largelist-v3';
import { Appbar, Button, Dialog, Divider, FAB, Menu, Portal, TextInput, ProgressBar, List } from 'react-native-paper';
import { NavigationTransitionProps } from 'react-navigation';
import { IPost, MoebooruApi } from '../../Services/Moebooru.api';
import BooruGalleryDetail from './BooruGalleryDetail';
import theme from '../../configs/theme';

const { width }       = Dimensions.get( "window" );
const space           = 5;
const columnWidth     = ( width ) / 2 - space;

export default class BooruGallery extends React.PureComponent<NavigationTransitionProps, {posts:Array<IPost>}> {
  gallery: WaterfallList;
  api:MoebooruApi     = new MoebooruApi('konachan.com');
  defaultData         = {
    name              : 'Konachan',
    host              : 'konachan.com'
  }
  state               = {
    open              : false,
    showFilter        : false,
    filterTextValue   : '',
    posts             : [],
    isRefreshing      : false,
    params            : {
      page            : 1
    }
  }

  style               = StyleSheet.create({
    cont              : { flex: 1, flexDirection: 'column', alignContent: 'flex-start' },
    gallery           : { backgroundColor: 'black', padding: space/2},
    fabContainer      : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
    fab               : { position: 'absolute', margin: 'auto', bottom: 28, alignItems: 'center' }
  })

  render() {
    return <View style={this.style.cont}>
      <WaterfallList
        ref={ref => (this.gallery = ref)}
        data={this.state.posts}
        numColumns={2}
        preferColumnWidth={columnWidth}
        heightForItem={item => (columnWidth / item.preview_width * item.preview_height)+space}
        style={this.style.gallery}
        onRefresh={this.handleOnRefresh}
        onLoading={this.handleOnEndReached}
        renderItem={(item:IPost)=> <BooruGalleryDetail data={item} handleGoToDetail={this.handleGoToDetail} />}
      />

      <AppBarView
        showProgress={this.state.isRefreshing}
        params={this.props.navigation.state.params}
        handleShowFilter={this.handleShowFilter}
      />

    <View style={this.style.fabContainer}>
      <FAB
        style={this.style.fab}
        icon="apps"
        onPress={() => this.props.navigation.navigate('Menu', {fetch: this._fetchData.bind(this), forceUpdate: this.forceUpdate.bind(this)}) }
      />
    </View>

    <FilterView
      filterTextValue={this.state.filterTextValue}
      showFilter={this.state.showFilter}
      handleTextFilterChange={this.handleTextFilterChange}
      handleHideFilter={this.handleHideFilter}
      handleFilter={this.handleFilter}
      handleClearFilter={this.handleClearFilter}  />
    </View>
  }

  async componentDidMount() {
    await this._fetchData()
    this.handleRequestPermission()
  }

  handleOnEndReached = ()=> this._fetchData({page: this.state.params.page+1})
  handleOnRefresh = ()=> this._fetchData()
  handleGoToDetail = (item)=> {
    this.props.navigation.navigate('Image', {
      data: item,
      site: this.props.navigation.state.params? this.props.navigation.state.params: this.defaultData
    })
  }

  handleOpenMenu          = () => this.setState(produce(this.state, state => { state.showMenu= true }));
  handleCloseMenu         = () => this.setState(produce(this.state, state => { state.showMenu = false }));

  handleShowFilter        = () => this.setState(produce(this.state, state => { state.showFilter = true }));
  handleTextFilterChange  = (text:string) => this.setState(produce(this.state, state => { state.filterTextValue = text }))
  handleHideFilter        = () => this.setState(produce(this.state, state => { state.showFilter = false }));
  handleFilter            = async () => {
    var data = this.props.navigation.state.params ? this.props.navigation.state.params: this.defaultData
    data = {...data, page: 1, tags: this.state.filterTextValue}
    await this.props.navigation.navigate('Gallery', data)
    this.handleHideFilter()
    this._fetchData()
  }
  handleClearFilter       = async () => {
    var data = this.props.navigation.state.params ? this.props.navigation.state.params: this.defaultData
    data = {...data, page: 1, tags: null}
    await this.props.navigation.navigate('Gallery', data)
    this.setState(produce(this.state, state => { state.filterTextValue = ''}));
    this.handleHideFilter()
    this._fetchData()
  }

  async handleRequestPermission() {
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

  async _fetchData(params={page: 1}) {
    this.setState(produce(this.state, state => {
      state.isRefreshing = true
    }))

    var data    = this.props.navigation.state.params? this.props.navigation.state.params:{...this.defaultData}
    params.tags = data.tags;
    var res     = await this.api.post(params, data);

    if(params.page == 1) this.setState(produce(this.state, state => {state.posts = []}))

    await this.setState(produce(this.state, state => {
      state.posts = state.posts.concat(res.data)
      state.params = {
        ...state.params,
        ...params
      }
      state.isRefreshing = false
    }))

    this.gallery.endRefresh()
    this.gallery.endLoading()
  }

}

const FilterView = React.memo(function(props: {
  showFilter              : boolean,
  handleHideFilter        : ()=> any,
  handleClearFilter       : ()=> any,
  handleFilter            : ()=> any,
  handleTextFilterChange  : (text:string)=> any,
  filterTextValue         : string,
}) {
  return <Portal>
    <Dialog
      visible={props.showFilter}
      onDismiss={props.handleHideFilter}>
      <Dialog.Title>Filter</Dialog.Title>
      <Dialog.Content>
      <TextInput
        value={props.filterTextValue}
        onChangeText={props.handleTextFilterChange}
      />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.handleHideFilter}>Close</Button>
        <Button onPress={props.handleClearFilter}>Clear</Button>
        <Button onPress={props.handleFilter}>Filter</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
})

const AppBarView = React.memo(function(props:{
  showProgress        : boolean,
  params              : any,
  handleShowFilter    : () => any,
}) {

  const [showMenu, setShowMenu] = React.useState(false)
  const [showAbout, setAbout]   = React.useState(false)

  return <React.Fragment>
    {props.showProgress && <ProgressBarAndroid styleAttr='Horizontal' color={theme.colors.accent} style={{backgroundColor: 'black'}} indeterminate={true} /> }
    <Appbar.Header>
      <Appbar.Content
        title={props.params ? props.params.name : 'Konachan'}
        subtitle={(props.params && props.params.tags) ? props.params.tags: 'All'}
      />
      <Appbar.Action icon="filter-list" onPress={props.handleShowFilter} />
      <Menu
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
        anchor={
          <Appbar.Action icon="more-vert" onPress={()=> setShowMenu(true)} />
        }
      >
        <Menu.Item icon='settings' onPress={() => {}} title="Setting" />
        <Divider />
        <Menu.Item icon='info' onPress={() => setAbout(true)} title="About" />
      </Menu>
    </Appbar.Header>

    <Portal>
      <Dialog
        visible={showAbout}
        onDismiss={()=> setAbout(false)}>
        <Dialog.Title>About</Dialog.Title>
        <Dialog.Content>
          <List.Item
          title='Syaro V0.9.0'
          onPress={()=> Linking.openURL('https://github.com/ismile')}
          description={'\u00A9 2019 ismile|Bajiguri'} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={()=> setAbout(false)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </React.Fragment>
})
