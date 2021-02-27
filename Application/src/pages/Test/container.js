import React, { Component } from 'react';
import {
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {
    Button,
    Card,
    Input,
    Item,
    Text,
    View,
    Container,
    Header,
    Content,
    Form,
    Picker,
    Icon
} from 'native-base';
import AppIcon from 'react-native-vector-icons/FontAwesome';

import {StyleSheet} from 'react-native';
import MyLoadingUtil from "../../myclass/MyLoadingUtil";
import server from "../../server";
import AntDesign from 'react-native-vector-icons/AntDesign';

let Fheight = Dimensions.get ('window').height;
let Fwidth = Dimensions.get ('window').width;


class Cards extends Component {
    render() {
        return (
            <Card style={{
                height : 153 ,
                width : 340 ,
                marginTop : 10,
                marginLeft :10,
                marginRight :10,
                padding : 10 ,
                backgroundColor: '#E8E8E8' ,
                borderRadius:5 ,
                borderWidth:5,
                borderStyle:'solid',
                borderColor:'#bbb'
            }}>
                <Text style={{
                    color:'#7D7D7D',
                    fontSize: 22,
                    fontWeight: 'bold'
                }}>{this.props.name}</Text>
            </Card>
        );
    }
}
export default class Test extends Component{

    constructor(props) {
        super(props);
        this.state = {
            Exercises: false,
            selected: "全部",
            number: "5",
        }
    }

    onValueChange(value: string) {
        this.setState({
            selected: value
        });
        console.log(value);
    }

    render(){
        const navigation=this.props.navigation;
        return (
            <Container>
                <ScrollView>
                    <View>
                        <TouchableOpacity
                            onPress={() => this.setState({Exercises: true})}
                            navigation={navigation}>
                            <Cards name="专题练习"/>
                        </TouchableOpacity>
                        <Cards name="真题试卷"/>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Collection")}>
                            <Cards name="收藏夹"/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.state.Exercises?
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
                            top : (Fheight - 600) / 2,
                            left : (Fwidth - 280) / 2,
                        }}>
                            <Text style={{margin:10,marginLeft:30,fontSize:16,color:"#00a8ff"}}>
                                选择您的练习内容
                            </Text>
                            <Content>
                                <Form >
                                    <Item picker style={{marginLeft:20,marginRight:20}}>
                                        <Text style={{marginLeft:10,fontSize:18,color:"#95a5a6"}}>
                                            分类
                                        </Text>
                                        <Picker
                                            mode="dropdown"
                                            iosIcon={<Icon name="arrow-down" />}
                                            style={{ height: 40}}
                                            placeholderStyle={{ color: "#bfc6ea" }}
                                            selectedValue={this.state.selected}
                                            onValueChange={this.onValueChange.bind(this)}
                                        >
                                            <Picker.Item label="全部" value="全部" />
                                            <Picker.Item label="单自由度" value="单自由度" />
                                            <Picker.Item label="多自由度" value="多自由度" />
                                            <Picker.Item label="数值方法" value="数值方法" />
                                            <Picker.Item label="分布参数系统" value="分布参数系统" />
                                            <Picker.Item label="随机振动" value="随机振动" />
                                            <Picker.Item label="地震工程" value="地震工程" />
                                            <Picker.Item label="风工程" value="风工程" />
                                            <Picker.Item label="振动控制" value="振动控制" />
                                            <Picker.Item label="结构监测" value="结构监测" />
                                            <Picker.Item label="人致振动" value="人致振动" />
                                            <Picker.Item label="生活中的振动" value="生活中的振动" />
                                            <Picker.Item label="多体动力学" value="多体动力学" />
                                            <Picker.Item label="非线性动力学" value="非线性动力学" />
                                            <Picker.Item label="其他动力学" value="其他动力学" />
                                        </Picker>
                                    </Item>
                                    <Item picker style={{marginLeft:20,marginRight:20}}>
                                        <Text style={{marginLeft:10,fontSize:18,color:"#95a5a6"}}>
                                            数量
                                        </Text>
                                        <Input style={{
                                                   fontSize : 16,
                                                   color : "black",
                                                   paddingLeft: 7
                                               }}
                                               keyboardType="numeric"
                                               maxLength={2}
                                               value={this.state.number}
                                               onChangeText={(txt) => {
                                                   txt=txt+'';
                                                   this.setState({number : txt.replace(/\D/g,'')});
                                               }}
                                        />
                                    </Item>
                                </Form>
                            </Content>


                            <View style={{display:"flex",flexDirection:'row',justifyContent:'space-around',alignItems:'center',padding:10,paddingTop:5}}>
                                <Button bordered danger style={{height:30}} onPress={() => this.setState({Exercises: false})}>
                                    <Text>取消</Text>
                                </Button>
                                <Button bordered info style={{height:30}} onPress={() => {
                                    this.setState({Exercises: false});
                                    navigation.navigate("exercises_page",{
                                            category:this.state.selected,
                                            number:parseInt(this.state.number)
                                        }
                                    );
                                }}>
                                    <Text>确定</Text>
                                </Button>
                            </View>

                        </View>
                    </View>

                    : <></>}
            </Container>
        )
    }
}
