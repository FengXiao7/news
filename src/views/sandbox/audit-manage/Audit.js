import React, { useEffect, useState } from 'react'
import { Table, Popconfirm, Tooltip, Button,notification} from 'antd'
import axios from 'axios'
import { Link } from 'react-router-dom';
import {
    SoundOutlined,
    DollarOutlined,
    ExperimentOutlined,
    RocketFilled,
    DribbbleCircleFilled,
    CalculatorFilled
} from '@ant-design/icons';
//key和图标映射表
const iconList = {
    "1": <SoundOutlined />,
    "2": <DollarOutlined />,
    "3": <ExperimentOutlined />,
    "4": <RocketFilled />,
    "5": <DribbbleCircleFilled />,
    "6": <CalculatorFilled />
}
export default function Audit(props) {
    // 表格数据
    const [dataSource, setDataSource] = useState([])
    // 表格列
    const columns = [
        {
            title: '新闻标题',
            render(item) {
                return <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            render(item) {
                return <span>{iconList[item.categoryId]}{item.category.title}</span>
            },
        },
        {
            title: '操作',
            render(item) {
                return (
                    <>
                        <Popconfirm
                            title="确定审核通过该新闻?"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => handleAudit(item,2,1)}
                        >
                            <Tooltip placement="bottomLeft" title={<span>新闻审核通过</span>} >
                                <Button type="primary">通过</Button>
                            </Tooltip>
                        </Popconfirm>
                        <Popconfirm
                            title="确定驳回该新闻?"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => handleAudit(item,3,0)}
                        >
                            <Tooltip placement="bottomLeft" color={'red'} title={<span>驳回新闻</span>} >
                                <Button danger>驳回</Button>
                            </Tooltip>
                        </Popconfirm>
                    </>
                )
            },
        }
    ]
    // 当前登录用户数据
    const { roleId,username,region } = JSON.parse(localStorage.getItem('token'))
    // 审核通过和驳回回调，通过传不同参数区分
    const handleAudit = (item,auditState,publishState)=>{
        setDataSource(dataSource.filter(data=>data.id!==item.id))
        
        axios.patch(`/news/${item.id}`,{
            auditState,
            publishState
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
                placement:"top"
            });
        })
    }
    // 获取表格数据
    useEffect(() => {
        axios.get(`/news?auditState=1&_expand=category`)
            .then(res => {
                let list = res.data
                // 超级管理员审核所有
                // 区域管理员可以审核自己的
                //也可以审核和自己隶属于同一区域的区域编辑的
                setDataSource(roleId === 1 ? list : [
                    ...list.filter(l=>l.author===username),
                    ...list.filter(l=>l.region===region && l.roleId===3)            
                ])

            })
    }, [roleId,username,region])
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={item => item.id}
        />
    )
}
