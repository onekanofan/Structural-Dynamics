'use strict';
let DefaultRoute={
    Instance:'Upload',
    Library:'Upload',
    UserManage:'Users'
};
// Declare app level module which depends on views, and core components
angular.module('myApp', ['ngAnimate', 'ngMaterial', 'ngMessages', 'ui.router', 'angular-jwt', 'angularFileUpload',    //替换
    'Login', 'Navigator'])

    .controller('myAppCtrl', function ($scope, $state, jwtHelper, List, $location, $rootScope, Others) {
        //此处添加启动加载页
        document.getElementById('closeInfo').onclick=function close(){
            document.getElementById('showInfo').className='slide_Out';
            setTimeout("document.getElementById('showInfo').style.display='none'", 200 );
            setTimeout("document.getElementById('showInfo').className='slide_';", 201 );
        };

        let token = localStorage.getItem('token');
        if (token) {
            if (jwtHelper.isTokenExpired(token)) {
                Others.showInfo('failure','您的令牌已失效，请重新登录');
                $state.go('Login', {info : '您的令牌已失效，请重新登录'});
            } else{
                List.Token('info').then(function (res) {
                    if (res.status === 'success') {
                        if (res.identity === 'admin') {
                            Others.setAdminInfo(res.data);
                            Others.showInfo('success',(res.data.is_root?'超级':'')+'管理员'+res.data.username+'登录成功，祝您使用愉快');
                            $state.go(localStorage.getItem('Nav')&&localStorage.getItem(localStorage.getItem('Nav'))?
                                localStorage.getItem('Nav')+'.'+localStorage.getItem(localStorage.getItem('Nav'))
                                : 'Library.Upload');
                        } else {
                            Others.showInfo('failure','仅限管理员登录');
                            $state.go('Login', {info : '仅限管理员登录'});
                        }
                    }
                    else {
                        Others.showInfo('failure',res.reason);
                    }
                }, function (res) {
                    Others.showInfo('failure','服务器连接失败');
                });
            }
        } else {        //首次使用
            $state.go('Login');
            Others.showInfo('success','欢迎使用结构动力学后台管理页面，请先登录');
        }

        /*window.onbeforeunload=StoreNav;      //存储刷新前的路由
        function StoreNav() {
            localStorage.setItem('Nav',$location.path().replace('/','').split('/').join('.'));
        }*/

    })
    .controller('UserInfo', function($scope, Others) {
        document.getElementById('_target').onmouseenter=function () {
            document.getElementById('_blank').style.display='flex';
            setTimeout("document.getElementById('_blank').className='_blank slideIn'", 1 );
        };
        document.getElementById('_target').onmouseleave=function () {
            document.getElementById('_blank').className='_blank';
            setTimeout("document.getElementById('_blank').style.display='none'", 300 );
        };
        $scope.Cancellation=function () {
            Others.Cancellation();
        };
    })
    .run(function ($state, $rootScope) {
        $rootScope.setConfirm=function (Op){
            $rootScope.Alert.ifConfirm=Op;
        };
        $rootScope.GLoading=false;
        $rootScope.Alert={
            ifSuper: false,
            _current:'',
            _target:'',
            header:'',
            content:'',
            ifConfirm: 0
        };
        $rootScope.showInfo={
            type:'',
            content:''
        };
        $rootScope.AdminInfo={
            username : '',
            ID : '',
            root : ''
        };
        $rootScope.SwiftHeader=function(state){
            localStorage.setItem('Nav',state);
            $state.go(localStorage.getItem(state)?state+'.'+localStorage.getItem(state):state+'.'+DefaultRoute[state]);
        };
        window.myAppErrorLog = [];
            $state.defaultErrorHandler(function (error) {
        });
    });
