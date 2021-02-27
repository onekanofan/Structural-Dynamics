'use strict';

angular.module('Admins',[

])
    .config(function ($stateProvider) {
        $stateProvider.state('UserManage.Admins', {
            url:'/Admins',
            views : {
                'sidenv' : {
                    templateUrl : 'app/UserManage/UserManage.html',
                    controller : 'AdminsSidenvCtrl'
                },
                'content' : {
                    templateUrl: 'app/UserManage/Admins/Admins.html',
                    controller: 'AdminsCtrl'
                }
            }
        });
    })
    .controller('AdminsSidenvCtrl',function ($scope){
        $scope.selectedPage = 'Admins';
        document.getElementById($scope.selectedPage).className='list_item sel_item';
    })
    .controller('AdminsCtrl',function ($scope, $rootScope, $state, List, $mdSidenav, Others){
        localStorage.setItem('UserManage','Admins');
        $scope.DLoading=true;
        $scope.noContent=false;
        $scope.Lists=[];
        $scope.AInfo=null;
        $scope.ifHidden=true;
        $scope.password='';
        getAdmins();
        function getAdmins(){
            List.GetAdmin('admin').then(function (res) {
                if(res.status==="success") {
                    $scope.Lists=res.data;
                    $scope.DLoading=false;
                    if($scope.Lists.length===0) errorOcc('没有任何内容');
                }
                if(res.status==='failure'){
                    errorOcc(res.reason);
                }
                if (res.status==="failure"&&res.reason==="You do not have permission to do this."){
                    //普通管理员没有权限查看管理员列表
                    $state.go("UserManage.Users");
                }
            },function (res) {
                errorOcc('连接服务器失败');
            });
        }

        function errorOcc(Info){
            $scope.DLoading=false;
            $scope.noContent=true;
            $scope.errorInfo=Info;
        }

        $scope.toggleRight =  function () { //打开/关闭 筛选器
            $mdSidenav('left').toggle();
            if ($mdSidenav('left').isOpen()){
                document.getElementById('Open_icon').className="glyphicon glyphicon-chevron-left";
            }else {
                document.getElementById('Open_icon').className="glyphicon glyphicon-chevron-right";
            }
        };


        $scope.Detail = function(item){
            document.getElementById('AAwrap').className='AAwrap';
            if (!$mdSidenav('left').isOpen()) $scope.toggleRight();
            $scope.password='';
            $scope.AInfo=item;
        };

        $scope.ChangeHidden = function () {
            $scope.ifHidden = !$scope.ifHidden;
        };

        function ChangePassword(id, pass){
            $rootScope.GLoading=true;
            let formData = new FormData;
            formData.append('admin_id',id);
            formData.append('password',pass);
            List.ChangePOA('admin',formData).then(function (res) {
                $rootScope.GLoading=false;
                if(res.status==="success"){
                    Others.showInfo(res.status, "修改密码成功");
                    $scope.password='';
                }else {
                    Others.showInfo('failure', res.reason);
                }
            },function (res) {
                $rootScope.GLoading=false;
                Others.showInfo('failure', "修改密码失败：连接服务器失败");
            });
        }

        $scope.ChangePassword = function (id, pass) {
            Others.showAlert('操作确认', '您确定要修改该管理员的密码吗？', ChangePassword, id, pass);
        };

        function DeleteAdmin(username){
            $rootScope.GLoading=true;
            let formData = new FormData;
            formData.append('username',username);
            List.DeleteA('admin',formData).then(function (res) {
                $rootScope.GLoading=false;
                if(res.status==="success"){
                    Others.showInfo(res.status, "删除管理员成功");
                    getAdmins();
                }else {
                    Others.showInfo('failure', res.reason);
                }
            },function (res) {
                $rootScope.GLoading=false;
                Others.showInfo('failure', "删除管理员失败：服务器连接失败");
            });
        }
        $scope.DeleteAdmin = function (username) {
            Others.showSuperAlert('重要操作确认', '您确定要删除该管理员的账户吗？如是，请在下方输入该管理员的用户名并确定：', DeleteAdmin, username);
        };

        let ifApp=false;

        $scope.AddWrap = function () {
            if(!ifApp) {
                document.getElementById('AAwrap').style.display='block';
                setTimeout("document.getElementById('AAwrap').className='AAwrap AAwrap_app'", 1 );
            } else {
                document.getElementById('AAwrap').className='AAwrap';
                setTimeout("document.getElementById('AAwrap').style.display='none'", 500 )
            }
            ifApp=!ifApp;
        };

        $scope.CreatPass='';
        $scope.CreatUse='';

        function CreateAdmin(user, pass){
            $rootScope.GLoading=true;
            let formData = new FormData;
            formData.append('operation','create');
            formData.append('username',user);
            formData.append('password',pass);
            List.AdminLogin('admin',formData).then(function (res) {
                $rootScope.GLoading=false;
                if(res.status==="success"){
                    Others.showInfo(res.status, "创建管理员成功");
                    getAdmins();
                    $scope.CreatPass='';
                    $scope.CreatUse='';
                }else {
                    Others.showInfo('failure', res.reason);
                }
            },function (res) {
                $rootScope.GLoading=false;
                Others.showInfo('failure', "创建管理员失败：服务器连接失败");
            });
        }
        $scope.CreateAdmin = function (user, pass) {
            Others.showAlert('操作确认', '您确定要添加该管理员的账户吗？', CreateAdmin, user, pass)
        }
    });

