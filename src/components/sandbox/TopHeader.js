import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';


const { Header } = Layout;
const TopHeader = ({ history }) => {
    // 点击小图标，折叠侧边栏
    const [collapsed, setcollapsed] = useState(false)
    // 折叠侧边栏
    const changeCollapsed = () => {
        setcollapsed(!collapsed)
    }
    // 
    const {username,role:{roleName}} = JSON.parse(localStorage.getItem('token'))
    //下拉菜单
    const menu = (
        <Menu
            items={[
                {
                    label: roleName
                },
                {
                    danger: true,
                    onClick: () => {
                        localStorage.removeItem('token')
                        history.replace('/login')
                    },
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
                <span>欢迎<span style={{ color: "#1890ff" }}>{roleName}:{username}</span></span>
                <Dropdown overlay={menu}>
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </Dropdown>

            </div>

        </Header >

    )
}
export default withRouter(TopHeader)
