'use strict';

angular.module('Users',[

])
    .config(function ($stateProvider) {
        $stateProvider.state('UserManage.Users', {
            url:'/Users',
            views : {
                'sidenv' : {
                    templateUrl : 'app/UserManage/UserManage.html',
                    controller : 'UsersSidenvCtrl'
                },
                'content' : {
                    templateUrl: 'app/UserManage/Users/Users.html',
                    controller: 'UsersCtrl'
                }
            }
        });
    })
    .controller('UsersSidenvCtrl',function ($scope){
        $scope.selectedPage = 'Users';
        document.getElementById($scope.selectedPage).className='list_item sel_item';
    })
    .controller('UsersCtrl',function ($scope, $rootScope, List, $mdSidenav){
        localStorage.setItem('UserManage','Users');
        $scope.DLoading=true;
        $scope.noContent=false;
        $scope.Lists=[];
        $scope.UInfo=null;
        List.GetU('statistics').then(function (res) {
            if(res.status==="success") {
                $scope.Lists=res.data;
                $scope.DLoading=false;
                if($scope.Lists.length===0) errorOcc('没有任何内容');
            }
            if(res.status==='failure'){
                errorOcc(res.reason);
            }
        },function (res) {
            errorOcc('连接服务器失败');
        });

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
            if (!$mdSidenav('left').isOpen()) $scope.toggleRight();
            $scope.UInfo=item;
        };


    });

