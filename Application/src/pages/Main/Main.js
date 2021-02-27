
import React , { Component } from 'react';

import {
  StyleSheet,
  TouchableOpacity,
  Image,
  AppState,
} from 'react-native';

import {
  Container,
  Header,
  Footer,
  FooterTab,
  Button,
  Left,
  Body,
  Right,
  Text,
  Tab,
  Tabs,
  StyleProvider,
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';//自定义组件

import FooterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppIcon from 'react-native-vector-icons/FontAwesome';

import Search from "../Knowledgement/Header";
import Contain3 from "../Knowledgement/container";
import Contain1 from "../Test/container";
import Contain2 from "../Expand/container";
import AsyncStorage from "@react-native-community/async-storage";
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import server from "../../server";
import {
  NavigationActions,
  StackActions
} from "react-navigation";
import Toast from "react-native-easy-toast";

let useTime=0;
let addUseCount=1;
let userID;
let intervalUseTime;

export default class FooterTabsIconTextExample extends Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerShown: false,
  };
  state={
    Page:1,
    token:'',
    user:{},
    activeColor_1:'#D33E42',
    activeColor_2:'#7D7D7D',
    activeColor_3:'#7D7D7D',
    activeIcon_1:'pencil-box',
    activeIcon_2:'book',
    activeIcon_3:'eye-outline',
  };

  getToken = async () => {
    try {
      const _token = await AsyncStorage.getItem ('@token');
      this.setState({token:_token});
    } catch (e) {
    }
  };

  getUserInfo(){
    MyLoadingUtil.showLoading();
    fetch(server + 'info', {
      method : 'POST',
      headers : {
        'token' : this.state.token
      },
    })
        .then((response) => response.json())
        .then((Json) => {
          MyLoadingUtil.dismissLoading();
          if (Json.status === 'success') {
            this.setState({user:Json.data});
            userID=Json.data.user_id;
          }
          if (Json.status === 'failure') {
            this.refs.warning.show(Json.reason, 5000);
          }
        }).catch((e) => {
      this.refs.warning.show("无法获取用户信息", 5000);
      MyLoadingUtil.dismissLoading();
    });
  }


  componentDidMount() {
    this.getToken();
    if (this.props.navigation.getParam ('user', 'None') === 'None') this.getUserInfo ();
    else {
      userID=this.props.navigation.getParam ('user', 'None').user_id;
      this.setState ({
        user : this.props.navigation.getParam ('user', 'None'),
      });
    }
    intervalUseTime = setInterval(() => {useTime++;}, 1000);
    AppState.addEventListener('change', this._onAppStateChanged);
  }

  componentWillUnmount(){
   AppState.removeEventListener('change', this._onAppStateChanged);
   if(useTime!==0){   //Main的生命周期结束但App没有后台运行的情况下（重新登录）依然需要更新用户使用信息
     clearInterval(intervalUseTime);
     let formdata = new FormData ();
     formdata.append ("user_id", userID);
     formdata.append ("do_time", addUseCount);
     formdata.append ("use_time", useTime);
     fetch(server + 'statistics', {
       method : 'POST',
       headers : {
         'Content-Type' : 'multipart/form-data',
       },
       body : formdata
     }).then((response) => response.json())
         .then((responseJson) => {
           if (responseJson.status === 'success'){
             useTime=0;
             addUseCount=1;
           }
         });
   }
  }

  _onAppStateChanged=()=> {
    switch (AppState.currentState) {
      case "active":
        intervalUseTime = setInterval(() => {useTime++;}, 1000);
        break;
      case "background":    //若在此仅暂停计时并在生命周期结束时提交数据，那么在滑动关闭后台APP时会丢失数据
        clearInterval(intervalUseTime);
        let formdata = new FormData ();
        formdata.append ("user_id", userID);
        formdata.append ("do_time", addUseCount);
        formdata.append ("use_time", useTime);
        fetch(server + 'statistics', {
          method : 'POST',
          headers : {
            'Content-Type' : 'multipart/form-data',
          },
          body : formdata
        }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status === 'success'){
                useTime=addUseCount=0;
              }
            });
        break;
      default:

    }
  };
  refreshData = async () => {
    try {
      const _token = await AsyncStorage.getItem ('@token');
      MyLoadingUtil.showLoading();
      fetch(server + 'info', {
        method : 'POST',
        headers : {
          'token' : _token
        },
      })
          .then((response) => response.json())
          .then((Json) => {
            MyLoadingUtil.dismissLoading();
            if (Json.status === 'success') {
              this.setState({user:Json.data});
            }
            if (Json.status === 'failure') {
              this.refs.warning.show(Json.reason, 5000);
            }
          }).catch((e) => {
        this.refs.warning.show("无法获取用户信息", 5000);
        MyLoadingUtil.dismissLoading();
      });
    } catch (e) {
    }
  };

  render() {
    const navigation=this.props.navigation;
    return (
        <StyleProvider  style={getTheme(material)}>
        <Container>
          <Header style={{
            backgroundColor : "#D33E42" ,
            height : 65 ,
          }}>
            <Left>
            <AppIcon name="gears" style={{
              fontSize : 40,
              color : 'white',
            }}/>
            </Left>
            <Body style={[styles.centerLayOut,{marginLeft:70}]}>
              {this.state.Page===2?<Search />:<Text style={{color : 'white',fontSize : 20,fontWeight:'bold'}}>结构动力学</Text>}
            </Body>
            <Right>
              <TouchableOpacity onPress={()=>navigation.navigate("User",{callBack:this.refreshData})}>
                <Image source={{uri:this.state.user.image}} style={{height: 44, width: 44,borderRadius:22}}/>
              </TouchableOpacity>

            </Right>
          </Header>
          <Tabs initialPage={0} page={this.state.Page-1} tabBarPosition
                onChangeTab={(page)=>{
                  if(page.i===0)
                    this.setState({
                      Page:1,
                    activeColor_1:'#D33E42',
                    activeColor_2:'#7D7D7D',
                    activeColor_3:'#7D7D7D',
                    activeIcon_1:'pencil-box',
                    activeIcon_2:'book',
                    activeIcon_3:'eye-outline',
                  });else if(page.i===1)
                    this.setState({
                      Page:2,
                      activeColor_1:'#7D7D7D',
                      activeColor_2:'#D33E42',
                      activeColor_3:'#7D7D7D',
                      activeIcon_1:'pencil',
                      activeIcon_2:'book-open',
                      activeIcon_3:'eye-outline',
                    });else
                    this.setState({
                      Page:3,
                      activeColor_1:'#7D7D7D',
                      activeColor_2:'#7D7D7D',
                      activeColor_3:'#D33E42',
                      activeIcon_1:'pencil',
                      activeIcon_2:'book',
                      activeIcon_3:'eye',
                    })

          }}>
            <Tab heading="Tab1">
              <Contain1 navigation={navigation}/>
            </Tab>
            <Tab heading="Tab2">
              <Contain2 />
            </Tab>
            <Tab heading="Tab3">
              <Contain3 />
            </Tab>
          </Tabs>
          {/*<Content showsVerticalScrollIndicator={false}>
            {this.state.Page===1?<Contain1 navigation={navigation}/>:this.state.Page===2?<Contain2 />:<Contain3 />}
          </Content>*/}
          <Footer style={{
            height : 65 ,
          }}>
            <FooterTab style={{
              backgroundColor : "#F9F9F9" ,
              height : 65 ,

            }}>
              <Button vertical
                      onPress={()=>{
                        this.setState({
                          Page:1,
                          activeColor_1:'#D33E42',
                          activeColor_2:'#7D7D7D',
                          activeColor_3:'#7D7D7D',
                          activeIcon_1:'pencil-box',
                          activeIcon_2:'eye-outline',
                          activeIcon_3:'book',
                        })
                      }}>
                <FooterIcon name={this.state.activeIcon_1} style={{color:this.state.activeColor_1, fontSize : 30}}/>
                <Text style={{color:this.state.activeColor_1}}>自测</Text>
              </Button>
              <Button vertical
                      onPress={()=>{
                        this.setState({
                          Page:2,
                          activeColor_1:'#7D7D7D',
                          activeColor_2:'#D33E42',
                          activeColor_3:'#7D7D7D',
                          activeIcon_1:'pencil',
                          activeIcon_2:'eye',
                          activeIcon_3:'book',
                        })
                      }}>
                <FooterIcon name={this.state.activeIcon_2} style={{color:this.state.activeColor_2, fontSize : 30}}/>
                <Text style={{color:this.state.activeColor_2}}>知识</Text>
              </Button>
              <Button vertical
                      onPress={()=>{
                        this.setState({
                          Page:3,
                          activeColor_1:'#7D7D7D',
                          activeColor_2:'#7D7D7D',
                          activeColor_3:'#D33E42',
                          activeIcon_1:'pencil',
                          activeIcon_2:'eye-outline',
                          activeIcon_3:'book-open',
                        })
                      }}>
                <FooterIcon name={this.state.activeIcon_3} style={{color:this.state.activeColor_3, fontSize : 30}}/>
                <Text style={{color:this.state.activeColor_3}}>待定</Text>
              </Button>
            </FooterTab>
          </Footer>
          <Toast
              ref="warning"
              style={{
                backgroundColor : '#D33E42',
                paddingTop : 5,
                paddingBottom : 5
              }}
              position='bottom'
              positionValue={200}
              fadeInDuration={0}
              fadeOutDuration={1000}
              opacity={1}
              textStyle={{color : 'white'}}
          />
          <Toast
              ref="info"
              style={{
                backgroundColor : 'black',
                paddingTop : 5,
                paddingBottom : 5
              }}
              position='bottom'
              positionValue={200}
              fadeInDuration={0}
              fadeOutDuration={1000}
              opacity={1}
              textStyle={{color : 'white'}}
          />
        </Container>
        </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  centerLayOut: {
    display: 'flex' ,
    flexDirection: 'row' ,
    justifyContent: 'center' ,
    alignItems: 'center'
  } ,
  iconStyle: {
    color:'#7D7D7D',
    fontSize:30,
  },
  FooterTab:{
    backgroundColor : '#F9F9F9',
    display : 'flex',
    flexDirection : 'column'

  }
});
