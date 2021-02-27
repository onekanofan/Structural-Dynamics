import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {Root} from 'native-base'

import Login from "./pages/User/Login";
import SmsLogin from "./pages/User/SmsLogin";
import Regist from "./pages/User/Regist";
import FindBack from "./pages/User/FindBack";
import Main from './pages/Main/Main';
import User from './pages/User/User';

import UserInfo from './pages/User/UserInfo';
import Settings from './pages/User/setting';
import Security from './pages/User/Security';
import MdPhone from './pages/User/Security/ModifyPhone';
import MdPassW from './pages/User/Security/ModifyPassword';
import NewPhone from './pages/User/Security/NewPhone';
import Collection from "./pages/User/Collection";
import Feedback from "./pages/User/Feedback";

import exercises from './pages/Test/Special exercises';
import exerPage from "./pages/Test/Exercise Page";
import exerRes from "./pages/Test/Exercise Result";
import MyLoading from "./myclass/MyLoading";
import AnswerCard from "./pages/Test/AnswerCard";

//去掉黄色warning
console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
console.disableYellowBox = true ;// 关闭全部黄色警告



const AppNavigator = createStackNavigator({
  Login: {screen: Login},
  SmsLogin: {screen: SmsLogin},
  Regist:{screen:Regist},
  FindBack:{screen:FindBack},
  Main: {screen: Main},

  User: {screen: User},
  Security: {screen: Security},
  MdPhone: {screen: MdPhone},
  MdPassW: {screen: MdPassW},
  NewPhone: {screen: NewPhone},
  Collection: {screen: Collection},
  Feedback: {screen: Feedback},

  Special_exercises: {screen: exercises},
  exercises_page: {screen: exerPage},
  exercises_result: {screen : exerRes},
  AnswerCard: {screen: AnswerCard},
  UserInfo: {screen: UserInfo},
  Settings: {screen: Settings}
},{
  initialRouteName: 'Login',
});

const AppContainer =  createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <Root>
      <View style={{flex : 1,}}>
        <AppContainer />
        {<MyLoading
            ref={(ref) => {
              global.mLoadingComponentRef = ref;
            }}
        />}
      </View>
    </Root>;
  }
}


