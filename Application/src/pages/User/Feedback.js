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

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;
let Fheight = Dimensions.get ('window').height;
let Fwidth = Dimensions.get ('window').width;
let userID;
let timer;

export default class NewPhone extends React.Component {
    static navigationOptions = {
        title: '用户反馈',
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
            content : "",
            token : "",
        }
    }

    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem ('@token');
            this.setState({
                token: value
            });
            if (value !== null){
                fetch(server + 'info', {
                    method : 'POST',
                    headers : {
                        'token' : value
                    },
                })
                    .then((response) => response.json())
                    .then((Json) => {
                        if (Json.status === 'success') {
                            if(Json.identity==='user'){
                                userID=Json.data.user_id;
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
        } catch (e) {
        }
    };

    componentDidMount() {
        this.getToken();
    }

    Submit(){
        MyLoadingUtil.showLoading();
        let formdata = new FormData ();
        formdata.append ("feedback_content", this.state.content);
        formdata.append ("user_id", userID);
        fetch (server + 'message', {
            method : "POST",
            body : formdata,
            headers : {
                "Content-Type" : "multipart/form-data",
            }
        })
            .then (resp => resp.json ())
            .then (resp => {
                if (resp.status === 'success') {
                    this.refs.info.show("提交成功，感谢您的反馈", 5000);
                    timer= setTimeout(()=>{
                        MyLoadingUtil.dismissLoading();
                        this.props.navigation.goBack();
                    },5000);
                } else{
                    MyLoadingUtil.dismissLoading();
                    this.refs.warning.show("修改失败："+resp.reason, 5000);
                }
            })
    };

    componentWillUnmount() {
        timer && clearTimeout(timer);
    }

    render() {
        const navigation=this.props.navigation;
        return (
            <Container style={{backgroundColor : '#eee'}}>
                <Form style={{
                    margin : 15,
                    marginLeft : 5,
                    marginTop : 10
                }}>
                    <Text style={{margin:10,marginBottom:0,fontSize:12,color:"#00a8ff"}}>
                        请输入您的反馈内容：
                    </Text>
                    <Item>
                        <Input blurOnSubmit={true}
                               multiline={true}
                               style={{
                                   marginTop: 15,
                                   borderRadius: 4,
                                   fontSize : 16,
                                   color : "black",
                                   backgroundColor : 'white',
                               }}
                               value={this.state.content}
                               onChangeText={(txt) => {
                                   this.setState({content : txt})
                               }}
                        />
                    </Item>
                </Form>
                <View style={{
                    justifyContent : 'center',
                    flexDirection : 'row',
                    marginBottom : 15
                }}>

                    <Button block info
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
                        }}>提 交</Text>
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

