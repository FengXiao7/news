import React from 'react';
import ReactDOM from 'react-dom';
import './util/http'
import App from './App';
// 导入中文语言包
import 'moment/locale/zh-cn';
import moment from 'moment'
// 设置中文
moment.locale('zh-cn');

ReactDOM.render(
    <App />
  ,
  document.getElementById('root')
);

