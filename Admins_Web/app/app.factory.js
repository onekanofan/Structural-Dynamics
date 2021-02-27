'use strict';
//接口
angular.module('questionList', ['Resources', 'ngResource'])
    .factory('List', function ($q, $http, ListResources) {
        return {
            Token : function (inter){
                var defer = $q.defer();
                ListResources.postT({
                    interface : inter,
                }, function (res, headers) {
                    defer.resolve(res);
                }, function (res, headers) {
                    defer.reject(res);
                });
                return defer.promise;
            },
            GetList : function (inter, content) {  //获取队列
                var defer = $q.defer();
                ListResources.get({
                    interface : inter,
                    content : content
                }, function (res, headers) {
                    defer.resolve(res);
                }, function (res, headers) {
                    defer.reject(res);
                });
                return defer.promise;
            },
            AddQ : function (inter, timu_ids) {      //添加题目
                var defer = $q.defer();
                ListResources.save({interface : inter}, timu_ids, function (res, headers) {
                    defer.resolve(res);
                }, function () {
                    defer.resolve(res);
                });
                return defer.promise;
            },
            CancelQ : function (inter, timu_ids) {      //取消题目
                var defer = $q.defer();
                ListResources.delete({interface : inter}, timu_ids, function (res, headers) {
                    defer.resolve(res);
                }, function () {
                    defer.resolve(res);
                });
                return defer.promise;
            },
            UpdateQ : function (inter, timu_ids) {      //确认题目
                var defer = $q.defer();
                ListResources.put({interface : inter}, timu_ids, function (res, headers) {
                    defer.resolve(res);
                }, function () {
                    defer.resolve(res);
                });
                return defer.promise;
            },
            ManageList : function (inter, params) {  //管理题目
                var defer = $q.defer();
                ListResources.get_timu({
                    interface : inter
                }, params, function (res, headers) {
                    defer.resolve(res);
                }, function (res, headers) {
                    defer.reject(res);
                });
                return defer.promise;
            },
            InstanceList : function (inter, params) {  //管理题目
                var defer = $q.defer();
                ListResources.get({
                    interface : inter,
                    first_level : params.first_level,
                    second_level : params.second_level,
                    third_level : params.third_level
                }, function (res, headers) {
                    defer.resolve(res);
                }, function (res, headers) {
                    defer.reject(res);
                });
                return defer.promise;
            },
            AdminLogin : function (inter, formdata) {
                var defer = $q.defer();
                ListResources.login({interface : inter}, formdata, function (res, headers) {
                    defer.resolve(res);
                }, function () {
                    defer.resolve(res);
                });
                return defer.promise;
            },
            GetU : function (inter) {
                var defer = $q.defer();
                ListResources.getU({
                    interface : inter
                }, function (res, headers) {
                    defer.resolve(res);
                }, function (res, headers) {
                    defer.reject(res);
                });
                return defer.promise;
            },
            GetAdmin : function (inter) {
                var defer = $q.defer();
                ListResources.getU({
                    interface : inter
                }, function (res, headers) {
                    defer.resolve(res);
                }, function (res, headers) {
                    defer.reject(res);
                });
                return defer.promise;
            },
            ChangePOA : function (inter, formdata) {
                var defer = $q.defer();
                ListResources.admin({interface : inter}, formdata, function (res, headers) {
                    defer.resolve(res);
                }, function () {
                    defer.resolve(res);
                });
                return defer.promise;
            },
            DeleteA : function (inter, formdata) {
                var defer = $q.defer();
                ListResources.deleteA({interface : inter}, formdata, function (res, headers) {
                    defer.resolve(res);
                }, function () {
                    defer.resolve(res);
                });
                return defer.promise;
            }
        }
    })
    .factory('Others', function ($state, $rootScope){
        return {
            setAdminInfo : function(info) {
                $rootScope.AdminInfo.username = info.username;
                $rootScope.AdminInfo.ID = info.admin_id;
                $rootScope.AdminInfo.root = info.is_root;
            },
            Cancellation : function() {
                localStorage.removeItem("token");
                this.showInfo('failure','您已注销，请重新登录');
                $state.go('Login',{info:'您已注销，请重新登录'});
            },
            /**
             * @return {string}
             */
            Bin2String : function (array) {
                return String.fromCharCode.apply(String, array);    //字节数组转字符串
            },
            showAlert: function (header, content, func) {
                $rootScope.Alert.ifSuper=false;
                $rootScope.Alert.header=header;
                $rootScope.Alert.content=content;
                document.getElementById('showAlert').style.display='flex';
                setTimeout("document.getElementById('showAlert').className='showAlert'", 1 );
                let parameters=arguments;
                let watch = $rootScope.$watch('Alert.ifConfirm',function(newVal,oldVal) {
                    if(newVal===1) {
                        if(parameters.length===4) func(parameters[3]);
                        if(parameters.length===5) func(parameters[3], parameters[4]);
                        document.getElementById('showAlert').className='Alert';
                        setTimeout("document.getElementById('showAlert').style.display='none'", 300 );
                        watch();    //关闭盒子时取消监听
                    }else if(newVal===-1){
                        document.getElementById('showAlert').className='Alert';
                        setTimeout("document.getElementById('showAlert').style.display='none'", 300 );
                        watch();    //关闭盒子时取消监听
                    }
                    $rootScope.Alert.ifConfirm=0;
                });
            },
            showSuperAlert: function (header, content, func, tar) {
                $rootScope.Alert.ifSuper=true;
                $rootScope.Alert.header=header;
                $rootScope.Alert.content=content;
                $rootScope.Alert._target=tar;
                $rootScope.Alert._current='';
                document.getElementById('showAlert').style.display='flex';
                setTimeout("document.getElementById('showAlert').className='showAlert'", 1 );
                let watch = $rootScope.$watch('Alert.ifConfirm',function(newVal,oldVal) {
                    if(newVal===1&&$rootScope.Alert._current===tar) {
                        func(tar);
                        document.getElementById('showAlert').className='Alert';
                        setTimeout("document.getElementById('showAlert').style.display='none'", 300 );
                        watch();    //关闭盒子时取消监听
                    }else if(newVal===-1){
                        document.getElementById('showAlert').className='Alert';
                        setTimeout("document.getElementById('showAlert').style.display='none'", 300 );
                        watch();    //关闭盒子时取消监听
                    }
                    $rootScope.Alert.ifConfirm=0;
                });
            },
            showInfo: function (status, content) {
                $rootScope.showInfo.type=status+'Info';
                $rootScope.showInfo.content=content;
                document.getElementById('showInfo').style.display='block';
                document.getElementById('showInfo').className='slide_';
                setTimeout("document.getElementById('showInfo').className='slide_In'",1);
                setTimeout(countDown,3000);
                function countDown(){
                    if(document.getElementById('showInfo').className==='slide_In') {
                        document.getElementById('showInfo').className='slide_Out';
                        setTimeout("document.getElementById('showInfo').style.display='none'", 200 );
                        setTimeout("document.getElementById('showInfo').className='slide_';", 201 );
                    }
                }
            }
        }
    });

