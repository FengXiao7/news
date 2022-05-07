import axios from 'axios';
import { useEffect, useState } from 'react'
import {notification} from 'antd'
const usePublish = (type) => {
    // 表格数据源
    const [dataSource, setDataSource] = useState([]);
    //当前登录用户
    const { username } = JSON.parse(localStorage.getItem('token'))
    //获取表格信息
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`)
            .then(res => setDataSource(res.data))
    }, [username, type]);
    //未发布的发布按钮回调
    const handlePublish = (id) => {
        setDataSource(dataSource.filter(d => d.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement: "top"
            });
        })
    }
    // 已发布的下线按钮回调
    const handleSunset = (id) => {
        setDataSource(dataSource.filter(d => d.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到【发布管理/已下线】中查看您的新闻`,
                placement:"top"
            });
        })
    }
    //已下线的删除按钮回调
    const handleDelete = (id) => {
        setDataSource(dataSource.filter(d => d.id !== id))
        axios.delete(`/news/${id}`)
        .then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您已经删除了已下线的新闻`,
                placement:"top"
            });
        })
    }
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    };
}
export default usePublish
