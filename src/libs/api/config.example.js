import QS from 'qs';

export default {
  baseURL: 'http://127.0.0.1:5000',
  method: 'GET',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  params: {},
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
  maxContentLength: 2000,
  validateStatus: function (status) {
    return status >= 200 && status < 400;
  },
  maxRedirects: 5,
  transformRequest: [data => QS.stringify(data)],
  paramsSerializer: params => QS.stringify(params),
  data: {
    XDEBUG_SESSION_START: 1
  }
};
