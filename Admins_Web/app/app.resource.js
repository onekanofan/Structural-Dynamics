//创建资源服务
angular.module('Resources', ['ngResource', 'helper',])
    .factory('ListResources', function ($resource, AppConstants) {
        return $resource(AppConstants.URL_BASE + '/:interface', {}, {
            //自定义config
            postT : {
                method :'POST',
                hasBody : false
            },
            getU : {
                method :'GET',
                hasBody : false
            },
            admin : {
                method: 'PUT',
                hasBody : true,
                headers : {
                    'Content-Type' : undefined    //上传multipart/form-data时的请求头
                }
            },
            deleteA : {
                method : 'DELETE',
                hasBody : true,
                headers : {
                    'Content-Type' : undefined
                }
            },
            delete : {
                method : 'DELETE',
                hasBody : true,
                headers : {
                    'Content-Type' : 'application/json;charset=UTF-8'
                }
            },
            put : {
                method : 'PUT',
                hasBody : true,
                headers : {
                    'Content-Type' : 'application/json;charset=UTF-8'
                }
            },
            get_timu : {
                method : 'POST',
                hasBody : true,
                headers : {
                    'Content-Type' : 'application/json;charset=UTF-8'
                }
            },
            get_instance : {
                method : 'POST',
                hasBody : false
            },
            login : {
                method : 'POST',
                hasBody : true,
                headers : {
                    'Content-Type' : undefined    //上传multipart/form-data时的请求头
                }
            }
        });
    })
    .factory('JWTinterceptor', function ($state, Others) {
        return {
            request : function (config) {
                config.headers.Token = localStorage.getItem("token") || "";
                return config;
            },

            response : function (response) {
                let res=response.data;
                if(res.status==='failure'&&res.reason==="Log in again"){
                    Others.showInfo(res.status,'您的令牌已失效，请重新登录');
                    $state.go('Login',{info:'您的令牌已失效，请重新登录'});
                }
                return response;
            }
        }
    })
    .config(function Config($httpProvider) {
        $httpProvider.interceptors.push('JWTinterceptor');
    });




