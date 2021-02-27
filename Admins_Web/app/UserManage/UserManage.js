'use strict';

angular.module('UserManage',[
    'Users',
    'Admins'
])
    .config(function ($stateProvider) {
        $stateProvider.state('UserManage', {
            url:'/UserManage',
            views:{
                'header' : {
                    templateUrl: 'app/Templates/header/Header.html',
                    controller : 'UserManageHeadCtrl'
                },
                'main' :{
                    templateUrl: 'app/Templates/main/Navigator.html',
                    controller : 'UserManageCtrl'
                }
            }
        });
    })
    .controller('UserManageHeadCtrl',function (){
        document.getElementById('UserManage').className='flex_row_center block selected';
    })
    .controller('UserManageCtrl',function ($scope, $state, $location){
        // if($location.path().replace('/','')==='UserManage') $state.go('UserManage.Users');        //默认页面 - 通过URL判断
        $scope.swiftState=function (state) {
            $state.go('UserManage.'+state);
        };

    });

