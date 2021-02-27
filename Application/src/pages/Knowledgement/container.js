import React, { Component } from 'react';
import { ScrollView ,Dimensions} from 'react-native';
import { Card, Text, View } from 'native-base';
import {StyleSheet} from 'react-native';
const screenH = Dimensions.get('window').height - 60;

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
                    }}>待开发区</Text>
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
