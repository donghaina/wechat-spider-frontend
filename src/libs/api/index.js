import axios from 'axios';
import config from './config';

let uAxios = axios.create(config);

// http request 拦截器
uAxios.interceptors.request.use(config => {
    // config.headers.Authorization = 'Bearer';
    return config;
}, error => {
    return Promise.reject(error);
});

// http response 拦截器
uAxios.interceptors.response.use(response => {
    if (response.status === 200 && response.data.code === 2) { // token过期
        location.assign('/#/login');
    }
    return response;
}, error => {
    return Promise.resolve(error.response);
});

export default uAxios;
