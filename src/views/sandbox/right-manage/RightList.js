import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Popconfirm, Switch, Tooltip } from 'antd';
import {
    DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';

export default function RightList() {
    const [dataSource, setDataSource] = useState([])
    //表格列
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            width: 150
        },
        {
            title: "权限路径",
            width: 200,
            render: (item) => {
                return <Tag color={item.grade===1?"green":"orange"}>{item.key}</Tag>
            }
        },
        {
            title: '操作',
            width: 150,
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
                            <Tooltip placement="bottomLeft" title={<span>删除权限</span>} color={"red"}>
                                <Button danger shape="circle" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>

                        {/* 编辑 */}
                        <Tooltip
                            placement="bottomLeft"
                            title={item.pagepermisson === undefined ? <span>该权限不可操作是否在侧边栏可见！</span> : <span>配置是否在侧边栏可见</span>}
                            color={item.pagepermisson === undefined ? "red" : "blue"}>
                            <Switch
                                checked={item.pagepermisson}
                                onChange={() => switchMethod(item)}
                                disabled={item.pagepermisson === undefined}
                            ></Switch>
                        </Tooltip>
                    </div>
                )
            }
        }
    ];
    //删除函数回调
    //如果层级过多，也可以先后台删除，再发请求，但这样效率不高
    const deleteMethod = (item) => {
        // 层级为1
        if (item.grade === 1) {
            //页面删除
            setDataSource(dataSource.filter(d => d.id !== item.id))
            //后台删除
            axios.delete(`/rights/${item.id}`)
        } else {
            //层级为2
            // 先找到父级
            let list = dataSource.filter(d => d.id === item.rightId)
            list[0].children = list[0].children.filter(c => c.id !== item.id)
            setDataSource([...dataSource])
            //后台删除
            axios.delete(`/children/${item.id}`)

        }


    }
    //开关改变回调
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1

        setDataSource([...dataSource])
        // 相比于删除要简单很多，直接打补丁就行
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

    //获取数据
    useEffect(() => {
        axios.get("/rights?_embed=children")
            .then(res => {
                // 把childen属性为[]变为空串，以免树形化有bug
                let list = res.data
                list.forEach(item => {
                    if (item.children.length === 0) {
                        item.children = ""
                    }
                })
                setDataSource(list)
            })
    }, [])

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            indentSize={20}

            pagination={{
                pageSize: 5
            }}
        />
    )
}
