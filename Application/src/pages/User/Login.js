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
    Label,
    Left,
    Body,
    Right,
    Title,
    Icon,
    Button,
    Row,
    Col,
    Grid,

} from "native-base";
import server from "../../server";
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import AsyncStorage from '@react-native-community/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast';
import {
    NavigationActions,
    StackActions
} from "react-navigation";



const screenW = Dimensions.get('window').width;
const screenH = Dimensions.get('window').height-60;

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : "",
            password : "",
            seeing : false,
            //showlog : "true",
        }
    }

    static navigationOptions = () => {
        return {
            title : '账户登录',
            headerStyle : {
                backgroundColor : '#D33E42',
            },
            headerTintColor : '#fff',
            headerTitleStyle : {
                fontWeight : 'normal',
                textAlign : 'center',
            },
        };
    };


    componentDidMount() {
        this.getData(); //cookie
    }

    getData = async () => {
        try {
            const _username = await AsyncStorage.getItem('@username');
            const _token = await AsyncStorage.getItem('@token');
            //const _showlog = await AsyncStorage.getItem('@showlog');
            /*if (_showlog !== null) {
                this.setState({
                    showlog : _showlog,
                });
                this.state.showlog = _showlog;
            }*/
            if (_username !== null) {
                this.setState({
                    username : _username,
                });
            }
            if (_token !== null){
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
                            if(Json.identity==='user'){
                                this.refs.info.show("登录成功，欢迎"+Json.data.username, 5000);
                                this.props.navigation.dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Main',params:{user: Json.data }})],
                                }));
                            }
                            if(Json.identity==='admin'){
                                this.refs.warning.show("暂不支持管理员登录", 5000);
                            }
                        }
                        if (Json.status === 'failure') {
                            this.refs.warning.show(Json.reason, 5000);
                        }
                    }).catch((e) => {
                    this.refs.warning.show("服务器连接失败", 5000);
                    MyLoadingUtil.dismissLoading();
                });
            }
            /*if (this.state.showlog === "true") {
                this.showalert();
            }*/
        } catch (e) {
        }
    };


    login() {
        MyLoadingUtil.showLoading();
        let formdata = new FormData();
        formdata.append("operation", "login");
        formdata.append("username", this.state.username);
        formdata.append("telephone", this.state.username);
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
                    this.refs.info.show("登录成功，欢迎"+Json.data.username, 5000);
                    this.storeData(Json.token, Json.data.username, Json.data.telephone);
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Main',params:{user: Json.data }})],
                    }));
                }
                if (Json.status === 'failure') {
                    this.refs.warning.show(Json.reason, 5000);
                }
            }).catch((e) => {
                this.refs.warning.show("服务器连接失败", 5000);
                MyLoadingUtil.dismissLoading();
        });
    }

    storeData = async (token, username, phone) => {
        const first = ["@username", username];
        const second = ["@token", token];
        const third = ["@phone", phone];
        //const showlog = ["@showlog", "false"];
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
                    <Item style={{margin : 5}}>
                        <Icon active type="AntDesign" name="user" style={{
                            fontSize : 30,
                            color : "#95a5a6"
                        }}/>
                        <Input placeholder='请输入您的手机号/用户名'
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
                            disabled={!this.state.username || !this.state.password}
                            style={{
                                margin : 15,
                                width : 200
                            }}
                            onPress={() => {
                                //if(this.state.showlog==="false")
                                this.login();
                                //else this.showalert()
                            }}
                    >
                        <Text style={{
                            fontSize : 18,
                            color : "white"
                        }}>登 录</Text>
                    </Button>
                </View>
                <Row>
                    <Left>
                        <Button transparent light style={{}}
                            onPress={()=>{this.props.navigation.navigate("FindBack")}}
                        >
                            <Text style={{
                                fontSize : 16,
                                color : "#66A2FF"
                            }}>忘记密码？</Text>
                        </Button>
                    </Left>
                    <Right>
                        <Button transparent light style={{}}
                                onPress={() => {
                                    this.props.navigation.navigate("Regist");
                                }}
                        >
                            <Text style={{
                                fontSize : 18,
                                color : "#66A2FF"
                            }}>注册新账户</Text>
                        </Button>
                    </Right>
                </Row>
                <Row/>
                <Row/>
            </View>
            <View style={{
                marginTop : 20,
                marginBottom: 30,
                alignItems : 'center',
                flexDirection : 'column'
            }}>

                <Button info bordered rounded small
                    onPress={()=>{this.props.navigation.navigate("SmsLogin")}}
                >
                    <Text style={{color : "#4D93FF"}}>短信验证登录</Text>
                </Button>


                <Text style={{
                    color : "#4D93FF",
                    fontSize : 16
                }}
                      onPress={() => {
                          //this.props.navigation.navigate("Readme")
                      }}
                >
                    《用户协议与隐私政策》
                </Text>


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


    /*showalert(){
        Alert.alert(
            '',
            '初次使用，请仔细阅读《智能钢筋用户协议与隐私政策》。如您同意，请点击“同意”开始接受我们的服务。',
            [
                {text: '阅读详情', onPress: () => this.props.navigation.navigate("Readme")},
                {text: '暂不使用', onPress: () => BackHandler.exitApp(), style: 'cancel'},
                {text: '同意', onPress: () => this.setState({showlog:"false"})},
            ],
           { cancelable: false }
        )
    }*/
}
