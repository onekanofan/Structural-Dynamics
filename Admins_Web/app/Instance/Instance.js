'use strict';

angular.module('Instance',[
    'InUpload',
    'InExamine',
    'InUpdate',
    'InManagement'
])
    .config(function ($stateProvider) {
        $stateProvider.state('Instance', {
            url:'/Instance',
            views:{
                'header' : {
                    templateUrl: 'app/Templates/header/Header.html',
                    controller : 'InstanceHeadCtrl'
                },
                'main' :{
                    templateUrl: 'app/Templates/main/Navigator.html',
                    controller : 'InstanceCtrl'
                }
            }
        });
    })
    .controller('InstanceHeadCtrl',function (){
        document.getElementById('Instance').className='flex_row_center block selected';
    })
    .controller('InstanceCtrl',function ($scope, $state, $location){
        //if($location.path().replace('/','')==='Library') $state.go('Library.Upload');        //默认页面 - 通过URL判断
        $scope.swiftState=function (state) {
            $state.go('Instance.'+state);
        };
    });
