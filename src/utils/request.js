import axios from 'axios';
import store from '@/store';
import { getApi } from './api';
import { Message, MessageBox } from 'element-ui';
// import { getToken } from '@/utils/auth' // 验权

// 修改全局默认值
axios.defaults.headers.post['Content-Type'] = 'application/json';

var path = ''
/*第一层if判断生产环境和开发环境*/
if (process.env.NODE_ENV === 'production') {
  /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
  console.log(process.env.VUE_APP_FLAG)
  if (process.env.VUE_APP_FLAG === 'pro') {
      //production 生产环境
      // path = 'http://api.xinggeyun.com';//路径

  } else {
      //test 测试环境
      path = 'http://192.168.0.152:8102';//路径
} } else { //dev 开发环境 axios.defaults.baseURL = 'http://192.168.0.152:8102';//路径

}

// 创建axios实例
const service = axios.create({
  // baseURL: "http://192.168.0.106:8094/boluo-crm/",
  baseURL: process.env.BASE_API, // api 的 base_url
  // baseURL:path,
  timeout: 120000 // 请求超时时间
  // withCredentials: true
});

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['__vt_param__'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    const { loadKey } = config;
    const opt = loadKey ? { key: loadKey, flg: true } : true;
    // store.dispatch('SetLoading', opt);
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    // 获取响应及配置项
    const { data, data: { message, code, loginUrl }, config: { loadKey, hideMsg }, request: { responseType } } = response;
    // const { config: { loadKey, hideMsg }} = response
    // // 如果是res.data格式为字符串，需转成对象
    // let { data } = response
    // if (typeof data === 'string') {
    //   data = JSON.parse(data)
    // }
    // const { message, code, loginUrl } = data
    // 重置Loading
    const opt = loadKey ? { key: loadKey, flg: false } : false;
    // store.dispatch('SetLoading', opt);
    // 正常响应
    if (code === 1 || responseType === 'blob') {
      return data;
    }
    // 1001:未登录或已超时; 50012:其他客户端登录了;  50014:Token 过期了;
    if (code === 1001 || code === 50012 || code === 50014) {
      store.dispatch('FedLogOut', loginUrl);
      // MessageBox.alert(
      //   '你已被登出，可以取消继续留在该页面，或者重新登录',
      //   '确定登出', 
      //   {
      //     confirmButtonText: '重新登录',
      //     callback: action => {
      //       store.dispatch('FedLogOut', loginUrl);
      //     }
      // });
      // MessageBox.confirm(
      //   '你已被登出，可以取消继续留在该页面，或者重新登录',
      //   '确定登出',
      //   {
      //     confirmButtonText: '重新登录',
      //     // cancelButtonText: '取消',
      //     type: 'warning'
      //   }
      // ).then(() => {
      //   store.dispatch('FedLogOut', loginUrl);
      // });
    }

    if (!hideMsg) {
      Message({
        message: message,
        type: 'error',
      });
    } else {
      typeof hideMsg === 'function' && hideMsg(data);
    }

    return Promise.reject(data);
  },
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

const http = {
  async get(api, params, config = {}, headers = {}, flg) {
    try {
      return await service({
        url: flg ? api : getApi(api),
        params,
        headers,
        ...config,
      });
    } catch (error) {
      throw error;
    }
  },
  async post(api, data, config = {}, headers = {}, flg) {
    try {
      return await service({
        url: flg ? api : getApi(api),
        method: 'post',
        data,
        ...headers,
        ...config
      });
    } catch (error) {
      throw error;
    }
  }
};
export const request = async(api, data, config = {}, headers = {}) => {
  try {
    const apiObj = getApi(api).split(',');
    return http[apiObj[0]](apiObj[1], data, config, headers, true);
  } catch (error) {
    console.error(`请检查 ${ api } 的请求方式是否填写`);
    throw error;
  }
};

export const reqInit = module => async(api, data, config, headers) => request(`${module}_${api}`, data, config, headers);

export default http;
