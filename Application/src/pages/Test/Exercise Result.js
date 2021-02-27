import React, { Component } from 'react';
import {
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Image,
    Alert,
    ToastAndroid,
    TextInput,
    Text,
    View,
} from 'react-native';
import {

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

import HTMLView from 'react-native-htmlview';
import { CachedImage } from "react-native-img-cache";

import Entypo from 'react-native-vector-icons/Entypo';

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;


function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name === 'img') {
        const a = node.attribs;
        let wid = parseInt(a.width > width ? width : a.width);
        let hei = parseInt(wid * a.height / a.width);
        if (a.class === 'noOperation') {
            return (<CachedImage
                key={a.src}
                style={{
                    height : hei,
                    width : wid,
                }}
                resizeMode='cover'
                source={{uri : a.src}}/>);
        }
        if (a.class === 'single_line') {
            return (<View key={a.src}
                          style={{
                              justifyContent : 'center',
                              flexDirection : 'row',
                              marginTop : 10
                          }}>
                <CachedImage
                    style={{
                        height : hei,
                        width : wid,
                    }}
                    resizeMode='cover'
                    source={{uri : a.src}}/>
            </View>);

        }
    }
    if (node.name === 'div' && node.attribs.class !== undefined && node.attribs.class === 'explanation') {
        return (<Text key={index} style={styles.explanation}>
            图 {defaultRenderer(node.children)}
        </Text>)
    }
}

function renderNodeOp(node, index, siblings, parent, defaultRenderer) {
    if (node.name === 'img') {
        const a = node.attribs;
        let wid = parseInt(a.width > width ? width : a.width);
        let hei = parseInt(wid * a.height / a.width);
        if (a.class === 'noOperation') {
            return (<CachedImage
                key={a.src}
                style={{
                    height : hei,
                    width : wid,
                }}
                resizeMode='cover'
                source={{uri : a.src}}/>);
        }
        if (a.class === 'single_line') {
            return (
                <View key={a.src}
                          style={{
                              justifyContent : 'center',
                              flexDirection : 'row',
                              marginTop : 10
                          }}>
                <CachedImage
                    style={{
                        height : hei,
                        width : wid,
                    }}
                    resizeMode='cover'
                    source={{uri : a.src}}/>
            </View>
            );

        }
    }
    if (node.name === 'div' && node.attribs.class !== undefined && node.attribs.class === 'explanation') {
        return (<Text key={index} style={styles.explanation}>
            图 {defaultRenderer(node.children)}
        </Text>)
    }
    if (node.name === 'div') {
        const a = node.attribs;
        return (<View key={a.class} style={{
                flexDirection : 'row',
                alignItems : 'center',
            }}>
                {defaultRenderer(node.children)}
            </View>

        );
    }
}



export default class Test extends Component {
    static navigationOptions = () => {
        return {
            title : "测验结果",
            headerStyle : {
                backgroundColor : '#D33E42',
            },
            headerTintColor : '#fff',
            headerTitleStyle : {
                fontWeight : 'normal',
            },
        };
    };
    state = {
        tab : 0,
        CurrentPage : 0,
        answer: 0   //是否查看答案
    };

    ifFinished(item) {
        if (item.type === 'single' && item.response.length) return 1;
        if (item.type === 'multiple' && item.response.length > 1) return 1;
        if (item.type === 'blank') {
            for (let i in item.response) {
                if (item.response[i] !== '') continue;
                return 0;
            }
            return 1;
        }
        return 0;
    };

    ifcorrect(idx,jud,res,ans){
        if(res&&ans.includes(idx)) return '#2ecc71';        //选择了正确的答案
        if(res&&!ans.includes(idx)) return '#e74c3c';       //选择了错误的答案
        if(!jud&&!res) return 'black';                      //未选择且错误的答案
        if(jud&&ans.includes(idx)) return '#3498db';        //未选择但正确的答案
    }

    ifchosen(idx,jud,ans){
        if(!jud) return false;
        if(ans.includes(idx)) return true;
    }

    resultView(ans,type){
        if(type==='计算题') return '#3498db';
        if(type==='填空题'){
            for(let i in ans.answer){
                if(ans.answer[i]!==ans.response[i]) return '#e74c3c';
            }
            return '#2ecc71';
        }
        if(type==='单项选择题'||type==='多项选择题'){
            if(ans.answer.sort().toString()===ans.response.sort().toString()) return '#2ecc71';
            else return '#e74c3c';
        }
    }

