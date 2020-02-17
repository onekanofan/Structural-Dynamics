import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text, View } from 'native-base';
import {StyleSheet} from 'react-native';
class Cards extends Component {
    render() {
        return (
                <Card style={{
                    height : 153 ,
                    width : 165 ,
                    marginTop : 5,
                    marginBottom : 5,
                    padding : 10 ,
                    backgroundColor: '#D0CFCF' ,
                    borderRadius:5 ,
                    borderWidth:5,
                    borderStyle:'solid',
                    borderColor:'#bbb'
                }}>
                    <Text style={{
                        color:'white',
                        fontSize: 22,
                        fontWeight: 'bold'
                    }}>{this.props.name}</Text>
                </Card>
        );
    }
}
export default class Contain1 extends Component{
    render(){
        return (
            <ScrollView>
                <View style={styles.rowsLayOut}>
                    <Cards name="结构动力学概述"></Cards>
                    <Cards name="单自由度体系"></Cards>
                    <Cards name="分布参数体系"></Cards>
                    <Cards name="多自由度体系"></Cards>
                    <Cards name="随机振动"></Cards>
                    <Cards name="地震工程"></Cards>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    rowsLayOut: {
        display: 'flex' ,
        flexDirection: 'row' ,
        justifyContent:'space-around',
        flexWrap:'wrap'
    } ,
});
