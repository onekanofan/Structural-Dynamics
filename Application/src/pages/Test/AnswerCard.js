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
} from 'native-base';

import Entypo from 'react-native-vector-icons/Entypo';

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;
const screenH = Dimensions.get('window').height - 60;
import AsyncStorage from '@react-native-community/async-storage';
import HTMLView from "react-native-htmlview";

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            return i;
        }
    }
    return -1;
};
// 通过索引删除数组元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

let data;
let tmpCards = [];


export default class Test extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title : "答题卡",
            headerStyle : {
                backgroundColor : '#D33E42',
            },
            headerTintColor : '#fff',
            headerTitleStyle : {
                fontWeight : 'normal',
            },
        };
    };
    state={
        answerCard : this.props.navigation.getParam('card', []),
    };

    ifFinished(item) {
        if (item.type === 'single' && item.response.length) return 1;
        if (item.type === 'calcu') return 1;
        if (item.type === 'multiple' && item.response.length > 1) return 1;
        if (item.type === 'blank') {
            for (let i in item.response) {
                if (item.response[i] !== '') continue;
                return 0;
            }
            console.log("1");
            return 1;
        }
        return 0;
    }

    componentDidMount() {
        /*console.log(this.state.answerCard);*/
    };

    resultView(item){
        if(item.type==='calcu') return '#3498db';       //计算题默认完成 显示蓝色
        if(item.type==='blank'){
            for(let i in item.answer){
                if(item.answer[i]!==item.response[i]) return '#e74c3c';
            }
            return '#2ecc71';
        }
        if(item.type==='single'||item.type==='multiple'){
            if(item.answer.sort().toString()===item.response.sort().toString()) return '#2ecc71';
            else return '#e74c3c';
        }
    }

    render() {
        const navigation = this.props.navigation;

        return (<Container>
            <ScrollView>
                <Text style={{
                    textAlign : 'center',
                    paddingTop : 20,
                    color : '#b2bec3'
                }}>点击序号可切换题目</Text>
                <View style={{
                    flexDirection : 'row',
                    justifyContent : 'center',
                    alignItems : 'center',
                    flexWrap : 'wrap',
                    padding : 30,
                    paddingTop : 10,
                    paddingBottom : 0
                }}>
                    {this.state.answerCard.map((item, index) => {
                        return (<TouchableOpacity key={index} onPress={()=>{
                                navigation.goBack();
                                navigation.state.params.onLocation({ CurrentPage: index });
                            }}>
                                <View
                                    style={[styles.dot, {borderColor : this.ifFinished(item) ? this.resultView(item) :'#3498db',
                                        backgroundColor : this.ifFinished(item) ? this.resultView(item) : 'white'}]}>
                                    <Text style={{
                                        color : this.ifFinished(item) ? 'white' : 'black',
                                        fontSize : 16
                                    }}>{index + 1}</Text></View>
                            </TouchableOpacity>

                        )
                    })}
                </View>
                {/*<View style={{
                    marginTop : 10,
                    marginBottom : 20,
                    flexDirection : 'row',
                    justifyContent : 'center',
                    alignItems : 'center',
                    flexWrap : 'wrap',
                }}>
                    <Button style={{
                        height : 36,
                        paddingLeft : 10,
                        paddingRight : 10,
                        backgroundColor : '#3498db'
                    }}
                            onPress={() => {
                                let jud = 1;
                                for (let item = 0; item < this.state.answerCard.length; item++) {
                                    if (this.ifFinished(this.state.answerCard[item])) continue;
                                    Alert.alert('操作确认', '还有尚未完成的题目，确定要提交吗？', [{
                                        text : '取消',
                                    }, {
                                        text : '提交',
                                        style : {styles},
                                        onPress : () => {
                                            ToastAndroid.show('正在提交...', ToastAndroid.SHORT);
                                            navigation.navigate("exercises_result", {
                                                question : data,
                                                answer : this.state.answerCard
                                            });
                                        }
                                    },], {
                                        cancelable : true,
                                    });
                                    return;
                                }
                                Alert.alert('操作确认', '确定要提交吗？', [{
                                    text : '取消',
                                }, {
                                    text : '提交',
                                    style : {styles},
                                    onPress : () => {
                                        ToastAndroid.show('正在提交...', ToastAndroid.SHORT);
                                        navigation.navigate("exercises_result", {
                                            question : data,
                                            answer : this.state.answerCard
                                        });
                                    }
                                },], {
                                    cancelable : false,
                                });
                            }}>
                        <Text style={{
                            fontSize : 17,
                            color : 'white'
                        }}>提交</Text>
                    </Button>
                </View>*/}
            </ScrollView>
        </Container>)
    }
}
const styles = StyleSheet.create({

    dot : {
        borderRadius : 16,
        width : 32,
        height : 32,
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 1,
        margin : 8
    },
    button : {
        color : 'black'
    }
});

