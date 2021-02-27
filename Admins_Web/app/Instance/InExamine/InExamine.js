'use strict';

angular.module('InExamine', ['questionList'])
    .config(function ($stateProvider) {
        $stateProvider.state('Instance.Examine', {
            url : '/Examine',
            views : {
                'sidenv' : {
                    templateUrl : 'app/Instance/Instance.html',
                    controller : 'InExamineSidenvCtrl'
                },
                'content' : {
                    templateUrl : 'app/Instance/InExamine/InExamine.html',
                    controller : 'InExamineCtrl'
                }
            }
        });
    })

    .controller('InExamineSidenvCtrl', function ($scope) {
        $scope.selectedPage = 'Examine';
        document.getElementById($scope.selectedPage).className = 'list_item sel_item';
    })
    .controller('InExamineCtrl', function ($scope, $rootScope, List, $mdSidenav, $location, $anchorScroll, Others) {
        localStorage.setItem('Instance','Examine');
        $scope.DLoading=true;
        $scope.noContent=false;
        $scope.Lists=[];
        List.GetList('instance/tmp','add').then(function (res) {
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

        //复选框的已选择列表
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

        function Examine(Ids, op){
            $rootScope.GLoading=true;
            var chosen={id:[]};
            var judg=0;
            if(typeof(Ids)=='string' )  chosen.id.push(Ids);   //单独处理
            else                                                    //批量处理
                Ids.forEach(function (I) {
                    chosen.id.push(I);
                    judg=1;
                });
            if(op==='confirm'){
                List.AddQ('instance/tmp',chosen).then(function (res) {
                    $rootScope.GLoading=false;
                    if(res.status==="success"){
                        Others.showInfo(res.status, "实例添加成功，请在例库中查看");
                        chosen.id.forEach(function (I) {
                            $scope.Lists=$scope.Lists.filter(item => item.id!==I);   //更新视图
                        });
                        if(judg===0) $scope.selected=$scope.selected.filter(item => item!==chosen.id[0]);
                        else if(judg===1) $scope.selected=[];                                               //清除所有checkbox
                        if($scope.Lists.length===0) errorOcc('没有任何内容');
                    }else {
                        Others.showInfo('failure', res.reason);
                    }
                },function (res) {
                    $rootScope.GLoading=false;
                    Others.showInfo('failure', "添加失败：连接服务器失败");
                })
            }else if(op==='delete'){
                List.CancelQ('instance/tmp',chosen).then(function (res) {
                    $rootScope.GLoading=false;
                    if(res.status==="success"){
                        Others.showInfo(res.status, "实例删除成功");
                        chosen.id.forEach(function (I) {
                            $scope.Lists=$scope.Lists.filter(item => item.id!==I);   //更新视图
                        });
                        if(judg===0) $scope.selected=$scope.selected.filter(item => item!==chosen.id[0]);
                        else if(judg===1) $scope.selected=[];
                        if($scope.Lists.length===0) errorOcc('没有任何内容');
                    }else {
                        Others.showInfo('failure', res.reason);
                    }
                },function (res) {
                    $rootScope.GLoading=false;
                    Others.showInfo('failure', "删除失败：连接服务器失败");
                })
            }
        }

        $scope.Q_Operation = function (Ids, op) {
            if(op==='confirm') Others.showAlert('操作确认', '您确定要添加所选的实例吗？这些题目将在例库中显示。', Examine, Ids, op);
            if(op==='delete') Others.showAlert('操作确认', '您确定要撤回所选的实例吗？', Examine, Ids, op);
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


        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        }

    })
    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });
