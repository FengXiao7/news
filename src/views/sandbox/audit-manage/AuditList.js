import React, { useState, useEffect } from 'react'
import { Table, Button, Tag, Popconfirm, Tooltip, notification } from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'

import {categoryIconList,auditList,colorState} from '../../../util/mappingTable'

export default function AuditList(props) {
    //表格数据源
    const [dataSource, setDataSource] = useState([])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render(title, item) {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            render(item) {
                return <span>{categoryIconList[item.categoryId]}{item.category.title}</span>
            }
        },
        {
            title: '审核状态',
            render(item) {
                return <Tag color={colorState[item.auditState]}>{auditList[item.auditState]}</Tag>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 &&
                        <Popconfirm
                            title="确定撤销吗？这会将审核列表中的新闻传回草稿箱"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => handleRervert(item)}
                        >
                            <Tooltip placement="bottomLeft" title={<span>撤销新闻</span>} >
                                <Button>撤销</Button>
                            </Tooltip>
                        </Popconfirm>
                    }
                    {
                        item.auditState === 2 &&
                        <Popconfirm
                            title="确定发布吗？这会将审核列表中的新闻传入发布管理中"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => handlePublish(item)}
                        >
                            <Tooltip placement="bottomLeft" title={<span>发布新闻</span>} >
                                <Button danger>发布</Button>
                            </Tooltip>
                        </Popconfirm>
                      
                    }
                    {
                        item.auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>更新</Button>
                    }
                </div>
            }
        }
    ]
    // 获取用户名
    const { username } = JSON.parse(localStorage.getItem('token'))
    // 撤销按钮回调
    const handleRervert = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        // 把auditState又变回0就行
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            props.history.push('/news-manage/draft')
            notification.info({
                message: `通知`,
                description:
                    `您可以到草稿箱中查看您的新闻`,
                placement: "top"
            });

        })
    }
    // 发布按钮回调,一定不要忘了加上发布时间！
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            "publishState": 2,
            "publishTime":Date.now(),
        }).then(res => {
            props.history.push('/publish-manage/published')

            notification.info({
                message: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement: "top"
            });
        })
    }
    // 更新按钮回调
    const handleUpdate = (item) => {
        // 直接跳转就行
        props.history.push(`/news-manage/update/${item.id}`)
    }
    //获得表格数据源
    useEffect(() => {
        // 自己，auditState不为0，publishState小于等于1，_expand=category为了找到分类名
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [username])


    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={(item) => item.id}
        />
    )
}
