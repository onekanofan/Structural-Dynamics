import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    Dimensions,
    TextInput,
    Alert,
    BackHandler,
    Image,
    ScrollView,
    StyleSheet
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
import server from "../../../server";
import MyLoadingUtil from "../../../myclass/MyLoadingUtil";
import Toast, { DURATION } from 'react-native-easy-toast';
import CountDownText from "../../../myclass/CountDownText";
import {
    NavigationActions,
    StackActions
} from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;
let Fheight = Dimensions.get ('window').height;
let Fwidth = Dimensions.get ('window').width;

let timer;


export default class MdPassW extends React.Component {
    static navigationOptions = {
        title: '修改密码',
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
            restime : 60,
            issending : false,
            correct : "",
            getting : false,
            smscode : "",
            telephone : "",
            token : "",
            seeing: false,
            password:''
        }
    }


    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem ('@token');
            this.setState({
                token: value
            });
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
                                telephone: Json.data.telephone,
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

    componentDidMount() {
        this.getToken();
    }

    Submit(){
        const phone=this.state.telephone;
        const password = this.state.password;
        const smscode = this.state.smscode;
        if (smscode === this.state.correct) {
            MyLoadingUtil.showLoading();
            let formdata = new FormData ();
            formdata.append("operation", "change_password");
            formdata.append("password", password);
            formdata.append("telephone", phone);
            formdata.append("verification_code_access","True");
            fetch (server + 'user', {
                method : "PUT",
                body : formdata,
                headers : {
                    "Content-Type" : "multipart/form-data",
                    "token" : this.state.token
                }
            })
                .then (resp => resp.json ())
                .then (resp => {
                    if (resp.status === 'success') {
                        this.refs.info.show("修改成功，请重新登录", 5000);
                        timer= setTimeout(()=>{
                            MyLoadingUtil.dismissLoading();
                            this.RemoveAccount();
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Login' })],
                            }));
                        },5000);
                    } else{
                        MyLoadingUtil.dismissLoading();
                        this.refs.warning.show("修改失败："+resp.reason, 5000);
                    }
                })
        } else{
            this.refs.warning.show("验证码错误", 5000);
        }
    };

    async RemoveAccount() {
        try {
            await AsyncStorage.removeItem("@token");
        } catch(e) {
        }
    }

    sendsms(phone) {
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
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        timer && clearTimeout(timer);
    }


    render() {
        const navigation=this.props.navigation;
        return (
            <Container style={{backgroundColor : '#eee'}}>
                <Text style={{margin:10,marginLeft:63,marginBottom:0,fontSize:12,color:"#00a8ff"}}>
                    修改密码前需验证您的手机号码
                </Text>
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
                        <View style={[styles.CenterLayOut,{margin:12,marginLeft:5}]}>
                            <Text style={{fontSize:20,color:'#95a5a6'}}>{this.state.telephone}</Text>
                        </View>
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
                    <Item style={{margin : 5}}>
                        <Icon type="AntDesign" name="lock" style={{
                            fontSize : 30,
                            color : "#95a5a6"
                        }}/>
                        <Input placeholder='请输入您的新密码'
                               placeholderTextColor="#95a5a6"
                               style={{
                                   fontSize : 16,
                                   color : "black"
                               }}
                               multiline={false}
                               secureTextEntry={!this.state.seeing}
                               password={!this.state.seeing}
                               selectTextOnFocus={!this.state.seeing}
                               value={this.state.password}
                               onChangeText={(txt) => {
                                   this.setState({password : txt.replace(/[\u4E00-\u9FA5]/g,'')})
                               }}
                        />
                        <Button transparent style={{marginRight : 0}} onPress={() => {
                            this.setState({
                                seeing: !this.state.seeing
                            })
                        }}>
                            {this.state.seeing ? <Icon active type="Entypo" name="eye" style={{color : "#3498db"}}/> :
                                <Icon active type="Entypo" name="eye-with-line" style={{color : "#95a5a6"}}/>}
                        </Button>

                    </Item>
                </Form>
                <View style={{
                    justifyContent : 'center',
                    flexDirection : 'row',
                    marginBottom : 15
                }}>

                    <Button block info
                            disabled={!this.state.smscode}
                            style={{
                                margin : 15,
                                width : 200
                            }}
                            onPress={() => {
                                this.Submit();
                            }}
                    >
                        <Text style={{
                            fontSize : 18,
                            color : "white"
                        }}>修 改</Text>
                    </Button>
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
                        backgroundColor : '#2ecc71',
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

