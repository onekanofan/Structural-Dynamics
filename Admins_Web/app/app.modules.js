'use strict';

angular.module('Navigator', [
    'Library',            //题库导航
    'Instance',
    'UserManage'
])
    .filter('trustHtml', function ($sce) { //解释html标签
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
