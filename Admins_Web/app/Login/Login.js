'use strict';

angular.module('Login',['questionList'])
    .config(function ($stateProvider) {
        $stateProvider.state('Login', {
            url:'/Login',
            views:{
                'header': null,
                'main': {
                    templateUrl: 'app/Login/Login.html',
                    controller: 'LoginCtrl'
                }
            },
            params:{info:'仅限管理员登录'}
        });
    })
    .controller('LoginCtrl',function ($scope, List, $state, $stateParams, Others){
        $scope.Info = $stateParams.info;
        $scope.Info1='请输入您的账户';
        $scope.Info2='请输入您的密码';
        $scope.clearInput = function () {
            $scope.password='';
        };
        $scope.AdminLogin = function () {
            if($scope.username===undefined||$scope.username===''){
                $scope.Info1='账户不能为空';
            }
            if($scope.password===undefined||$scope.password===''){
                $scope.Info2='密码不能为空';
            }
            if($scope.username&&$scope.password){
                let formdata=new FormData;
                formdata.append('operation','login');
                formdata.append('username',$scope.username);
                formdata.append('password',$scope.password);
                List.AdminLogin('admin',formdata).then(function (res) {
                    if(res.status==='failure') {
                        document.getElementById('info1').style.color='#e74c3c';
                        $scope.Info1=res.reason;
                        document.getElementById('info2').style.color='#e74c3c';
                        $scope.Info2=res.reason;
                        setTimeout(function () {
                            document.getElementById('info1').style.color='white';
                            $scope.Info1='请输入您的账户';
                            document.getElementById('info2').style.color='white';
                            $scope.Info2='请输入您的密码';
                        },5000)
                    }
                    if(res.status==='success'){
                        //let token=Others.Bin2String(res.token);
                        localStorage.setItem("token",res.token);
                        Others.setAdminInfo(res.data);
                        Others.showInfo('success',(res.data.is_root?'超级':'')+'管理员'+res.data.username+'登录成功，祝您使用愉快');
                        $state.go(localStorage.getItem('Nav')&&localStorage.getItem(localStorage.getItem('Nav'))?
                            localStorage.getItem('Nav')+'.'+localStorage.getItem(localStorage.getItem('Nav'))
                            : 'Library.Upload');
                    }
                }, function (res) {
                    $scope.Info="服务器连接失败，请重试";
                    Others.showInfo('failure','服务器连接失败');
                });
            }
        };
});
