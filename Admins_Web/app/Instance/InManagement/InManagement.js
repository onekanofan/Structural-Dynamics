'use strict';

angular.module('InManagement', ['questionList'])
    .config(function ($stateProvider) {
        $stateProvider.state('Instance.Management', {
            url : '/Management',
            views : {
                'sidenv' : {
                    templateUrl : 'app/Instance/Instance.html',
                    controller : 'InManagementSidenvCtrl'
                },
                'content' : {
                    templateUrl : 'app/Instance/InManagement/InManagement.html',
                    controller : 'InManagementCtrl'
                }
            }
        });
    })
    .controller('InManagementSidenvCtrl', function ($scope) {
        $scope.selectedPage = 'Management';
        document.getElementById($scope.selectedPage).className = 'list_item sel_item';
    })
    .controller('InManagementCtrl', function ($scope, $rootScope, List, $mdSidenav, $location, $anchorScroll, $element, Others) {
        localStorage.setItem('Instance','Management');

        $scope.Lists = [];
        $scope.DLoading=true;
        $scope.noContent=false;
        function QueryList(Params){
            $scope.Lists = [];
            List.InstanceList('instance/real', Params).then(function (res) {
                if(res.status==="success") {
                    $scope.Lists.push(res.data);
                    console.log($scope.Lists);
                    $scope.DLoading=false;
                    if($scope.Lists.length===0) errorOcc('没有任何内容');
                }
                if(res.status==='failure'){
                    errorOcc(res.error);
                }
            }, function (res) {
                errorOcc('连接服务器失败');
            });
        }

        function errorOcc(Info){
            $scope.DLoading=false;
            $scope.noContent=true;
            $scope.errorInfo=Info;
        }

        let defaultParams={
            first_level : "结构动力学概述",
            second_level : "结构动力学分析",
            third_level : "主要目的"
        };

        QueryList(defaultParams);

        //复选框
        $scope.selected = [];
        //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
        $scope.toggle = function (item, list) { //选择与取消选择
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        $scope.exists = function (item, list) { //ng-checked
            return list.indexOf(item) > -1;
        };

        $scope.isIndeterminate = function() {   //半全选状态
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.Lists.length);
        };

        $scope.isChecked = function() {         //全选状态
            return $scope.selected.length === $scope.Lists.length;
        };

        $scope.toggleAll = function() {         //全选
            if ($scope.selected.length === $scope.Lists.length) $scope.selected = [];
            else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                for(var i in $scope.Lists) {
                    $scope.selected[i]=$scope.Lists[i].id;
                }
            }
        };

        //删除题目的方法
        function Management(Ids){
            $rootScope.GLoading=true;
            var chosen={id:[]};
            var judg=0;
            if(typeof(Ids)=='string' )  chosen.id.push(Ids);   //单独处理
            else                                                    //批量处理
                Ids.forEach(function (I) {
                    chosen.id.push(I);
                    judg=1;
                });
            List.CancelQ('instance/real', chosen).then(function (res) {
                $rootScope.GLoading=false;
                if(res.status==="success"){
                    Others.showInfo(res.status, "实例删除成功");
                    chosen.id.forEach(function (I) {
                        $scope.Lists = $scope.Lists.filter(item => item.id !== I);   //更新视图
                    });
                    if(judg===0) $scope.selected=$scope.selected.filter(item => item!==chosen.id[0]);
                    else if(judg===1) $scope.selected=[];                                               //清除所有checkbox
                    if($scope.Lists.length===0) errorOcc('没有任何内容');
                }else {
                    Others.showInfo('failure', res.reason);
                }
            }, function (res) {
                $rootScope.GLoading=false;
                Others.showInfo('failure', "删除失败：连接服务器失败");
            })
        }

        $scope.Q_Operation = function (Ids) {       //弹窗提醒
            Others.showAlert('操作确认','您确定要删除所选的实例吗？这将无法撤销。',Management, Ids);
        };


        $scope.toggleRight =  function () { //打开/关闭 筛选器
            $mdSidenav('left').toggle();
            if ($mdSidenav('left').isOpen()){
                document.getElementById('Open_icon').className="glyphicon glyphicon-chevron-left";
            }else {
                document.getElementById('Open_icon').className="glyphicon glyphicon-chevron-right";
            }
        };

        $scope.toggleRight_1=function(){     //关闭筛选器
            if ($mdSidenav('left').isOpen()) $scope.toggleRight();
        };

        $scope.toggleRight_2=function(){     //关闭筛选器
            if (!$mdSidenav('left').isOpen()) $scope.toggleRight();
        };

        $scope.clearInput = function(){     //清空输入
            $scope.query='';
        };

        $element.find('input').on('keydown', function(ev) { //搜索分类
            ev.stopPropagation();
        });



        $scope.first_levels = ['结构动力学概述'];

        $scope.second_levels = ['结构动力学分析'];

        $scope.third_levels = ['主要目的'];

        $scope.selectedFirstL = "结构动力学概述"; //默认
        $scope.selectedSecondL  = "结构动力学分析";
        $scope.selectedThirdL = '主要目的';

        $scope.refreshData=function(first, second, third){ //查询按钮
            let Params={
                first_level : first,
                second_level : second,
                third_level : third
            };
            QueryList(Params);
            $scope.selected=[];
        };

        $scope.Restore=function () {        //复原按钮
            QueryList(defaultParams);
            $scope.selected=[];
            $scope.selectedFirstL = "结构动力学概述"; //默认
            $scope.selectedSecondL  = "结构动力学分析";
            $scope.selectedThirdL = '主要目的';
        };

        $scope.scrollTo = function(id) {    //定位题目ID
            $location.hash(id);
            $anchorScroll();
        };

    });
