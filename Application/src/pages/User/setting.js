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
        title: '设置',
        headerStyle: {
            backgroundColor: '#D33E42',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'normal',
        },

    };

    async RemoveAccount(navigation) {
        try {
            await AsyncStorage.removeItem('@token');
            navigation.dispatch(resetAction);
        } catch(err) {
        }
    }
    render() {
        const navigation=this.props.navigation;
        return (
            <Container style={{backgroundColor : '#eee'}}>
                <Content style={{marginTop:10}}>
                    <List>
                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate("Security")}>
                            <ListItem last style={[styles.betweenLayOut]}>
                                <Text>账号与安全</Text>
                                <Entypo name='chevron-right' style={{
                                    fontSize : 24,
                                    color : '#b2bec3',
                                }}/>
                            </ListItem>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate("Feedback")}>
                            <ListItem last style={[styles.betweenLayOut,{marginTop:10}]}>
                                <Text>用户反馈</Text>
                                <Entypo name='chevron-right' style={{
                                    fontSize : 24,
                                    color : '#b2bec3',
                                }}/>
                            </ListItem>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>console.log("2")}>
                            <ListItem last style={[styles.betweenLayOut]}>
                                <Text>关于结构动力学</Text>
                                <Entypo name='chevron-right' style={{
                                    fontSize : 24,
                                    color : '#b2bec3',
                                }}/>
                            </ListItem>
                        </TouchableWithoutFeedback>
                        <TouchableNativeFeedback onPress={()=>{
                            Alert.alert('操作确认',
                                '确定要注销账号吗？',
                                [
                                    {
                                        text: '取消',
                                    },
                                    {
                                        text: '确定',
                                        onPress: () => {
                                            this.RemoveAccount(navigation);
                                        }
                                    },
                                ],
                                {
                                    cancelable: false,
                                });
                        }}>
                            <ListItem last style={{backgroundColor:'white',marginTop:20,display:'flex',justifyContent : 'center'}}>
                                <Text style={{fontSize:18,color:'#e74c3c'}}>退出登录</Text>
                            </ListItem>
                        </TouchableNativeFeedback>
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
