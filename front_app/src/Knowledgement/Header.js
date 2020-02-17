import React, { Component } from 'react';
import { TextInput } from 'react-native';
import {
    Icon ,
    Item ,
} from 'native-base';

import AppIcon from 'react-native-vector-icons/FontAwesome';

export default class Search extends Component {
    render() {
        return (
            <>
                <Item style={{
                    height:40,
                    width:200,
                    backgroundColor:'white',
                    opacity:0.8,
                    borderRadius:5,
                }}>
                    <AppIcon name='search' style={{padding:8, fontSize:22,color:'#7D7D7D'}}/>
                    <TextInput placeholder='检索知识点'/>
                </Item>
            </>
        );
    }
}
