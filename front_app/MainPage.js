
import React , { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
  Container ,
  Header ,
  Content ,
  Footer ,
  FooterTab ,
  Button ,
  Left ,
  Body ,
  Right ,
  Text ,
  StyleProvider
} from 'native-base';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';//自定义组件

import FooterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppIcon from 'react-native-vector-icons/FontAwesome';

import Search from "./src/Knowledgement/Header";
import Contain1 from "./src/Knowledgement/container";
import Contain2 from "./src/Test/container";
import Contain3 from "./src/Expand/container";

export default class FooterTabsIconTextExample extends Component {
  state={
    Page:1,
    activeColor_1:'#D33E42',
    activeColor_2:'#7D7D7D',
    activeColor_3:'#7D7D7D',
    activeIcon_1:'book-open',
    activeIcon_2:'pencil',
    activeIcon_3:'eye-outline',
  }
  render() {
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
              {this.state.Page===1?<Search />:<Text style={{color : 'white',fontSize : 20,fontWeight:'bold'}}>结构动力学</Text>}
            </Body>
            <Right>
              <AppIcon name="user-circle"
                style={{
                  color : 'white',
                  fontSize: 40
                }}
              ></AppIcon>
            </Right>
          </Header>
          <Content showsVerticalScrollIndicator={false}>
            {this.state.Page===1?<Contain1 />:this.state.Page===2?<Contain2 />:<Contain3 />}
          </Content>
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
                          activeIcon_1:'book-open',
                          activeIcon_2:'pencil',
                          activeIcon_3:'eye-outline',
                        })
                      }}>
                <FooterIcon name={this.state.activeIcon_1} style={{color:this.state.activeColor_1, fontSize : 30}}/>
                <Text style={{color:this.state.activeColor_1}}>知识点</Text>
              </Button>
              <Button vertical
                      onPress={()=>{
                        this.setState({
                          Page:2,
                          activeColor_1:'#7D7D7D',
                          activeColor_2:'#D33E42',
                          activeColor_3:'#7D7D7D',
                          activeIcon_1:'book',
                          activeIcon_2:'pencil-box',
                          activeIcon_3:'eye-outline',
                        })
                      }}>
                <FooterIcon name={this.state.activeIcon_2} style={{color:this.state.activeColor_2, fontSize : 30}}/>
                <Text style={{color:this.state.activeColor_2}}>自测题</Text>
              </Button>
              <Button vertical
                      onPress={()=>{
                        this.setState({
                          Page:3,
                          activeColor_1:'#7D7D7D',
                          activeColor_2:'#7D7D7D',
                          activeColor_3:'#D33E42',
                          activeIcon_1:'book',
                          activeIcon_2:'pencil',
                          activeIcon_3:'eye',
                        })
                      }}>
                <FooterIcon name={this.state.activeIcon_3} style={{color:this.state.activeColor_3, fontSize : 30}}/>
                <Text style={{color:this.state.activeColor_3}}>见生活</Text>
              </Button>
            </FooterTab>
          </Footer>
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
  }
});
