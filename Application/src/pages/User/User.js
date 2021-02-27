import React, { Component }  from 'react';
import {
    View,
    StyleSheet,
    Image,
    Alert,
    ToastAndroid,
    TextInput,
    Dimensions,
    TouchableNativeFeedback,
    TouchableOpacity
} from 'react-native';
import { Container, Header, Content, List, ListItem,Button,
    Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {
    NavigationActions,
    StackActions
} from "react-navigation";
import {BoxShadow} from 'react-native-shadow';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from "react-native-vector-icons/Ionicons";
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import server from "../../server";

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login' })],
});
let onLocation;
export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: '个人中心',
        headerStyle: {
            backgroundColor: '#D33E42',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'normal',
        },
        headerRight : ({}) => (
            <TouchableOpacity onPress={() => onLocation()}>
                <Icon name="ios-settings" style={{
                    color : '#fff',
                    fontSize : 32,
                    padding : 15
                }}/>
            </TouchableOpacity>
        ),
    };

    constructor(props) {
        super(props);
        onLocation =() =>{
            this.props.navigation.navigate("Settings");
        };
        this.state = ({
            ifChange:false,
            user:{}
        });
    };

    getToken = async () => {
        try {
            const _token = await AsyncStorage.getItem('@token');
            if(_token !== null){
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
            }
        } catch (e) {
        }
    };

    componentDidMount() {
        this.getToken();
    }

    componentWillUnmount() {
        this.props.navigation.state.params.callBack();
    }

    render() {
        const navigation=this.props.navigation;
        return (
            <Container>
                <Content>
                    <BoxShadow setting={{height:130,width:width,color:'#000',border:5,radius:5,opacity:0.1,
                        style:{marginLeft:windowPadding,marginTop:windowPadding}}}>
                        <View style={{height:130,width:width,backgroundColor : '#fff',borderRadius:5,}}>
                            <TouchableNativeFeedback onPress={()=>navigation.navigate("UserInfo",{callBack:this.getToken})}>
                                <View style={{padding:15,height:90,display:'flex',flexDirection : 'row',alignItems : 'center',justifyContent : 'space-around'}}>
                                <Image source={{uri:this.state.user.image}} style={{height: 66, width: 66,borderRadius:33,}}/>
                                <View style={{width:width-120,paddingLeft:10}}>
                                    <Text style={{fontSize:19}}>{this.state.user.username}</Text>
                                    <Text style={{fontSize:14,color:'#e84118'}}>普通用户</Text>
                                </View>
                                <View style={{width:25}}>
                                    <Entypo name='chevron-right' style={{
                                        fontSize : 30,
                                        color : '#718093',
                                    }}/>
                                </View>
                                </View>
                            </TouchableNativeFeedback>
                            <View style={{height:40,display:'flex',flexDirection : 'row',alignItems : 'center',justifyContent : 'space-around'}}>
                                <TouchableOpacity onPress={() => navigation.navigate("Collection")}>
                                <Text style={{color:'#718093',paddingLeft:40,paddingRight:30}}>收藏</Text>
                                </TouchableOpacity>
                                <View style={{width : 0, height : 15, borderWidth : 0.5,borderColor:'#dcdde1'}}/>
                                <Text style={{color:'#718093',paddingLeft:30,paddingRight:40}}>消息</Text>
                            </View>
                        </View>
                    </BoxShadow>
                    <View style={{padding:windowPadding}}>
                    </View>
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
    } ,

    Info:{
        color:'#7f8c8d',
        marginRight:10
    }
});
