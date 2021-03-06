import * as types from './mutation-types.js'

//用户操作
//请求参数说明
//obj = {
//  account: 0, //用户帐号
//}
export const user = ({ dispatch, state }, obj, cb) => {
    if (!obj){
        obj = {}
    }

    obj.account = obj.account ? obj.account : state.everyday_init.user.account 
    
    setTimeout(() => {
        myApp.requestApi(state.everyday_init.request.user, obj, function(data){
            
            dispatch(types.INIT_USER_INFO, data.data) //更新基本信息
            obj.type == 'login' && init({ dispatch, state })
            cb && cb()
        })
    }, 350) 
}
//更新基本信息
//请求参数说明
//obj = {
//  account: 0, //用户帐号
//  date: '', //日期，如：'2016-8-30'
//}
export const init = ({ dispatch, state }, obj) => {
    if (!obj){
        obj = {}
    }

    obj.account = obj.account ? obj.account : state.everyday_init.user.account 
    obj.date = obj.date ? obj.date : state.everyday_init.schedule.date

    setTimeout(() => {
        myApp.requestApi(state.everyday_init.request.init, obj, function(data){
            
            dispatch(types.UPDATE_SCHEDULE, data.data) //更新基本信息
        }, false
        // ,function (failure_data){
        //     if (failure_data.code == -4){

        //     }
        // }
        )
    }, 350) 
}

//日程操作
//请求参数说明
//obj = {
//  account: 0, //用户帐号
//  date: '', //日期，如：'2016-8-30'
//}
export const schedule = ({ dispatch, state }, obj, cb) => {
    if (!obj){
        obj = {}
    }

    obj.account = obj.account ? obj.account : state.everyday_init.user.account 
    obj.date = obj.date ? obj.date : state.everyday_init.schedule.date

    setTimeout(() => {
        myApp.requestApi(state.everyday_init.request.schedule, obj, function(data){
            
            // dispatch(types.UPDATE_SCHEDULE, data.data) //更新基本信息
            init({ dispatch, state })
            cb && cb()
        })
    }, 350) 
}

myApp.requestApi = function (url, parameter, success, Indicator, failure){
    if(parameter == null){
        parameter = {};
    }
    parameter.callback = 1;
    parameter.debug = 0;

    //透传参数
    var urlString = window.location.href;
    var extendParameter = $$.parseUrlQuery(urlString);
    //过滤参数里的hash #
    extendParameter = _.mapObject(extendParameter, function(val, key) {
        if(val.toString().indexOf('#') != -1){
            return val.toString().substr(0, val.toString().indexOf('#'));
        }else {
            return val;
        }
    });
    parameter = _.extend(extendParameter, parameter);

    //接口匹配环境
    var host;
    if(urlString.indexOf('104.194.91.164') != -1){
        host = 'http://104.194.91.164:3030/';
    }
    else {
        host = 'http://localhost:3030/';
    }
    url = url.indexOf('http://') != -1 ? url : host + url;
    //菊花是否静默
    if(Indicator){}else {
        myApp.showIndicator();
    }

    $$.ajax({
        method: "get",
        async: true,
        url: url,
        crossDomain: true,
        dataType: 'json',
        timeout: 30 * 1000,
        data: parameter,
        success: function (data) {
            setTimeout(function(){
                myApp.hideIndicator();
            }, 380);

            if (data.code === 0) {
                if(success) success(data);
            }else{
                if(failure) {
                    failure(data)
                } else {
                    myApp.alert(data.msg + " (" + data.code + ")" );
                }
                

            }
        },
        error: function () {
            setTimeout(function(){
                myApp.hideIndicator();
            }, 300);

            console.log('error-page');
            myApp.networkErrorProcess();

        }
    });
}