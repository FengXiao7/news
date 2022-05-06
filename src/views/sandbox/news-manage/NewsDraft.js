import React, { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, Tooltip, notification } from 'antd'
import { Link } from 'react-router-dom';
import axios from 'axios'
import {
    DeleteOutlined,
    EditTwoTone,
    UploadOutlined,
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

export default function NewsDraft({ history }) {
    //表格数据源
    const [dataSource, setDataSource] = useState([])
    //表格列
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render(id) {
                return <b>{id}</b>
            },
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render(title, item) {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
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
            // 这里的item就是一整行的数据喔
            render: (item) => {
                return (
                    <div>

                        {/* 删除 */}
                        <Popconfirm
                            title="确定删除吗？"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => deleteMethod(item)}
                        >
                            <Tooltip placement="bottomLeft" title={<span>删除新闻</span>} color={"red"}>
                                <Button danger shape="circle" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>

                        {/* 更新新闻 */}
                        <Tooltip placement="bottomLeft" title={<span>更新新闻</span>} color={"blue"}>
                            <Button
                                shape="circle" icon={<EditTwoTone />}
                                onClick={() => {
                                    history.push(`/news-manage/update/${item.id}`)
                                }}
                            />
                        </Tooltip>

                        {/* 上传新闻至审核列表 */}
                        <Popconfirm
                            title="确定上传新闻至审核列表吗？这会在草稿箱中删除新闻！"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => handleUpload(item.id)}
                        >
                            <Tooltip placement="bottomLeft" title={<span>上传新闻至审核列表</span>} color={"blue"}>
                                <Button
                                    type="primary" shape="circle" icon={<UploadOutlined />}
                                />
                            </Tooltip>
                        </Popconfirm>

                    </div>
                )
            }
        }
    ]
    // 登录用户数据
    const { username } = JSON.parse(localStorage.getItem('token'))
    //删除新闻回调
    const deleteMethod = (item) => {
        // console.log(item)
        setDataSource(dataSource.filter(d => d.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }
    // 上传新闻至审核列表回调
    const handleUpload = (id) => {
        // 只将auditState改为1就行
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            history.push('/audit-manage/list')

            notification.info({
                message: `上传至审核列表1成功！`,
                description:
                    `您可以到审核列表中查看您的新闻`,
                placement: "top",
            });
        })
    }
    //获得表格数据源
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            setDataSource(res.data)
        })
    }, [username])




    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(item) => item.id}
            />
        </div>

    )
}
