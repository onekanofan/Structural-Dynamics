import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    View,
    TextInput,
    ScrollView
} from 'react-native';
import {
    Container,
    Content,
    List,
    ListItem,
    Text,
    Button,
    Input,
    Icon,
    Item
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {
    NavigationActions,
    StackActions
} from "react-navigation";
import MyLoadingUtil from "../../../myclass/MyLoadingUtil";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from "react-native-image-crop-picker";
import server from "../../../server";
import Toast from "react-native-easy-toast";

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;
let Fheight = Dimensions.get ('window').height;
let Fwidth = Dimensions.get ('window').width;


export default class MdPhone extends React.Component {
    static navigationOptions = {
        title: '绑定手机',
        headerStyle: {
            backgroundColor: '#D33E42',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'normal',
        },

    };

    constructor(props) {
        super(props);
        this.state = {
            phone : '',
            Change: false,
            username: '',
            password: ''
        }
    }


    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem ('@token');
            if (value !== null){
                MyLoadingUtil.showLoading();
                fetch(server + 'info', {
                    method : 'POST',
                    headers : {
                        'token' : value
                    },
                })
                    .then((response) => response.json())
                    .then((Json) => {
                        MyLoadingUtil.dismissLoading();
                        if (Json.status === 'success') {
                            this.setState({
                                phone: Json.data.telephone,
                                username: Json.data.username
                            })
                        }
                        if (Json.status === 'failure') {
                            this.refs.warning.show(Json.reason, 5000);
                        }
                    }).catch((e) => {
                    this.refs.warning.show("服务器连接失败", 5000);
                    MyLoadingUtil.dismissLoading();
                });
            }
        } catch (e) {
        }
    };

    ChangePassW(text) {
        this.setState ({
            password : text
        });
    }

    componentDidMount() {
        this.getToken();
    }

    render() {
        const navigation=this.props.navigation;
        return (
            <Container style={{backgroundColor : '#eee'}}>
                <View style={[styles.CenterLayOut]}>
                    <Text style={{fontSize:20,color:'#7f8fa6',margin:10,marginTop:60}}>你的手机号：<Text style={{fontSize:24,color:'#2ecc71'}}>{this.state.phone}</Text></Text>
                </View>
                <View style={[styles.CenterLayOut,{marginTop:20}]}>
                    <Button info onPress={()=>this.setState({Change:true})}><Text>修改手机号</Text></Button>
                </View>
                {this.state.Change?
                    <View style={{
                        flex : 1,
                        width : Fwidth,
                        height : Fheight,
                        position : 'absolute',
                        backgroundColor : '#10101099',
                    }}>
                        <View style={{
                            width : 280,
                            height : 180,
                            backgroundColor : '#fff',
                            borderRadius : 2,
                            position : 'absolute',
                            zIndex: 99,
                            top : (Fheight - 400) / 2,
                            left : (Fwidth - 280) / 2,
                        }}>
                            <Text style={{margin:10,marginLeft:30,fontSize:12,color:"#00a8ff"}}>
                                修改手机号前需输入您的登录密码
                            </Text>
                            <Text style={{margin:10,marginTop:0,marginBottom:0,fontSize:14,color:"#95a5a6"}}>
                                如果您忘记了密码，请先退出登录，通过找回密码功能重新设置密码
                            </Text>
                            <View style={{display:'flex',justifyContent : "center",alignItems : 'center',flexDirection : 'row'}}>
                            <Item style={{margin : 5,width: 240}}>
                                <AntDesign name='key' style={{
                                    fontSize : 30,
                                    color : '#95a5a6',
                                }}/>
                                <Input placeholder='请输入您的密码'
                                       placeholderTextColor="#95a5a6"
                                       style={{
                                           fontSize : 16,
                                           color : "black",
                                       }}
                                       multiline={false}
                                       secureTextEntry={true}
                                       selectTextOnFocus={true}
                                       onChangeText={(txt) => this.ChangePassW(txt)}
                                />
                            </Item>

                            </View>
                            <View style={{display:"flex",flexDirection:'row',justifyContent:'space-around',alignItems:'center',padding:10,paddingTop:5}}>
                                <Button bordered danger style={{height:30}} onPress={() => this.setState({Change: false})}>
                                    <Text>取消</Text>
                                </Button>
                                <Button bordered info style={{height:30}} onPress={() => {
                                    MyLoadingUtil.showLoading();
                                    let formdata = new FormData();
                                    formdata.append("operation", "login");
                                    formdata.append("username", this.state.username);
                                    formdata.append("password", this.state.password);
                                    fetch(server + 'user', {
                                        method : 'POST',
                                        headers : {
                                            'Content-Type' : 'multipart/form-data'
                                        },
                                        body : formdata
                                    })
                                        .then((response) => response.json())
                                        .then((Json) => {
                                            MyLoadingUtil.dismissLoading();
                                            if (Json.status === 'success') {
                                                this.refs.info.show("验证成功", 5000);
                                                this.setState({
                                                    Change: false
                                                });
                                                this.props.navigation.navigate("NewPhone",{phone:this.state.phone});
                                            }
                                            if (Json.status === 'failure') {
                                                MyLoadingUtil.dismissLoading();
                                                this.refs.warning.show(Json.reason, 5000);
                                            }
                                        }).catch((e) => {
                                        this.refs.warning.show("服务器连接失败", 5000);
                                        MyLoadingUtil.dismissLoading();
                                    });
                                }}>
                                    <Text>确定</Text>
                                </Button>
                            </View>

                        </View>
                    </View>

                    : <></>}
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
        );
    }
}

const styles = StyleSheet.create({
    CenterLayOut: {
        display: 'flex' ,
        flexDirection: 'row' ,
        justifyContent: 'center' ,
        alignItems: 'center',
        backgroundColor : '#eee',
    } ,

    Info:{
        color:'#7f8c8d',
        marginRight:10
    }
});
