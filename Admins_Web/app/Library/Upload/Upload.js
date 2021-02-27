'use strict';

angular.module('Upload', ['helper'])
    .config(function ($stateProvider) {
        $stateProvider.state('Library.Upload', {
            url : '/Upload',
            views : {
                'sidenv' : {
                    templateUrl : 'app/Library/Library.html',
                    controller : 'UploadSidenvCtrl'
                },
                'content' : {
                    templateUrl : 'app/Library/Upload/Upload.html',
                    controller : 'UploadCtrl'
                }
            }
        });
    })

    .controller('UploadSidenvCtrl', function ($scope) {
        $scope.selectedPage = 'Upload';
        document.getElementById($scope.selectedPage).className = 'list_item sel_item';
    })
    .controller('UploadCtrl', function ($scope, FileUploader, AppConstants) {
        localStorage.setItem('Library','Upload');

        var uploader = $scope.uploader = new FileUploader({
            url : AppConstants.URL_BASE + '/upload/exercise',
            method : "POST",
            alias : "zip_file",
            headers : {
                'Token' : localStorage.getItem('token')
            }
            //,timeout: 2000
        });

        // FILTERS

        // a sync filter
        uploader.filters.push({
            name : 'syncFilter',
            fn : function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 99;
            }
        });

        // an async filter
        uploader.filters.push({
            name : 'asyncFilter',
            fn : function (item /*{File|FileLikeObject}*/, options, deferred) {
                setTimeout(deferred.resolve, 1e3);
            }
        });

        /*实时检测列表高度以确定是否添加进度条*/
        var wrap_height = document.getElementById("table_wrap");
        wrap_height.addEventListener('DOMSubtreeModified', function () {
            if (wrap_height.offsetHeight >= 450) wrap_height.className = "table_wrap table_wrap_active"; else wrap_height.className = "table_wrap";
        }, false);

        // CALLBACKS

        $scope.Info = [];

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {  //加载文件失败
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function () {
            $scope.showQR = true;

        };
        uploader.onAfterAddingAll = function () {
            $scope.showQR = false;
        };

        function getCurrentTime(){
            let time = new Date();
            return Add0(time.getHours(),2)+':'+Add0(time.getMinutes(),2)+':'+Add0(time.getSeconds(),2)+':'+Add0(time.getMilliseconds(),3);
        }

        /**
         * @return {string}
         */
        function Add0(tar, num){
            var len = tar.toString().length;
            while(len < num) {
                tar = "0" + tar;
                len++;
            }
            return tar;
        }

        uploader.onSuccessItem = function (fileItem, response) {   //上传成功，从服务器返回信息（包含错误信息）
            let info = {};
            info.filename = fileItem.file.name;
            info.time = getCurrentTime();
            if (response.status === 'failure') {
                info.state = '添加失败';
                info.detail = response.error;
                info.isError = 'error';
                fileItem.state = 'failure';
                fileItem.isAdd = '添加失败';
            } else if (response.status === 'success') {
                info.state = '添加成功';
                info.detail = '请在审核队列中查看';
                info.isError = '_success';
                fileItem.state = 'success';
                fileItem.isAdd = '添加成功';
            }
            $scope.Info.push(info);
            if($scope.UInfo==='') $scope.UInfo='Half_info';
        };
        uploader.onErrorItem = function (fileItem) {     //上传失败
            let info = {};
            info.filename = fileItem.file.name;
            info.time = getCurrentTime();
            info.state = '上传失败';
            info.detail = '连接服务器失败';
            info.isError = 'error';
            fileItem.state = 'failure';
            $scope.Info.push(info);
        };

        uploader.onCancelItem = function (fileItem){
            let info = {};
            info.filename = fileItem.file.name;
            info.time = getCurrentTime();
            info.state = '已取消';
            info.detail = '用户主动操作';
            info.isError = 'error';
            fileItem.state = 'failure';
            $scope.Info.push(info);
        };

        uploader.onCompleteAll = function (){
            $scope.UInfo='Open_info';
        };

        $scope.UInfo='';
        $scope.Upload_info=function() {
            if($scope.UInfo===''||$scope.UInfo==='Half_info') $scope.UInfo='Open_info';
            else $scope.UInfo='';
        };

        $scope.ClearInfo=function () {
            $scope.Info.length=0;
            $scope.UInfo='';
        }

    })
    .filter('reverse', function () {
        return function (items) {
            return items.slice().reverse();
        };
    });