    render() {
        const navigation = this.props.navigation;
        const question = navigation.getParam('question', 'Parameter Error');
        const answer = navigation.getParam('answer', 'Parameter Error');
        const Page = this.state.CurrentPage;
        console.log(question);
        console.log(answer);
        return (<Container>
                <Tabs initialPage={0} page={this.state.tab}>
                    <Tab
                        heading={<TabHeading style={{backgroundColor : '#D33E42'}}><Icon name="create"/><Text>详情</Text></TabHeading>}>
                        <ScrollView style={{padding : windowPadding}}>
                            <View style={{
                                flexDirection : 'row',
                                flexWrap : 'wrap',
                                justifyContent : 'flex-start'
                            }}>
                                <Text style={[styles.label, {
                                    fontSize : 17,
                                    marginRight : 0
                                }]}>{Page + 1}、</Text>
                                <Text
                                    style={[styles.label, {backgroundColor : '#ffeaa7'}]}>题型：{question[Page].type}</Text>
                                <Text
                                    style={[styles.label, {backgroundColor : '#fab1a0'}]}>关键词：{question[Page].keywords}</Text>
                                <Text
                                    style={[styles.label, {backgroundColor : '#81ecec'}]}>分类：{question[Page].category}</Text>
                            </View>
                            {question[Page].description.map((desc, index) => {
                                return (<HTMLView
                                    value={desc}
                                    renderNode={renderNode}
                                    stylesheet={styles}
                                    key={index}
                                />)
                            })}
                            {question[Page].type==='填空题'?
                                <View style={{
                                    flexDirection : 'column',
                                    alignItems : 'center'
                                }}>
                                    {answer[Page].answer.map((item ,index)=>{
                                    return(
                                        <View key={index} style={{
                                            flexDirection : 'row',
                                            alignItems : 'center',
                                            padding : 5
                                        }}>
                                            <Text style={{fontSize : 17}}>{index + 1}、</Text>
                                            <TextInput value={answer[Page].response[index]===''?'空缺':answer[Page].response[index]}
                                                       style={{
                                                           fontSize : 16,
                                                           borderBottomWidth : 1,
                                                           borderBottomColor : '#bdc3c7',
                                                           padding : 0,
                                                           paddingLeft : 10,
                                                           paddingRight : 10,
                                                           color:answer[Page].response[index]===answer[Page].answer[index]?'#2ecc71':'#e74c3c'
                                                       }}
                                                       editable={false}     //不可编辑
                                            />
                                            {this.state.answer?<Text style={{marginLeft:10,fontSize:17}}>正确答案：
                                                    <Text style={{color:'#2ecc71',fontSize:17}}>{answer[Page].answer[index]}</Text>
                                            </Text>:<></>}
                                        </View>
                                    )
                                })}
                                    <View style={{marginTop:20,
                                        marginBottom:20,
                                        flexDirection : 'row',
                                        justifyContent : 'center',
                                        alignItems : 'center',
                                        flexWrap : 'wrap',
                                    }}>
                                        <Button style={{height:36,backgroundColor:'#3498db'}}
                                                primary onPress={()=>{
                                            if(this.state.answer) this.setState({
                                                answer:0
                                            });
                                            else this.setState({
                                                answer:1
                                            })

                                        }}><Text>{this.state.answer?'隐藏答案':'查看答案'}</Text></Button>
                                    </View>
                                    {this.state.answer?<View style={{marginTop:5,paddingTop:10,borderTopWidth:1,borderColor : '#95a5a6'}}>
                                        <Text style={{fontSize:18,color:'#e74c3c',marginBottom : 10}}>解析</Text>
                                        {question[Page].analysis.map((desc, index) => {
                                        return (<HTMLView
                                            value={desc}
                                            renderNode={renderNode}
                                            stylesheet={styles}
                                            key={index}
                                        />)
                                    })}
                                    </View>:<></>}
                                </View>
                                :question[Page].type==='计算题'?
                                    <View style={{marginTop:15,paddingTop:10,borderTopWidth:1,borderColor : '#95a5a6'}}>
                                        <Text style={{fontSize:18,color:'#e74c3c',marginBottom : 15}}>参考答案</Text>
                                        {answer[Page].answer.map((desc,index)=>{
                                            return (<HTMLView
                                                value={desc}
                                                renderNode={renderNode}
                                                stylesheet={styles}
                                                key={index}
                                            />)
                                        })}
                                    </View>
                                    :
                                    <View>
                                        {Object.keys(question[Page].option).map((idx)=>{
                                        return (
                                            <ListItem>
                                                <Left style={{
                                                    flexDirection : 'row',
                                                    flexWrap : 'wrap',
                                                    justifyContent : 'flex-start',
                                                    alignItems : 'center',
                                                }}>
                                                    <Radio selected={answer[Page][idx]||this.ifchosen(idx,this.state.answer,answer[Page].answer)}
                                                           selectedColor={this.ifcorrect(idx,this.state.answer,answer[Page][idx],answer[Page].answer)}
                                                    />
                                                    <Text style={{
                                                        marginLeft : 10,
                                                    }}>{idx}、</Text>
                                                    {question[Page].option[idx].map((desc, index) => {
                                                        return (<HTMLView
                                                            value={desc}
                                                            renderNode={renderNodeOp}
                                                            stylesheet={styles}
                                                            key={index}
                                                        />)
                                                    })}
                                                </Left>
                                            </ListItem>

                                        )
                                    })}
                                    <View>
                                        <Text style={{margin:10}}>你的答案：
                                            {answer[Page].response.sort().map((item)=>{
                                                return (
                                                    <Text style={{fontSize:17,color:answer[Page].answer.includes(item)?'#2ecc71':'#e74c3c'}}>{item} </Text>
                                                )
                                            })}
                                            {answer[Page].response.length===0?<Text style={{color:'#e74c3c'}}>空缺</Text>:<></>}
                                        </Text>
                                        {this.state.answer?<Text style={{margin:10,marginTop:0}}>正确答案：
                                            {answer[Page].answer.map((item)=>{
                                                return (
                                                    <Text style={{fontSize:17,color:answer[Page].response.includes(item)?'#2ecc71':'#3498db'}}>{item} </Text>
                                                )
                                            })}</Text>:<></>}
                                    </View>
                                        <View style={{marginTop:20,
                                            marginBottom:20,
                                            flexDirection : 'row',
                                            justifyContent : 'center',
                                            alignItems : 'center',
                                            flexWrap : 'wrap',
                                        }}>
                                            <Button style={{height:36,backgroundColor:'#3498db'}}
                                                    primary onPress={()=>{
                                                        if(this.state.answer) this.setState({
                                                            answer:0
                                                        });
                                                        else this.setState({
                                                            answer:1
                                                        })

                                            }}><Text>{this.state.answer?'隐藏答案':'查看答案'}</Text></Button>
                                        </View>
                                        {this.state.answer?<View style={{marginTop:5,paddingTop:10,borderTopWidth:1,borderColor : '#95a5a6'}}>
                                            <Text style={{fontSize:18,color:'#e74c3c',marginBottom : 10}}>解析</Text>
                                            {question[Page].analysis.map((desc, index) => {
                                                return (<HTMLView
                                                    value={desc}
                                                    renderNode={renderNode}
                                                    stylesheet={styles}
                                                    key={index}
                                                />)
                                            })}
                                        </View>:<></>}
                                    </View>

                            }
                            <View style={{height : 50}}/>
                        </ScrollView>
                        {/*底部栏*/}
                        <Footer style={{
                            backgroundColor : "#F9F9F9",
                            height : 50,
                            alignItems : 'center'
                        }}>
                            <Left>
                                <TouchableOpacity style={{width : 30}} onPress={() => {
                                    if (Page > 0) this.setState({
                                        CurrentPage : Page - 1
                                    });
                                }}><Entypo name='chevron-left' style={{
                                    fontSize : 40,
                                    color : Page === 0 ? '#ecf0f1' : 'black',
                                    textAlign : 'center'
                                }}/></TouchableOpacity></Left>
                            <Text style={{
                                textAlign : 'center',
                                fontSize : 20
                            }}>{this.state.CurrentPage + 1}/{question.length}</Text>
                            <Right>
                                <TouchableOpacity style={{width : 30}} onPress={() => {
                                    if (Page < question.length - 1) this.setState({
                                        CurrentPage : Page + 1
                                    });
                                }}>
                                    <Entypo name='chevron-right' style={{
                                        fontSize : 40,
                                        color : Page + 1 === question.length ? '#ecf0f1' : 'black',
                                        textAlign : 'center'
                                    }}/>
                                </TouchableOpacity></Right>
                        </Footer>

                    </Tab>
                    <Tab heading={<TabHeading style={{backgroundColor : '#D33E42'}}><Icon name="apps"/><Text>总览</Text></TabHeading>}>
                        <ScrollView>
                            <Text style={{textAlign : 'center',paddingTop:20,color:'#b2bec3'}}>点击序号可切换题目</Text>
                            <View style={{
                                flexDirection : 'row',
                                justifyContent : 'center',
                                alignItems : 'center',
                                flexWrap : 'wrap',
                                padding : 30,
                                paddingTop:10,
                                paddingBottom:0
                            }}>
                                {answer.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={()=>{
                                            this.setState({
                                                CurrentPage:index,
                                                tab:0
                                            })
                                        }}>
                                            <View
                                                style={[styles.dot, {backgroundColor : this.ifFinished(item) ? '#3498db' : 'white'}]}>
                                                <Text style={{
                                                    color : this.ifFinished(item) ? 'white' : 'black',
                                                    fontSize : 16
                                                }}>{index + 1}</Text></View>
                                        </TouchableOpacity>

                                    )
                                })}
                            </View>
                        </ScrollView>
                    </Tab>
                </Tabs>
            </Container>)
    }
}

const styles = StyleSheet.create({
    div : {
        fontSize : 17,
        lineHeight : 25,
    },
    explanation : {
        fontSize : 15,
        color : '#7f8c8d',
        textAlign : 'center',
        marginBottom : 3
    },
    label : {
        fontSize : 14,
        color : '#2d3436',
        borderBottomRightRadius : 10,
        borderTopRightRadius : 10,
        marginRight : 5,
        marginTop : 5,
        paddingLeft : 3,
        paddingRight : 10
    },
    dot : {
        borderRadius : 16,
        width : 32,
        height : 32,
        justifyContent : 'center',
        alignItems : 'center',
        margin : 8
    },
    button : {
        color : 'black'
    }
});
