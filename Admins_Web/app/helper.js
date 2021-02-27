'use strict';

angular.module('helper', [])
    .factory('AppConstants', function () {
        var self = {};
        var host = 'xn--app-gw2eict95eluu4t6b.work';
        var base = 'https://' + host;
        self.URL_BASE = base;

        return self;
    });
