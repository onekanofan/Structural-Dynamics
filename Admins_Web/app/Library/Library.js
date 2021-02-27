'use strict';

angular.module('Library',[
    'Upload',
    'Examine',
    'Update',
    'Management'
])
    .config(function ($stateProvider) {
        $stateProvider.state('Library', {
            url:'/Library',
            views:{
                'header' : {
                    templateUrl: 'app/Templates/header/Header.html',
                    controller : 'LibraryHeadCtrl'
                },
                'main' :{
                    templateUrl: 'app/Templates/main/Navigator.html',
                    controller: 'LibraryCtrl'
                }
            }
        });
    })
    .controller('LibraryHeadCtrl',function (){
        document.getElementById('Library').className='flex_row_center block selected';
    })
    .controller('LibraryCtrl',function ($scope, $state, $location){
        //if($location.path().replace('/','')==='Library') $state.go('Library.Upload');        //默认页面 - 通过URL判断
        $scope.swiftState=function (state) {
            $state.go('Library.'+state);
        };
    });
