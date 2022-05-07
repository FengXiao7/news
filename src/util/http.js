import axios from 'axios'
import {store} from '../redux/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//干三件事
//1.进度条 
//2.loading
//3.baseURL



axios.defaults.baseURL="http://localhost:8000"

axios.interceptors.request.use(function (config) {
    nprogress.start()
    store.dispatch({
        type:'change_isLoading',
        payLoad:true
    })
    return config;
  }, function (error) {

    return Promise.reject(error);
  });


axios.interceptors.response.use(function (response) {
    nprogress.done()
    store.dispatch({
        type:'change_isLoading',
        payLoad:false
    })
    return response;
  }, function (error) {
    return Promise.reject(error);
  });