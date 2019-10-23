import React from 'react';
import { StyleSheet, View, TouchableHighlight } from "react-native";
import { Appbar, List, FAB, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { NavigationScreenProps } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { produce } from 'immer';
import theme from '../../configs/theme';
import uuid from 'uuid/v4'

export default class BooruMenu extends React.PureComponent<NavigationScreenProps, any> {

  listConstant        = '@syaro_data_booru_list'

  state               = {
    showForm          : false,
    dialogTitle       : 'Add Booru',

    nameInput         : '',
    hostInput         : '',
    idInput           : '',

    showDelete        : false,

    data              : [{
      id      : '11111111-1111-1111-1111-111111111111',
      name    : 'Konachan',
      host    : 'konachan.com'
    }, {
      id      : '11111111-1111-1111-1111-111111111112',
      name    : 'Yandere',
      host    : 'yande.re'
    }]
  }

  style               = StyleSheet.create({
    container         : { flex: 1, flexDirection: 'column', alignContent: 'flex-start',flexGrow: 10 },
    view              : { flex: 1, backgroundColor: 'black'},
    fabContainer      : { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'},
    fab               : { position: 'absolute', margin: 'auto', bottom: 28, right: 20, alignItems: 'center' },
    buttonDialog      : { marginLeft: 10, marginRight: 10, marginBottom: 10}
  })

  async componentDidMount() {
    var itemJSON = await AsyncStorage.getItem(this.listConstant)
    if(itemJSON != null) {
      this.setState(produce(this.state, state => { state.data = JSON.parse(itemJSON)}))
    } else {
      await AsyncStorage.setItem(this.listConstant, JSON.stringify(this.state.data))
    }
  }

  render() {
    return <View style={this.style.container}>
    <View style={this.style.view}>

      {this.state.data.map((v, i) => {
        return <List.Item
          key={i}
          title={v.name}
          right={() => <TouchableHighlight onPress={(e)=> {e.stopPropagation(); this.handleEdit(v)}}><List.Icon color='white'  icon="edit"  /></TouchableHighlight>}
          onPress={()=> this.handlePress(v)}
          description={v.host} />
      })}

    </View>
    <Appbar.Header>
      <Appbar.Action icon="arrow-back" accessibilityLabel='Back' onPress={()=> {this.props.navigation.goBack(null)}} />
    </Appbar.Header>

    <View style={this.style.fabContainer}>
      <FAB
        style={this.style.fab}
        icon="add"
        onPress={() => this.setState(produce(this.state, state => {state.showForm = true; state.showDelete = false; state.idInput = uuid()}))}
      />
    </View>

    <Portal>
      <Dialog
        visible={this.state.showForm}
        onDismiss={()=> this.setState(produce(this.state, state => {state.showForm = false}))}>
        <Dialog.Title>{this.state.dialogTitle}</Dialog.Title>
        <Dialog.Content>
          <TextInput
            // mode='flat'
            label='Name'
            value={this.state.nameInput}
            onChangeText={text => this.setState(produce(this.state, state => {state.nameInput = text}))}
          />
          <TextInput
            // mode='outlined'
            label='Host'
            value={this.state.hostInput}
            onChangeText={text => this.setState(produce(this.state, state => {state.hostInput = text}))}
          />
        </Dialog.Content>
        <Dialog.Actions>
          {this.state.showDelete && <Button style={this.style.buttonDialog} onPress={()=> this.handleDelete()}>Delete</Button>}

          <Button style={this.style.buttonDialog} onPress={()=> this.setState(produce(this.state, state => {state.showForm = false}))}>close</Button>
          <Button style={this.style.buttonDialog} mode='contained' color={theme.colors.primary} onPress={()=> this.handleSave()}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

  </View>
  }

  async handleSave() {
    await this.setState(produce(this.state, state => {

      state.showForm = false;
      state.dialogTitle = 'Add Booru'

      var index = state.data.findIndex(x => x.id === state.idInput)
      if(index != -1) {
        state.data[index] = {
          id: state.idInput,
          name: state.nameInput,
          host: state.hostInput
        }
      } else {
        state.data.push({
          id: state.idInput,
          name: state.nameInput,
          host: state.hostInput
        })
      }
    }))

    await AsyncStorage.setItem(this.listConstant, JSON.stringify(this.state.data))

  }

  async handleEdit(data) {
    await this.setState(produce(this.state, state => {
      state.showForm = true;
      state.showDelete = true,
      state.dialogTitle = 'Edit '+data.name;
      state.hostInput = data.host;
      state.nameInput = data.name;
      state.idInput   = data.id;
    }))
  }

  async handleDelete() {
    await this.setState(produce(this.state, state => {
      var index = state.data.findIndex(x => x.id === state.idInput)
      state.data.splice(index, 1);

      state.showForm = false
    }))

    await AsyncStorage.setItem(this.listConstant, JSON.stringify(this.state.data))
  }

  handlePress = async (v)=> {
    await this.props.navigation.navigate('Gallery', v);
    this.props.navigation.state.params.fetch()
  }
}
