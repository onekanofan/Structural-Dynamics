'use strict';

angular.module('Management', ['questionList', 'Resources'])
    .config(function ($stateProvider) {
        $stateProvider.state('Library.Management', {
            url : '/Management',
            views : {
                'sidenv' : {
                    templateUrl : 'app/Library/Library.html',
                    controller : 'ManagementSidenvCtrl'
                },
                'content' : {
                    templateUrl : 'app/Library/Management/Management.html',
                    controller : 'ManagementCtrl'
                }
            }

        });
    })

    .controller('ManagementSidenvCtrl', function ($scope) {
        $scope.selectedPage = 'Management';
        document.getElementById($scope.selectedPage).className='list_item sel_item';
    })
    .controller('ManagementCtrl', function ($scope, $rootScope, List, $mdSidenav, $location, $anchorScroll, $element, Others) {
        localStorage.setItem('Library','Management');

        $scope.Lists = [];
        $scope.DLoading=true;
        $scope.noContent=false;
        function QueryList(Params){
            $scope.Lists = [];
            List.ManageList('timu', Params).then(function (res) {
                if(res.status==="success") {
                    $scope.Lists=res.data;
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
            keywords:"全部",
            category:"全部"
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
                    $scope.selected[i]=$scope.Lists[i].timu_id;
                }
            }
        };

        //删除题目的方法
        function Management(Ids){
            $rootScope.GLoading=true;
            var chosen={timu_id:[]};
            var judg=0;
            if(typeof(Ids)=='string' )  chosen.timu_id.push(Ids);   //单独处理
            else                                                    //批量处理
                Ids.forEach(function (I) {
                    chosen.timu_id.push(I);
                    judg=1;
                });
            List.CancelQ('timu', chosen).then(function (res) {
                $rootScope.GLoading=false;
                if(res.status==="success"){
                    Others.showInfo(res.status, "题目删除成功");
                    chosen.timu_id.forEach(function (I) {
                        $scope.Lists = $scope.Lists.filter(item => item.timu_id !== I);   //更新视图
                    });
                    if(judg===0) $scope.selected=$scope.selected.filter(item => item!==chosen.timu_id[0]);
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
            Others.showAlert('操作确认','您确定要删除所选的题目吗？这将无法撤销。',Management, Ids);
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

        $scope.categories = ['全部','单自由度' ,'多自由度' ,'数值方法' ,'分布参数系统' ,'随机振动', '地震工程','风工程',
            '振动控制','结构监测','人致振动','生活中的振动','多体动力学','非线性动力学','其他动力学'];

        $scope.keywords = ['全部','周期','频率','阻尼','公式推导','位移','生物力学','刚度','隔振','自由衰减','加速度',
            '振幅','DOF','拍','摩擦','支座运动'];

        $scope.selectedcategory = "全部"; //默认
        $scope.selectedkeyword  = ["全部"];

        $scope.refreshData=function(cate, key){ //查询按钮
            let Params={
                keywords:key.includes("全部")?"全部":key,
                category:cate
            };
            QueryList(Params);
            $scope.selected=[];
        };

        $scope.Restore=function () {        //复原按钮
            QueryList(defaultParams);
            $scope.selected=[];
            $scope.selectedcategory = "全部"; //默认
            $scope.selectedkeyword  = ["全部"];
        };

        $scope.scrollTo = function(id) {    //定位题目ID
            $location.hash(id);
            $anchorScroll();
        };

    });
