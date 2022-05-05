import React, { useState, useEffect, forwardRef } from 'react';
import { Form, Select, Input } from 'antd'
const { Option } = Select
const { Item } = Form


const Userfrom = forwardRef((props, ref) => {

    // 选择超级管理员时，禁用选择区域
    const [isDisabled, setIsDisabled] = useState(false)
    //所需用户权限
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    // 用户当前可以选择的区域
    const checkRegionDisabled = (regionName) => {
        //更新用户
        if (props.isUpdateAuthority) {
            //超级管理员随意更改区域，其他人不能更改区域
            return roleId !== 1
        }
        //添加用户
        if (props.isAddAuthority) {
            // 超级管理员随意更改区域,其他人只能添加本区域
            return roleId === 1 ? false : region !== regionName
        }
    }
    // 用户当前可以选择的角色
    const checkRoleDisabled = (itemId) => {
    
        //更新用户
        if (props.isUpdateAuthority) {
            //超级管理员随意选择角色，其他人不能更改角色
            return roleId !== 1
        }
        //添加用户
        if (props.isAddAuthority) {
            // 超级管理员随意选择角色,其他人只能添加区域编辑
            return roleId === 1 ?false:itemId!==3
        }
    }
    checkRoleDisabled()
    useEffect(() => {
        setIsDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    return (
        <Form
            layout="vertical"
            ref={ref}
        >
            <Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '用户名不能为空！',
                    },
                ]}
            >
                <Input />
            </Item>
            <Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '密码不能为空！',
                    },
                ]}
            >
                <Input />
            </Item>
            <Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [
                    {
                        required: true,
                        message: '区域不能为空'
                    }
                ]}
            >
                <Select style={{ width: 120 }} disabled={isDisabled}>
                    {
                        props.regionData.map((region) => {
                            return <Option key={region.id} value={region.value} disabled={checkRegionDisabled(region.value)}>{region.value}</Option>
                        })
                    }
                </Select>
            </Item>
            <Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '角色不能为空',
                    },
                ]}
            >
                <Select style={{ width: 120 }} onChange={(value) => {
                    // 选中超级管理员，清空region,禁选region
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        props.roles.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item.id)}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Item>
        </Form>
    );
})

export default Userfrom
