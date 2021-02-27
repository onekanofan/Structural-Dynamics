import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    Dimensions,
    TextInput,
    Alert,
    ScrollView,
    Image
} from "react-native"
import {
    Text,
    Header,
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Left,
    Body,
    Right,
    Title,
    Icon,
    Button,
    Row,
    Radio,
    Col
} from "native-base";
import CountDownText from "../../myclass/CountDownText";
import AsyncStorage from '@react-native-community/async-storage';
import server from "../../server"
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import Toast, { DURATION } from 'react-native-easy-toast';
import {
    NavigationActions,
    StackActions
} from "react-navigation";


const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height;
export default class Regist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            telephone : "",
            smscode : "",
            password : "",
            username : "",
            getting : false,
            seeing : false,
            phonelock : false,
            correct : "",
            restime : 60,
            permit : false,
            issending : false,
        }
    }

    static navigationOptions = () => {
        return {
            title : '账户注册',
            headerStyle : {
                backgroundColor : '#D33E42',
            },
            headerTintColor : '#fff',
            headerTitleStyle : {
                fontWeight : 'normal',
            },
        };
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

    regist() {
        const phone = this.state.telephone;
        const smscode = this.state.smscode;
        const username = this.state.username;
        const password = this.state.password;
        const permit = this.state.permit;
        let success = false;
        if (permit) {
            if (smscode === this.state.correct) {       //注册操作
                MyLoadingUtil.showLoading();
                let formdataRegist = new FormData();
                formdataRegist.append("operation", "regist");
                formdataRegist.append("username", username);
                formdataRegist.append("password", password);
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
                        if (Json.status === 'success'){     //登录操作，在注册成功后自动登录
                            this.refs.info.show("注册成功", 5000);
                            let formdataLogin = new FormData();
                            formdataLogin.append("operation", "login");
                            formdataLogin.append("username", username);
                            formdataLogin.append("password", password);
                            fetch(server + 'user', {
                                method : 'POST',
                                headers : {
                                    'Content-Type' : 'multipart/form-data'
                                },
                                body : formdataLogin
                            })
                                .then((response) => response.json())
                                .then((Json) => {
                                    MyLoadingUtil.dismissLoading();
                                    if (Json.status === 'success') {
                                        this.storeData(Json.token, Json.data.username, Json.data.telephone);
                                        this.props.navigation.dispatch(StackActions.reset({
                                            index: 0,
                                            actions: [NavigationActions.navigate({ routeName: 'Main',params:{user: Json.data }})],
                                        }));
                                    }
                                    if (Json.status === 'failure') {
                                        this.refs.warning.show(Json.reason, 5000);
                                    }
                                }).catch((error) => {
                                MyLoadingUtil.dismissLoading();
                                this.refs.warning.show("网络连接失败", 5000);
                            });
                        }else {
                            MyLoadingUtil.dismissLoading();
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
        } else{
            Alert.alert('温馨提示', '注册前请您认真阅读并同意《智能钢筋计数用户协议与隐私政策》', [{
                text : '好的',
                onPress : () => console.log('OK pressed')
            },])
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
            <View>
                <View style={{
                    margin : 10,
                    marginBottom : 0,
                    alignItems : 'center',
                    flexDirection : 'column'
                }}>
                    <Image source={require("../../icon/Icon.png")} style={{
                        width : 200,
                        height : 200,
                        borderRadius : 10
                    }}/>
                    <Text style={{
                        fontSize : 17,
                        color : 'black',
                        marginTop : 10
                    }}>欢迎新用户</Text>
                </View>
                <Form style={{
                    margin : 15,
                    marginLeft : 5,
                    marginTop : 10
                }}>
                    <Item style={{margin : 5}}>
                        <Icon active type="AntDesign" name="user" style={{
                            fontSize : 30,
                            color : "#95a5a6"
                        }}/>
                        <Input placeholder='请输入您的用户名'
                               placeholderTextColor="#95a5a6"
                               blurOnSubmit={true}
                               multiline={false}
                               style={{
                                   fontSize : 16,
                                   color : "black"
                               }}
                               value={this.state.username}
                               onChangeText={(txt) => {
                                   this.setState({username : txt})
                               }}
                        />
                    </Item>
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
                    <Item style={{margin : 5}}>
                        <Icon type="AntDesign" name="lock" style={{
                            fontSize : 30,
                            color : "#95a5a6"
                        }}/>
                        <Input placeholder='请输入您的密码'
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
                                seeing : !this.state.seeing
                            })
                        }}>
                            {this.state.seeing ? <Icon active type="Entypo" name="eye" style={{color : "#3498db"}}/> :
                                <Icon active type="Entypo" name="eye-with-line" style={{color : "#95a5a6"}}/>}
                        </Button>

                    </Item>
                </Form>

                <View style={{
                    justifyContent : "center",
                    alignItems : "center",
                    flexDirection : "row"
                }}>
                    <Radio
                        color={"black"}
                        selectedColor={"#5cb85c"}
                        selected={this.state.permit}
                        onPress={() => this.setState({
                            permit : !this.state.permit,
                        })}
                    />
                    <Text style={{
                        margin : 5,
                        marginLeft : 10
                    }}>
                        <Text style={{color : "black"}}>
                            同意
                        </Text>
                        <Text style={{color : "#4D93FF"}}
                            /*onPress={() => {
                                this.props.navigation.navigate("Readme")
                            }}*/
                        >
                            《用户协议与隐私政策》
                        </Text>
                    </Text>
                </View>
                <View style={{
                    justifyContent : 'center',
                    flexDirection : 'row',
                    marginBottom : 15
                }}>

                    <Button block info
                            disabled={!this.state.username || !this.state.password || !this.state.smscode || !this.state.smscode || !this.state.permit}
                            style={{
                                margin : 15,
                                width : 200
                            }}
                            onPress={() => {
                                //if(this.state.showlog==="false")
                                this.regist();
                                //else this.showalert()
                            }}
                    >
                        <Text style={{
                            fontSize : 18,
                            color : "white"
                        }}>注 册</Text>
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
