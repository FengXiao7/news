import React, { useState } from 'react'
import { Layout, Menu, Dropdown,Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';


const { Header } = Layout;
export default function TopHeader() {
    const [collapsed, setcollapsed] = useState(false)
    const changeCollapsed = () => {
        setcollapsed(!collapsed)
    }

    const menu = (
        <Menu
            items={[
                {
                    label: '超级管理员'
                },
                {
                    danger: true,
                    label: '退出',
                },
            ]}
        />
    );
    return (

        <Header className="site-layout-background" style={{ padding: '0 20px' }}>
            {
                collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
                    <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <Dropdown overlay={menu}>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </Dropdown>
                
            </div>

        </Header >

    )
}
