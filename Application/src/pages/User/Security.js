import React, { Component }  from 'react';
import {
    View,
    StyleSheet,
    Image,
    Alert,
    ToastAndroid,
    TextInput,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableNativeFeedback
} from 'react-native';
import { Container, Header, Content, List, ListItem,Button,Left,Right,
    Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {
    NavigationActions,
    StackActions
} from "react-navigation";
import Entypo from 'react-native-vector-icons/Entypo';

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
});

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: '账户与安全',
        headerStyle: {
            backgroundColor: '#D33E42',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'normal',
        },

    };

    render() {
        const navigation=this.props.navigation;
        return (
            <Container style={{backgroundColor : '#eee'}}>
                <Content style={{marginTop:10}}>
                    <List>
                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate("MdPhone")}>
                            <ListItem last style={[styles.betweenLayOut]}>
                                <Text>修改绑定手机</Text>
                                <Entypo name='chevron-right' style={{
                                    fontSize : 24,
                                    color : '#b2bec3',
                                }}/>
                            </ListItem>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate("MdPassW")}>
                            <ListItem last style={[styles.betweenLayOut]}>
                                <Text>修改登录密码</Text>
                                <Entypo name='chevron-right' style={{
                                    fontSize : 24,
                                    color : '#b2bec3',
                                }}/>
                            </ListItem>
                        </TouchableWithoutFeedback>
                    </List>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    betweenLayOut: {
        display: 'flex' ,
        flexDirection: 'row' ,
        justifyContent: 'space-between' ,
        alignItems: 'center',
        backgroundColor : 'white'
    } ,

    Info:{
        color:'#7f8c8d',
        marginRight:10
    }
});
