import React, { useState, useEffect, useRef } from 'react'
import { Table, Switch, Button, Popconfirm, Modal, message } from 'antd';
import {
    DeleteOutlined,
    EditTwoTone
} from '@ant-design/icons';
import axios from 'axios';
import Userfrom from '../../../components/user-manage/UserFrom'


export default function UserList() {
    // 表格数据源
    const [dataSource, setDataSource] = useState([])
    // 获取roles数据
    const [roles, setRoles] = useState([])
    //获取当前选择的那一行数据,在打开编辑按钮时设置
    const [currentData, setCurrentData] = useState([])
    // region数据
    const [regionData, setRegionData] = useState([])
    //添加用户对话框是否隐藏
    const [isModalVisible, setIsModalVisible] = useState(false);
    //更新用户对话框是否隐藏
    const [isUpdateVisible, setUpdateVisible] = useState(false);
    //控制表单，区域选项是否禁止。
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
    //添加用户表单Ref
    const addForm = useRef(null)
    //更新用户表单Ref
    const updateForm = useRef(null)
    //所需用户权限
    const { roleId, region, username } = JSON.parse(localStorage.getItem("token"))
    //表格列
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            width: 100,
            filters: [
                ...regionData.map(r => {
                    return {
                        text: r.title,
                        value: r.value
                    }
                }), {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === ""
                }
                return item.region === value
            },
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
            }

        },
        {
            title: '角色名称',
            dataIndex: 'role',
            width: 100,
            filters: [
                ...roles.map(r => {
                    return {
                        text: r.roleName,
                        value: r.roleName
                    }
                })
            ],
            onFilter: (value, item) => {
                return item.role.roleName === value
            },
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: 'username',
            width: 100,

        },
        {
            title: "用户状态",
            dataIndex: 'roleState',
            width: 100,
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default}
                    onChange={() => handleChange(item)}
                ></Switch>
            }
        },
        {
            title: '操作',
            width: 150,
            // 这里的item就是一整行的数据喔
            render: (item) => {
                return (
                    <>
                        {/* 删除 */}
                        <Popconfirm
                            title="确定删除吗？"
                            okText="是"
                            cancelText="否"
                            onConfirm={() => deleteMethod(item)}
                        >
                            <Button danger shape="circle" icon={<DeleteOutlined />} />
                        </Popconfirm>
                        {/* 编辑按钮 */}
                        <Button
                            type="primary" shape="circle" icon={<EditTwoTone />}
                            onClick={() => handleUpdate(item)}
                        />
                    </>
                )
            }
        }
    ];
    // 修改switch开关状态
    const handleChange = (item) => {
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    //点击编辑按钮，收集表单原内容
    const handleUpdate = (item) => {
        setTimeout(() => {
            setUpdateVisible(true)
            // 超级管理员，区域选项是禁止的
            item.roleId === 1 ? setIsUpdateDisabled(true) : setIsUpdateDisabled(false)
            // 把选中的item,赋值给表单
            updateForm.current.setFieldsValue(item)
            //把选中的item保存下来，以后方便修改
            setCurrentData(item)
        }, 0)
    }
    // 删除用户回调
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))

        axios.delete(`/users/${item.id}`)
    }
    //确认添加用户回调
    const addFormOk = () => {
        // 是否通过验证
        addForm.current.validateFields().then(value => {
            setIsModalVisible(false)
            // 重置表单
            addForm.current.resetFields()
            // 先向后台发请求，id自增
            axios.post('/users', {
                ...value,
                "roleState": true,
                "default": false,
            })
                .then(res => {
                    // 发完请求后，更新状态。需要注意dataSource是表连接后发送的数据，
                    //我们也必须加上表连接后的属性role
                    setDataSource([...dataSource, {
                        ...res.data,
                        role: roles.filter(item => item.id === +value.roleId)[0]
                    }])
                })
        }).catch(err => {
            err.errorFields.forEach(e => {
                message.error(e.errors[0])
            })
        })
    }
    //更新用户回调
    const updateFormOk = () => {
        // 是否通过验证
        updateForm.current.validateFields().then(value => {
            setUpdateVisible(false)
            // 方案1 先在页面更新，再发送请求更新后台，缺点整理数据麻烦
            //方案2 发送请求更新成功后，再次发送请求得到最新数据,缺点要发两次请求.
            //我这里用的是方案2

            //注意如果用户什么也没改，就不用发请求
            //不能用isFieldTouched方法，它会始终为true。
            //因为我们的表单项都是从无到有的。

            //我用的这种方法最笨但是效率很高。属性变多了，用Object.keys就行
            if (
                value['username'] !== currentData['username'] ||
                value['password'] !== currentData['password'] ||
                value['region'] !== currentData['region'] ||
                value['roleId'] !== currentData['roleId']
            ) {
                axios.patch(`/users/${currentData.id}`, value).then(() => {
                    axios.get("/users?_expand=role").then(res => {
                        let list = res.data
                        // 超级管理员可以看到所有用户
                        setDataSource(roleId === 1 ? list : [
                            // 区域管理员可以看到自己以及和自己同一区域以及区域编辑
                            ...list.filter(item => item.username === username),
                            ...list.filter(item => item.region === region && item.roleId === 3)
                        ])
                    })
                })
            }
        }).catch(err => {
            err.errorFields.forEach(e => {
                message.error(e.errors[0])
            })
        })
    }
    //获取user数据
    //这里面要做一下权限分配
    useEffect(() => {
        axios.get("/users?_expand=role").then(res => {
            let list = res.data
            // 超级管理员可以看到所有用户
            setDataSource(roleId === 1 ? list : [
                // 区域管理员可以看到自己以及和自己同一区域以及区域编辑
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && item.roleId === 3)
            ])
        })
    }, [roleId, region, username])
    //获取roles数据
    useEffect(() => {
        axios.get("/roles").then(res => {
            setRoles(res.data)
        })
    }, [])
    // 获取region数据
    useEffect(() => {
        axios.get("/regions").then(res => {
            setRegionData(res.data)
        })
    }, [])

    return (
        <>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                添加用户
            </Button>
            <Table
                dataSource={dataSource}
                columns={columns}
                scroll={{ y: 600 }}
                rowKey={(item) => item.id}
                pagination={{
                    pageSize: 5
                }}
            />
            {/* 添加用户Modal，里面套个Form */}
            <Modal
                visible={isModalVisible}
                title="创建新用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => setIsModalVisible(false)}
                onOk={() => addFormOk()}
            >
                {/* 传个子项的四个属性为：
                   1. ref：我们需要拿到表格ref，
                    2. roles： 权限列表
                    3.regionData: 选择区域
                    4.isAddAuthority:标识为父项为添加用户Modal，主要和权限有关
                 */}
                <Userfrom ref={addForm} roles={roles} regionData={regionData} isAddAuthority={true} />
            </Modal>
            {/* 更新用户Modal，里面套个Form */}
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOk()}
            >
                {/* 传个子项的五个属性，3个和上一个Userfrom相同不再赘述：
                   4.isUpdateDisabled：配合子项的isDisabled解决：当选择超级管理员时，不能选择区域。切换角色时依然禁止选择区域的Bug
                   5.isUpdateAuthority:标识为父项为更新用户Modal，主要和权限有关
                 */}
                <Userfrom ref={updateForm} roles={roles} regionData={regionData} isUpdateDisabled={isUpdateDisabled} isUpdateAuthority={true} />
            </Modal>
        </>

    )
}
