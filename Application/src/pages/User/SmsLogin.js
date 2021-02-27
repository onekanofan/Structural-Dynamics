import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    Dimensions,
    TextInput,
    Alert,
    BackHandler,
    Image,
    ScrollView
} from "react-native"
import {
    Input,
    Text,
    Header,
    Container,
    Content,
    Form,
    Item,
    Icon,
    Button,

} from "native-base";
import server from "../../server";
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import Toast, { DURATION } from 'react-native-easy-toast';
import CountDownText from "../../myclass/CountDownText";
import {
    NavigationActions,
    StackActions
} from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";



const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height-60;

let Fheight = Dimensions.get ('window').height;
let Fwidth = Dimensions.get ('window').width;

export default class SmsLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restime : 60,
            issending : false,
            correct : "",
            phonelock : false,
            getting : false,
            smscode : "",
            telephone : "",
        }
    }

    static navigationOptions = () => {
        return {
            title : '短信验证登录',
            headerStyle : {
                backgroundColor : '#D33E42',
            },
            headerTintColor : '#fff',
            headerTitleStyle : {
                fontWeight : 'normal',
            },
        };
    };


    componentDidMount() {
        this.getData();
    }
    getData = async () => {
        try {
            const _phone = await AsyncStorage.getItem('@phone');
            if (_phone !== null) {
                this.setState({
                    telephone : _phone,
                });
            }
        } catch (e) {
        }
    };

    sendsms(phone) {
        if (/^1[3456789]\d{9}$/.test(phone)) {      //匹配正确的手机格式
            this.setState({issending:true});
            let formdata = new FormData();
            formdata.append("telephone", phone);
            fetch(server + 'verification_code', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                body : formdata
            }).then((response) => response.json())
                .then((response) => {
                    if(response.status==='success'){
                        this.setState({
                            correct : response.verification_code,
                            getting : true,
                            phonelock : true,
                            issending: false
                        });
                        this.refs.info.show("验证码已发送，注意查收", 5000);
                    }
                    else{
                        this.refs.warning.show(response.reason, 5000);
                    }
                }).catch(e => {
                this.refs.warning.show("服务器无响应", 5000);

            })
        } else{
            this.refs.warning.show("请输入正确的手机号格式", 5000);
        }
    }

    login(){
        const phone = this.state.telephone;
        const smscode = this.state.smscode;
        if (smscode === this.state.correct) {       //注册操作
            MyLoadingUtil.showLoading();
            let formdataRegist = new FormData();
            formdataRegist.append("operation", "login");
            formdataRegist.append("verification_code_access", "True");
            formdataRegist.append("telephone", phone);
            fetch(server + 'user', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                body : formdataRegist
            })
                .then((response) => response.json())
                .then((Json) => {
                    MyLoadingUtil.dismissLoading();
                    if (Json.status === 'success'){     //登录操作，在注册成功后自动登录
                        this.refs.info.show("登录成功", 5000);
                        this.storeData(Json.token, Json.data.username, Json.data.telephone);
                        this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Main',params:{user: Json.data }})],
                        }));
                    }else {
                        this.refs.warning.show(Json.reason, 5000);
                    }
                })
                .catch((error) => {
                    MyLoadingUtil.dismissLoading();
                    this.refs.warning.show("网络连接失败", 5000);
                });
        } else{
            this.refs.warning.show("验证码错误", 5000);
        }
    };

    storeData = async (token, username, phone) => {
        const first = ["@username", username];
        const second = ["@token", token];
        const third = ["@phone", phone];
        try {
            await AsyncStorage.multiSet([first, second, third]);
        } catch (e) {
        }
    };

    render() {
        return (<ScrollView>
            <View  style={{minHeight:Fheight-60}}>
                <View style={{
                    margin : 10,
                    marginBottom: 0,
                    alignItems : 'center',
                    flexDirection : 'column'
                }}>
                    <Image source={require("../../icon/Icon.png")} style={{width:200,height:200,borderRadius:10}}/>
                    <Text style={{
                        fontSize : 17,
                        color : 'black',
                        marginTop: 10
                    }}>欢迎使用</Text>
                </View>
                <Form style={{
                    margin : 15,
                    marginLeft : 5,
                    marginTop : 10
                }}>
                    <Item>
                        <Icon active type="AntDesign" name="mobile1" style={{
                            fontSize : 30,
                            color : "#95a5a6"
                        }}/>
                        <Input placeholder='请输入您的手机号'
                               blurOnSubmit={true}
                               placeholderTextColor="#95a5a6"
                               multiline={false}
                               style={{
                                   fontSize : 16,
                                   color : this.state.phonelock?"#95a5a6":"black"
                               }}
                               keyboardType="numeric"
                               maxLength={11}
                               value={this.state.telephone}
                               onChangeText={(txt) => {
                                   this.setState({telephone : txt.replace(/\D/g,'')})
                               }}
                               editable={!this.state.phonelock}
                        />
                        {this.state.phonelock?<Text style={{marginRight:10,color:'#3498db'}}>已锁定</Text>:<></>}
                    </Item>
                    <Item>
                        <Icon active type="MaterialIcons" name="sms" style={{
                            fontSize : 30,
                            color : "#95a5a6"
                        }}/>
                        <Input placeholder='请输入短信验证码'
                               placeholderTextColor="#95a5a6"
                               style={{
                                   fontSize : 16,
                                   color : "black"
                               }}
                               keyboardType="numeric"
                               maxLength={6}
                               value={this.state.smscode}
                               onChangeText={(txt) => {
                                   this.setState({smscode : txt.replace(/\D/g,'')})
                               }}
                        />

                        {this.state.getting ?
                            <Button disabled rounded small light style={{opacity:0.6}}>
                                <CountDownText // 倒计时
                                    style={{color:"#3498DB"}}
                                    countType='seconds' // 计时类型：seconds / date
                                    auto={true} // 自动开始
                                    afterEnd={() => {this.setState({getting:false})}} // 结束回调
                                    timeLeft={60} // 正向计时 时间起点为0秒
                                    step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                    startText='获取验证码' // 开始的文本
                                    endText='获取验证码' // 结束的文本
                                    intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                                />
                            </Button> : <Button rounded small info
                                                onPress={() => {
                                                    this.sendsms(this.state.telephone)
                                                }}
                                                disabled={this.state.issending}
                            >
                                <Text style={{color : "white"}}>{this.state.issending ? '发送中' : '获取验证码'}</Text>
                            </Button>}
                    </Item>
                </Form>
                <View style={{
                    justifyContent : 'center',
                    flexDirection : 'row',
                    marginBottom : 15
                }}>

                    <Button block info
                            disabled={!this.state.telephone || !this.state.smscode}
                            style={{
                                margin : 15,
                                width : 200
                            }}
                            onPress={() => {
                                this.login();
                            }}
                    >
                        <Text style={{
                            fontSize : 18,
                            color : "white"
                        }}>登 录</Text>
                    </Button>
                </View>
            </View>

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
        </ScrollView>);
    }
}
