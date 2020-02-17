import React, { Component } from 'react';
import {
    Image ,
    ScrollView
} from 'react-native';
import {
    Container ,
    Content ,
    Card ,
    CardItem ,
    Text ,
    Right ,
    Left ,
    H3 ,
    StyleProvider ,
    Button ,
    View
} from 'native-base';
import AppIcon from 'react-native-vector-icons/Ionicons';

import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

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
                                <AppIcon name="ios-arrow-forward" style={{fontSize:30}}></AppIcon>
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
    render(){
        return (
            <ScrollView>
                <Cards></Cards>
                <Cards></Cards>
            </ScrollView>
        )
    }
}
