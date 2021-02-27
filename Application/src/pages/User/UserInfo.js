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
    ScrollView,
} from 'react-native';
import {
    Container,
    Content,
    List,
    ListItem,
    Text,
    Button
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {
    NavigationActions,
    StackActions
} from "react-navigation";
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from "react-native-image-crop-picker";
import server from "../../server";
import Toast from "react-native-easy-toast";


const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get ('window').width - 2 * windowPadding;
let Fheight = Dimensions.get ('window').height;
let Fwidth = Dimensions.get ('window').width;


const resetAction = StackActions.reset ({
    index : 0,
    actions : [NavigationActions.navigate ({routeName : 'Login'})],
});

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title : '我的信息',
        headerStyle : {
            backgroundColor : '#D33E42',
        },
        headerTintColor : '#fff',
        headerTitleStyle : {
            fontWeight : 'normal',
        },
    };
    state = {
        username : '',
        user: {},
        token : '',
        Chead : false,
        CUsername : false
    };

    componentDidMount() {
        this.getToken ();
    };

    componentWillUnmount() {
        this.props.navigation.state.params.callBack();
    }

    CUsername(text) {
        this.setState ({
            username : text
        });
    }

    storeData = async (username) => {
        try {
            await AsyncStorage.setItem('@username', username)
        } catch (e) {
            // saving error
        }
    };

    ImageUpdate = (image) => {
        MyLoadingUtil.showLoading();
        let ary= image.path.split('/');
        let file = {uri: image.path, type: 'multipart/form-data', name: ary[ary.length-1]};
        let formdata = new FormData ();
        formdata.append ("image", file);
        formdata.append ("operation", "modify_other_information");
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
                console.log(resp);
                MyLoadingUtil.dismissLoading();
                if (resp.status === 'success') {
                    this.refs.info.show("修改成功", 5000);
                    this.setState({
                        Chead: false,
                        user: resp.data,
                    })
                } else{
                    this.refs.warning.show("修改失败："+resp.error, 5000);
                }
            })
    };

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
                                user: Json.data,
                                token : value,
                                username : Json.data.username
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

    render() {
        const navigation = this.props.navigation;
        return (<Container style={{backgroundColor : '#eee'}}>

                <Content style={{
                    marginTop : 10,
                    backgroundColor : 'white'
                }}>
                    <List>
                        <TouchableWithoutFeedback onPress={() => this.setState({Chead: true})}>
                            <ListItem last style={[styles.betweenLayOut]}>
                                <Text>头像</Text>
                                <View style={[styles.betweenLayOut]}>
                                    <Image source={{uri : this.state.user.image}} style={{
                                        height : 44,
                                        width : 44,
                                        borderRadius : 22,
                                        marginRight : 10
                                    }}/>
                                    <Entypo name='chevron-right' style={{
                                        fontSize : 24,
                                        color : '#b2bec3',
                                    }}/>
                                </View>
                            </ListItem>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.setState({CUsername: true})}>
                        <ListItem last style={[styles.betweenLayOut]}>
                            <Text>昵称</Text>
                            <View style={[styles.betweenLayOut]}>
                                <Text style={[styles.Info]}>{this.state.user.username}</Text>
                                <Entypo name='chevron-right' style={{
                                    fontSize : 24,
                                    color : '#b2bec3',
                                }}/>
                            </View>
                        </ListItem>
                        </TouchableWithoutFeedback>
                        <ListItem last style={[styles.betweenLayOut]}>
                            <Text>学号</Text>
                            <Text style={[styles.Info]}>{this.state.user.user_id}</Text>
                        </ListItem>
                        <ListItem last style={[styles.betweenLayOut]}>
                            <Text>手机</Text>
                            <Text style={[styles.Info]}>{this.state.user.telephone}</Text>
                        </ListItem>
                        <ListItem last style={[styles.betweenLayOut]}>
                            <Text>注册时间</Text>
                            <Text style={[styles.Info]}>{this.state.user.registration_time}</Text>
                        </ListItem>
                    </List>
                </Content>
                {this.state.Chead ?
                    <TouchableWithoutFeedback onPress={() => this.setState({Chead: false})}>

                    <View style={{
                    flex : 1,
                    width : Fwidth,
                    height : Fheight,
                    position : 'absolute',
                    backgroundColor : '#10101099',
                }}>
                    <List style={{
                        width : 240,
                        backgroundColor : '#fff',
                        borderRadius : 2,
                        position : 'absolute',
                        zIndex: 99,
                        top : (Fheight - 200) / 2,
                        left : (Fwidth - 240) / 2,
                    }}>
                        <TouchableNativeFeedback onPress={() => ImagePicker.openCamera({
                            cropping: true ,
                            freeStyleCropEnabled:true,
                            compressImageMaxWidth:500,
                            compressImageMaxHeight:500
                        }).then((image) => this.ImageUpdate(image))}>
                        <View last style={[styles.alertStyle, {
                            borderBottomWidth : 1,
                            borderColor : '#ccc'
                        }]}>
                            <Text style={{fontSize : 18}}>拍摄照片</Text>
                        </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={() => ImagePicker.openPicker ({
                            cropping : true,
                            freeStyleCropEnabled:true,
                            compressImageMaxWidth : 500,
                            compressImageMaxHeight : 500
                        }).then ((image) => this.ImageUpdate(image))}>
                            <View last style={[styles.alertStyle]}>
                                <Text style={{fontSize : 18}}>从相册选择</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </List>
                </View>
                    </TouchableWithoutFeedback>: <></>}
            {this.state.CUsername?
                    <View style={{
                        flex : 1,
                        width : Fwidth,
                        height : Fheight,
                        position : 'absolute',
                        backgroundColor : '#10101099',
                    }}>
                        <View style={{
                            width : 240,
                            height : 150,
                            backgroundColor : '#fff',
                            borderRadius : 2,
                            position : 'absolute',
                            zIndex: 99,
                            top : (Fheight - 300) / 2,
                            left : (Fwidth - 240) / 2,
                        }}>
                            <Text style={{textAlign:'center',margin:10,fontSize:17,color:"#00a8ff"}}>
                                修改用户昵称
                            </Text>
                            <View style={{display:"flex",flexDirection:'row',padding:10}}>
                                <AntDesign name='user' style={{
                                    fontSize : 30,
                                    color : 'black',
                                }}/>
                                <TextInput onChangeText={text => this.CUsername(text)}
                                           value={this.state.username}
                                           style={{
                                               fontSize : 16,
                                               borderBottomWidth : 1,
                                               borderBottomColor : '#bdc3c7',
                                               padding : 0,
                                               width : 180
                                           }}
                                           selectTextOnFocus={true}     //获得焦点时全选文字
                                />
                            </View>
                            <View style={{display:"flex",flexDirection:'row',justifyContent:'space-around',alignItems:'center',padding:10}}>
                                <Button bordered danger style={{height:30}} onPress={() => this.setState({CUsername: false})}>
                                    <Text>取消</Text>
                                </Button>
                                <Button bordered info style={{height:30}} onPress={() => {
                                    MyLoadingUtil.showLoading();
                                    let formdata = new FormData ();
                                    formdata.append ("username", this.state.username);
                                    formdata.append ("operation", "modify_other_information");
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
                                            MyLoadingUtil.dismissLoading();
                                            if (resp.status === 'success') {
                                                this.refs.info.show("修改成功", 5000);
                                                this.setState({
                                                    CUsername: false,
                                                    user: resp.data,
                                                    username : resp.data.username
                                                });
                                                this.storeData(resp.data.username);
                                            } else{
                                                this.refs.warning.show("修改失败："+resp.error, 5000);
                                            }
                                        })
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
            </Container>);
    }
}

const styles = StyleSheet.create ({
    betweenLayOut : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
    },

    alertStyle : {
        width : 240,
        height : 50,
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    },

    Info : {
        color : '#7f8c8d',
        marginRight : 10
    }
});
