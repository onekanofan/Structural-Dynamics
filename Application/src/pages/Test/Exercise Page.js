import React, { Component } from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    TouchableNativeFeedback,
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

import HTMLView from 'react-native-htmlview';
import { CachedImage } from "react-native-img-cache";
import server from "../../server"


import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

const windowPadding = 10;//设置距离屏幕边缘的间距
const width = Dimensions.get('window').width - 2 * windowPadding;
const screenH = Dimensions.get('window').height - 60;
import AsyncStorage from '@react-native-community/async-storage';
import Toast from "react-native-easy-toast";


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
let onLocation;
let collection=[];


export default class Test extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title : navigation.getParam('category', 'Parameter Error'),
            headerStyle : {
                backgroundColor : '#D33E42',
            },
            headerTintColor : '#fff',
            headerTitleStyle : {
                fontWeight : 'normal',
            },
            headerRight : ({}) => (
                <TouchableOpacity onPress={() => onLocation()}>
                    <Icon name="apps" style={{
                        color : '#fff',
                        fontSize : 32,
                        padding : 15
                    }}/>
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        onLocation =() =>{
            this.props.navigation.navigate("AnswerCard", {
                card : this.state.answerCard,
                onLocation : data => this.setState(data)
            });
        };
        this.state = ({
            isLoading : true,
            ifContain : true,
            CurrentPage : -1,
            answerCard : [],
            errorInfo : '',
            answer: 0,
            token:''
        });
    };



    getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('@token');
            this.setState({token:value});
            if (value !== null) {
                fetch(server + 'collection', {
                    method : 'GET',
                    headers : {
                        'token' : value
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if(responseJson.status==="success"){
                            for(let i in responseJson.data) {
                                if(i==='remove') continue;
                                collection.push(responseJson.data[i].timu_id);
                            }
                            console.log(responseJson.data);
                        }else this.refs.warning.show("获取收藏夹失败", 5000);
                    });
                fetch(server + 'timu', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'token' : value
                    },
                    body : JSON.stringify({
                        category : this.props.navigation.getParam('category', '全部'),
                        keywords : "全部",
                        random : "True",
                        number : this.props.navigation.getParam('number', 5)
                    })
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status === 'success') {
                            data = responseJson.data;
                            if (data.length === 0) return Promise.reject({
                                noContain : true
                            }); else{
                                tmpCards.length = 0;
                                for (let i in data) {
                                    if(i==='remove') continue;
                                    let tmpCard = {};
                                    tmpCard.appear=false;
                                    tmpCard.ifCollected = collection.indexOf (data[i].timu_id) !== -1;
                                    if (data[i].type === '单项选择题') {
                                        for (let t in data[i].option) tmpCard[t] = false;
                                        tmpCard.answer = data[i].solution;
                                        tmpCard.response = [];
                                        tmpCard.type = 'single';
                                        tmpCards[i] = tmpCard;
                                    }
                                    if (data[i].type === '多项选择题') {
                                        for (let t in data[i].option) tmpCard[t] = false;
                                        tmpCard.answer = data[i].solution;
                                        tmpCard.response = [];
                                        tmpCard.type = 'multiple';
                                        tmpCards[i] = tmpCard;
                                    }
                                    if (data[i].type === "计算题") {
                                        for (let t in data[i].option) tmpCard[t] = false;
                                        tmpCard.answer = data[i].analysis;
                                        tmpCard.response = [];
                                        tmpCard.type = 'calcu';
                                        tmpCards[i] = tmpCard;
                                    }
                                    if (data[i].type === "填空题") {
                                        tmpCard.response = new Array(data[i].solution.length).fill('');
                                        tmpCard.answer = data[i].solution;
                                        tmpCard.type = 'blank';
                                        tmpCards[i] = tmpCard;
                                    }
                                }
                                return tmpCards;
                            }
                        } else{
                            return Promise.reject({
                                e : responseJson.error,
                            });
                        }
                    }).then((tmpCards) => {
                    this.setState({
                        isLoading : false,
                        CurrentPage : 0,
                        answerCard : tmpCards
                    });
                })
                    .catch((error) => {
                        if (error.noContain) {
                            this.setState({
                                isLoading : false,
                                ifContain : false
                            });
                            return true;
                        } else if (error.e) {
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
        this.getToken();
    };

    selectAnswer(num, sel) {
        if (tmpCards[num][sel]) {
            tmpCards[num][sel] = false;
            tmpCards[num].response.remove(sel);
        } else{
            if (tmpCards[num].type === 'single') {
                for (let i in tmpCards[num]) {
                    if (i === 'answer' || i === 'type' || i === 'response' || i === 'appear' || i==='ifCollected') continue;
                    tmpCards[num][i] = false;
                }
                tmpCards[num].response.length = 0;
            }
            tmpCards[num].response.push(sel);
            tmpCards[num][sel] = true;
        }
        tmpCards[num].appear=false;
        this.setState({
            answerCard : tmpCards
        });
    }

    fillBlank(text, num, No) {
        tmpCards[num].appear=false;
        tmpCards[num].response[No] = text;
        this.setState({
            answerCard : tmpCards
        });
    }

    ifFinished(item) {
        if (item.type === 'single' && item.response.length) return 1;
        if (item.type === 'calcu') return 1;
        if (item.type === 'multiple' && item.response.length > 1) return 1;
        if (item.type === 'blank') {
            for (let i in item.response) {
                if (item.response[i] !== '') continue;
                return 0;
            }
            return 1;
        }
        return 0;
    }

    ifcorrect(idx,jud,res,ans){
        if(!jud) return 'black';                      //未选择且错误的答案
        if(res&&ans.includes(idx)) return '#2ecc71';        //选择了正确的答案
        if(res&&!ans.includes(idx)) return '#e74c3c';       //选择了错误的答案
        if(jud&&ans.includes(idx)) return '#3498db';        //未选择但正确的答案
    }

    ifchosen(idx,jud,ans){
        if(!jud) return false;
        return !!ans.includes(idx);
    }

    collectItem(index, item, col){
        let timu_id=[];
        timu_id.push(item);
        if(!col){
            fetch(server + 'collection', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'token' : this.state.token
                },
                body : JSON.stringify({
                    timu_id : timu_id
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status==="success") {
                        this.refs.info.show("收藏成功，请在个人收藏夹内查看", 5000);
                        tmpCards[index].ifCollected=true;
                        this.setState({
                            answerCard : tmpCards
                        })
                    }
                    else this.refs.warning.show("操作失败", 5000);
                });
        }else {
            fetch(server + 'collection', {
                method : 'DELETE',
                headers : {
                    'Content-Type' : 'application/json',
                    'token' : this.state.token
                },
                body : JSON.stringify({
                    timu_id : timu_id
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status==="success") {
                        this.refs.info.show("取消收藏成功", 5000);
                        tmpCards[index].ifCollected=false;
                        this.setState({
                            answerCard : tmpCards
                        })
                    }
                    else this.refs.warning.show("操作失败", 5000);
                });
        }
    }

    render() {
        const navigation = this.props.navigation;
        if (this.state.isLoading) {
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
        }
        let Page = this.state.CurrentPage;
        return (<Container>
            <Tabs initialPage={0} page={this.state.CurrentPage} tabBarPosition
                  onChangeTab={(page)=>{
                      this.setState({
                          CurrentPage: page.i
                      })
                  }}>
                {data.map((item, index)=>{
                    return (
                        <Tab heading={<TabHeading/>} key={index}>
                            <ScrollView style={{padding : windowPadding}}>
                                <TouchableNativeFeedback onPress={()=>this.collectItem(index, item.timu_id, this.state.answerCard[index].ifCollected)}>
                                    <View style={{position:'absolute',top:5,right:5,padding:5}}>
                                        {this.state.answerCard[index].ifCollected?
                                            <AntDesign name="heart" style={{fontSize : 24,color:'#e74c3c'}}/>:
                                            <AntDesign name="hearto" style={{fontSize : 24}}/>
                                        }
                                    </View>
                                </TouchableNativeFeedback>
                                <View style={{
                                    marginRight : 30,
                                    flexDirection : 'row',
                                    flexWrap : 'wrap',
                                    justifyContent : 'flex-start'
                                }}>
                                    <Text style={[styles.label, {
                                        fontSize : 17,
                                        marginRight : 0
                                    }]}>{index + 1}、</Text>
                                    <Text style={[styles.label, {backgroundColor : '#ffeaa7'}]}>题型：{item.type}</Text>
                                    <Text style={[styles.label, {backgroundColor : '#fab1a0'}]}>关键词：{item.keywords}</Text>
                                    <Text style={[styles.label, {backgroundColor : '#81ecec'}]}>分类：{item.category}</Text>

                                </View>

                                {item.description.map((desc, index) => {
                                    return (<HTMLView
                                        value={desc}
                                        renderNode={renderNode}
                                        stylesheet={styles}
                                        key={index}
                                    />)
                                })}


                                {item.type === "填空题" ? <View style={{
                                    flexDirection : 'column',
                                    alignItems : 'center'
                                }}>
                                    {this.state.answerCard[Page].answer.map((item, index) => {
                                        return (<View key={index} style={{
                                            flexDirection : 'row',
                                            alignItems : 'center',
                                            padding : 5
                                        }}>
                                            <Text style={{fontSize : 17}}>{index + 1}、</Text>
                                            <TextInput placeholder='在此填入答案'
                                                       onChangeText={text => this.fillBlank(text, Page, index)}
                                                       value={this.state.answerCard[Page].response[index]}
                                                       style={{
                                                           fontSize : 16,
                                                           borderBottomWidth : 1,
                                                           borderBottomColor : '#bdc3c7',
                                                           padding : 0,
                                                           width : 200
                                                       }}
                                                       selectTextOnFocus={true}     //获得焦点时全选文字
                                            />
                                        </View>)
                                    })}
                                </View> : item.type === "计算题" ? <></> : Object.keys(item.option).map((idx) => {
                                    return (<TouchableOpacity key={idx}>
                                        <ListItem onPress={() => this.selectAnswer(Page, idx)}>

                                            <Left style={{
                                                flexDirection : 'row',
                                                flexWrap : 'wrap',
                                                justifyContent : 'flex-start',
                                                alignItems : 'center',
                                            }}>
                                                <Radio selected={this.state.answerCard[Page][idx]||this.ifchosen(idx,tmpCards[Page].appear,tmpCards[Page].answer)}
                                                       selectedColor={this.ifcorrect(idx,tmpCards[Page].appear,tmpCards[Page][idx],tmpCards[Page].answer)}
                                                       onPress={() => this.selectAnswer(Page, idx)}/>
                                                <Text style={{
                                                    marginLeft : 10,
                                                }}>{idx}、</Text>
                                                {item.option[idx].map((desc, index) => {
                                                    return (<HTMLView
                                                        value={desc}
                                                        renderNode={renderNodeOp}
                                                        stylesheet={styles}
                                                        key={index}
                                                    />)
                                                })}
                                            </Left>

                                        </ListItem>
                                    </TouchableOpacity>)
                                })}
                                {this.ifFinished(this.state.answerCard[Page])? <View style={{
                                    marginTop:20,
                                    marginBottom:20,
                                    flexDirection : 'row',
                                    justifyContent : 'center',
                                    alignItems : 'center',
                                    flexWrap : 'wrap',
                                }}>
                                    <Button style={{height:36,backgroundColor:'#3498db',paddingRight : 15,paddingLeft : 15}}
                                            primary onPress={()=>{
                                        tmpCards[index].appear=!tmpCards[index].appear;
                                        if(this.state.answer) this.setState({
                                            answerCard:tmpCards,
                                        });
                                        else this.setState({
                                            answerCard:tmpCards,
                                        })
                                    }}><Text style={{color:'white',fontSize:15}}>{this.state.answerCard[Page].appear?'隐藏答案':'查看答案'}</Text></Button>
                                </View>:<></>}

                                {this.state.answerCard[index].appear === true ? <View>
                                    {item.type==="计算题"?<></>:<View>
                                        <Text style={{margin:10}}>你的答案：
                                            {tmpCards[index].response.sort().map((item)=>{
                                                return (
                                                    <Text style={{fontSize:17,color:tmpCards[index].answer.includes(item)?'#2ecc71':'#e74c3c'}}>{item} </Text>
                                                )
                                            })}
                                            {tmpCards[index].response.length===0?<Text style={{color:'#e74c3c'}}>空缺</Text>:<></>}
                                        </Text>
                                        <Text style={{margin:10,marginTop:0}}>正确答案：
                                            {tmpCards[index].answer.map((item)=>{
                                                return (
                                                    <Text style={{fontSize:17,color:tmpCards[index].response.includes(item)?'#2ecc71':'#3498db'}}>{item} </Text>
                                                )
                                            })}
                                        </Text>
                                    </View>
                                    }
                                    <View style={{marginTop:5,paddingTop:10,borderTopWidth:1,borderColor : '#95a5a6'}}>

                                        <Text style={{fontSize:18,color:'#e74c3c',marginBottom : 10}}>解析</Text>
                                        {data[index].analysis.map((desc, index) => {
                                            return (<HTMLView
                                                value={desc}
                                                renderNode={renderNode}
                                                stylesheet={styles}
                                                key={index}
                                            />)
                                        })}
                                    </View>
                                </View>: <></>}
                                <View style={{height : 50}}/>
                            </ScrollView>
                        </Tab>
                    )
                })}
            </Tabs>

            <Toast
                ref="warning"
                style={{
                    backgroundColor : '#D33E42',
                    paddingTop : 5,
                    paddingBottom : 5
                }}
                position='bottom'
                positionValue={200}
                fadeInDuration={0}
                fadeOutDuration={1000}
                opacity={1}
                textStyle={{color : 'white'}}
            />
            <Toast
                ref="info"
                style={{
                    backgroundColor : '#2ecc71',
                    paddingTop : 5,
                    paddingBottom : 5
                }}
                position='bottom'
                positionValue={200}
                fadeInDuration={0}
                fadeOutDuration={1000}
                opacity={1}
                textStyle={{color : 'white'}}
            />
            {/*底部栏*/}
            <Footer style={{
                backgroundColor : "#F9F9F9",
                height : 50,
                alignItems : 'center'
            }}>
                <Left>
                    <TouchableOpacity style={{
                        width : width/2,
                        flexDirection:'row',
                        alignItems : 'center',
                        justifyContent : 'center'
                    }} onPress={() => {
                        if (Page > 0) this.setState({
                            CurrentPage : Page - 1
                        });
                    }}>
                        <Entypo name='chevron-left' style={{
                            fontSize : 40,
                            color : Page === 0 ? '#ecf0f1' : 'black',
                        }}/>
                        <Text style={{
                            fontSize : 20,
                            color : Page === 0 ? '#ecf0f1' : 'black',
                        }}>上一题</Text>
                    </TouchableOpacity></Left>
                <Text style={{
                    textAlign : 'center',
                    fontSize : 20
                }}>{this.state.CurrentPage + 1}/{data.length}</Text>
                <Right>
                    <TouchableOpacity style={{
                        width : width/2,
                        flexDirection:'row',
                        alignItems : 'center',
                        justifyContent : 'center'
                    }} onPress={() => {
                        if (Page < data.length - 1) this.setState({
                            CurrentPage : Page + 1
                        });
                    }}>
                        <Text style={{
                            fontSize : 20,
                            color : Page + 1 === data.length ? '#ecf0f1' : 'black',
                        }}>下一题</Text>
                        <Entypo name='chevron-right' style={{
                            fontSize : 40,
                            color : Page + 1 === data.length ? '#ecf0f1' : 'black',
                        }}/>
                    </TouchableOpacity></Right>
            </Footer>
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
        borderWidth : 1,
        borderColor : '#3498db',
        margin : 8
    },
    button : {
        color : 'black'
    }
});
