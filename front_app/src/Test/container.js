import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text, View } from 'native-base';
import {StyleSheet} from 'react-native';
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
export default class Contain2 extends Component{
    render(){
        return (
            <ScrollView>
                <View>
                    <Cards name="专题练习"></Cards>
                    <Cards name="真题试卷"></Cards>
                    <Cards name="随心做"></Cards>
                    <Cards name="错题集"></Cards>
                </View>
            </ScrollView>
        )
    }
}
