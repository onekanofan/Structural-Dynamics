'use strict';

angular.module('Update',['questionList'])
    .config(function ($stateProvider) {
        $stateProvider.state('Library.Update', {
            url:'/Update',
            views : {
                'sidenv' : {
                    templateUrl : 'app/Library/Library.html',
                    controller : 'UpdateSidenvCtrl'
                },
                'content' : {
                    templateUrl: 'app/Library/Update/Update.html',
                    controller: 'UpdateCtrl'
                }
            }

        });
    })

    .controller('UpdateSidenvCtrl', function ($scope) {
        $scope.selectedPage = 'Update';
        document.getElementById($scope.selectedPage).className='list_item sel_item';
    })
    .controller('UpdateCtrl', function($scope, $rootScope, List, $mdSidenav, $location, $anchorScroll, Others) {
        localStorage.setItem('Library','Update');
        $scope.DLoading=true;
        $scope.noContent=false;
        $scope.Lists=[];
        List.GetList('tmp_timu','update').then(function (res) {
            //调整数据格式：
            if(res.status==="success") {
                var tmp=[];
                for (var item in res.data.new){
                    var NaO={new:{},old:{}};
                    NaO.new=res.data.new[item];
                    NaO.old=res.data.old[item];
                    tmp.push(NaO);
                }
                $scope.Lists=tmp;
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
                    $scope.selected[i]=$scope.Lists[i].new.timu_id;
                }
            }
        };

        function Update(Ids, op){
            $rootScope.GLoading=true;
            var chosen={timu_id:[]};
            var judg=0;
            if(typeof(Ids)=='string' )  chosen.timu_id.push(Ids);   //单独处理
            else                                                    //批量处理
                Ids.forEach(function (I) {
                    chosen.timu_id.push(I);
                    judg=1;
                });
            if(op==='replace'){
                List.UpdateQ('tmp_timu',chosen).then(function (res) {
                    $rootScope.GLoading=false;
                    if(res.status==="success"){
                        Others.showInfo(res.status, "题目更新成功，请在题库中查看");
                        chosen.timu_id.forEach(function (I) {
                            $scope.Lists=$scope.Lists.filter(item => item.new.timu_id!==I);   //更新视图
                        });
                        if(judg===0) $scope.selected=$scope.selected.filter(item => item!==chosen.timu_id[0]);
                        else if(judg===1) $scope.selected=[];                                               //清除所有checkbox
                        if($scope.Lists.length===0) errorOcc('没有任何内容');;
                    }else {
                        Others.showInfo('failure', res.reason);
                    }
                },function (res) {
                    $rootScope.GLoading=false;
                    Others.showInfo('failure', "更新失败：连接服务器失败");
                })
            }else if(op==='cancel'){
                List.CancelQ('tmp_timu',chosen).then(function (res) {
                    $rootScope.GLoading=false;
                    if(res.status==="success"){
                        Others.showInfo(res.status, "题目撤销成功");
                        chosen.timu_id.forEach(function (I) {
                            $scope.Lists=$scope.Lists.filter(item => item.new.timu_id!==I);   //更新视图
                        });
                        if(judg===0) $scope.selected=$scope.selected.filter(item => item!==chosen.timu_id[0]);
                        else if(judg===1) $scope.selected=[];                                               //清除所有checkbox
                        if($scope.Lists.length===0) errorOcc('没有任何内容');
                    }else {
                        Others.showInfo('failure', res.reason);
                    }
                },function (res) {
                    $rootScope.GLoading=false;
                    Others.showInfo('failure', "撤销失败：连接服务器失败");
                })
            }
        }

        $scope.Q_Operation = function (Ids, op) {
            if(op==='replace') Others.showAlert('操作确认', '您确定要更新所选的题目吗？这些题目将在题库中显示。', Update, Ids, op);
            if(op==='cancel') Others.showAlert('操作确认', '您确定要撤销所选的题目吗？这将无法撤销。', Update, Ids, op);
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

        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        }
    });
