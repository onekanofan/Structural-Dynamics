import React, { Component } from 'react';
import {
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {
    Card,
    Text,
    View
} from 'native-base';
import { StyleSheet } from 'react-native';

class Cards extends Component {
    render() {
        const navigation=this.props.navigation;
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("exercises_page",{
                        category:this.props.name
                    }
                    )}>
            <Card style={{
                height : 153,
                width : 165,
                marginTop : 5,
                marginBottom : 5,
                padding : 10,
                backgroundColor : '#D0CFCF',
                borderRadius : 5,
                borderWidth : 5,
                borderStyle : 'solid',
                borderColor : '#bbb'
            }}>
                <Text style={{
                    color : 'white',
                    fontSize : 22,
                    fontWeight : 'bold'
                }}>{this.props.name}</Text>
            </Card>
            </TouchableOpacity>

        );
    }
}

export default class Special_exercises extends React.Component {
    static navigationOptions = {
        title : '专题练习',
        headerStyle : {
            backgroundColor : '#D33E42',
        },
        headerTintColor : '#fff',
        headerTitleStyle : {
            fontWeight : 'normal',
        },
    };

    render() {
        const navigation=this.props.navigation;
        return (
            <ScrollView>
                <View style={styles.rowsLayOut}>

                    <Cards name="单自由度" navigation={navigation}/>
                    <Cards name="多自由度" navigation={navigation}/>
                    <Cards name="数值方法" navigation={navigation}/>
                    <Cards name="分布参数系统" navigation={navigation}/>
                    <Cards name="随机振动" navigation={navigation}/>
                    <Cards name="地震工程" navigation={navigation}/>
                    <Cards name="风工程" navigation={navigation}/>
                    <Cards name="振动控制" navigation={navigation}/>
                    <Cards name="结构监测" navigation={navigation}/>
                    <Cards name="人致振动" navigation={navigation}/>
                    <Cards name="生活中的振动" navigation={navigation}/>
                    <Cards name="多体动力学" navigation={navigation}/>
                    <Cards name="非线性动力学" navigation={navigation}/>
                    <Cards name="其他动力学" navigation={navigation}/>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    rowsLayOut : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-around',
        flexWrap : 'wrap'
    },
});
//'单自由度' ,'多自由度' ,'数值方法' ,'分布参数系统' ,'随机振动', '地震工程','风工程',
//             '振动控制','结构监测','人致振动','生活中的振动','多体动力学','非线性动力学','其他动力学'
