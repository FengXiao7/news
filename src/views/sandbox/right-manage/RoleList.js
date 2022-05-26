import React, { useState, useEffect } from 'react'
import { Table, Button, Popconfirm, Modal, Tree, Tooltip } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    EditTwoTone
} from '@ant-design/icons';

export default function RoleList() {
    //表格数据源
    const [dataSource, setDataSource] = useState([])
    //权限数据源，useEffect发请求设置
    const [rightList, setRightList] = useState([])
    //获取当前的权限数组,两个地方设置：编辑按钮，树形组件onCheck
    const [currentRight, setCurrentRight] = useState([])
    //获取当前权限数组的Id,编辑按钮设置，Modal确认回调使用
    const [currentID, setCurrentID] = useState(0)
    //对话框是否隐藏
    const [isModalVisible, setIsModalVisible] = useState(false);
    // 表格列
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render(id) {
                return <b>{id}</b>
            },
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
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
                            <Tooltip placement="bottomLeft" title={<span>删除角色</span>} color={"red"}>
                                <Button danger shape="circle" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>

                        {/* 编辑按钮 */}
                        <Tooltip placement="bottomLeft" title={<span>权限分配</span>} color={"blue"}>
                            <Button
                                type="primary" shape="circle" icon={<EditTwoTone />}
                                onClick={() => {
                                    setIsModalVisible(true)
                                    // 获取当前权限数组
                                    setCurrentRight(item.rights)
                                    // 获取当前权限数组的id
                                    setCurrentID(item.id)
                                }}
                            />
                        </Tooltip>


                    </div>
                )
            }
        }
    ]
    //获得表格数据源
    useEffect(() => {
        axios.get("/roles").then(res => {
            setDataSource(res.data)
        })
    }, [])
    //获得权限数据源
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setRightList(res.data)
        })
    }, [])

    //删除回调,button使用
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(d => d.id !== item.id))
        axios.delete(`/roles/${item.id}`)
    }
    //更改权限onCheck回调,树形组件使用.每点一次树形组件，都会触发该回调
    //保证currentRight都是最新的
    const checkRight = (checkedKeys) => {
        setCurrentRight(checkedKeys.checked)
    }
    //确认更改权限回调，Modal组件确认时触发
    const modalOnOK = () => {
        setIsModalVisible(false)
        let flag = false

        let newDataSource = dataSource.map(d => {
            // id相等，且数据改变
            if (d.id === currentID && d.rights.toString() !== currentRight.toString()) {
                flag = true
                d.rights = currentRight
            }
            return d
        })
        // 只有数据改变的时候才同步数据
        if (flag) {
            // 同步数据源
            setDataSource(newDataSource)
            //后台同步
            axios.patch(`/roles/${currentID}`, {
                rights: currentRight
            })
        }
    }

    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(item) => item.id}
            />
            {/* 编辑框，里面套个树形组件 */}
            <Modal
                title="权限分配"
                visible={isModalVisible}
                onOk={modalOnOK}
                onCancel={() => setIsModalVisible(false)}>
                <Tree
                    checkable
                    checkStrictly={true}
                    checkedKeys={currentRight}
                    treeData={rightList}
                    onCheck={checkRight}
                />
            </Modal>
        </div>

    )
}
