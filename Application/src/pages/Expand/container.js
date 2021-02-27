import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Image,
    Alert,
    ToastAndroid,
    TextInput
} from 'react-native';
import {
    View,
    Footer,
    Right,
    Left,
    ListItem,
    Radio,
    Container,
    Button,
    Tab,
    Tabs,
    TabHeading,
    Icon,
    Header,
    Content,
    Card,
    CardItem,
    Thumbnail,
    Body,
    H3
} from 'native-base';

import HTMLView from 'react-native-htmlview';
import { CachedImage } from "react-native-img-cache";
import server from "../../server"


import Entypo from 'react-native-vector-icons/Entypo';

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;
const screenH = Dimensions.get('window').height - 60;
import AsyncStorage from '@react-native-community/async-storage';

class Cards extends Component {
    render() {
        return (
            <Container>
                <Content>
                    <Card style={{flex: 0,borderRadius:3}}>
                        <CardItem>
                            <Left>
                            <H3>卯榫结构</H3>
                            </Left>
                            <Right>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Text style={{color:'#555',fontSize:13}}>卯榫结构是中国木质古建筑常用的结构，这种结构也常用于家具的制作，如最简单的木质小方凳，其特点是在物件上不使用钉子，利用卯榫加固物件，体现出中国古老的文化和智慧。</Text>
                        </CardItem>
                        <CardItem>
                            <Image source={{uri: 'https://bkimg.cdn.bcebos.com/pic/fcfaaf51f3deb48fdda5ae1ff71f3a292cf57826?x-bce-process=image/watermark,g_7,image_d2F0ZXIvYmFpa2UxODA=,xp_5,yp_5'}}
                                   style={{height: 200, width: 330, flex: 1}}/>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}
export default class Contain3 extends Component{

    constructor(props) {
        super(props);
        this.state = ({
            isLoading : true,
            ifContain : true,
            errorInfo : '',
            content : {}
        });
    };

    getToken = async (Params) => {
        try {
            const value = await AsyncStorage.getItem('@token');
            if (value !== null) {
                let url=server + 'instance/real';
                if (Params) {
                    let paramsArray = [];
                    //拼接参数
                    Object.keys(Params).forEach(key => paramsArray.push(key + '=' + Params[key]));
                    if (url.search(/\?/) === -1) {
                        url += '?' + paramsArray.join('&');
                    } else {
                        url += '&' + paramsArray.join('&');
                    }
                }
                fetch(url, {
                    method : 'GET',
                    headers : {
                        'token' : value,
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status === 'success') {
                            this.setState({
                                isLoading : false,
                                content : responseJson.data
                            });
                        } else{
                            return Promise.reject({
                                e : responseJson.reason,
                            });
                        }
                    }).then((tmpCards) => {
                    this.setState({
                        isLoading : false,
                    });
                })
                    .catch((error) => {
                        if (error.e) {
                            this.setState({
                                isLoading : false,
                                errorInfo : error.e
                            });
                        }
                        return false;
                    });
            }
        } catch (error) {
            // Error retrieving data
        }
    };
    componentDidMount() {
        let defaultParams={
            first_level : "结构动力学概述",
            second_level : "结构动力学分析",
            third_level : "主要目的"
        };
        this.getToken(defaultParams);
    };
    render(){
        /*if (this.state.isLoading) {
            return (<View style={{
                height : screenH,
                display : 'flex',
                flexDirection : 'row',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <ActivityIndicator size={50} color={'#D33E42'}/>
            </View>)
        }
        if (!this.state.ifContain) {
            return (<View style={{
                height : screenH,
                display : 'flex',
                flexDirection : 'row',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style={{
                    textAlign : 'center',
                    fontSize : 20,
                    color : '#95a5a6'
                }}>暂无数据</Text>
            </View>)
        }
        if (this.state.errorInfo) {
            return (<View style={{
                height : screenH,
                display : 'flex',
                flexDirection : 'row',
                justifyContent : 'center',
                alignItems : 'center'
            }}>
                <Text style={{
                    textAlign : 'center',
                    fontSize : 20,
                    color : '#95a5a6'
                }}>{this.state.errorInfo}</Text>
            </View>)
        }*/
        return (
            <ScrollView>
                {/*<HTMLView
                    value={this.state.content.content}
                />*/}
                {/*<Cards></Cards>*/}
                <View style={{
                    height : screenH,
                    display : 'flex',
                    flexDirection : 'row',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                    <Text style={{
                        textAlign : 'center',
                        fontSize : 20,
                        color : '#95a5a6'
                    }}>即将到来</Text>
                </View>
            </ScrollView>
        )
    }
}
