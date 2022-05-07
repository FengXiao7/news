import React from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {connect} from 'react-redux'

const { Header } = Layout;
// 映射状态至props
const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
    return{
        isCollapsed
    }
}
// 映射方法至props
const mapDispatchToProps={
    changeIsCollapsed(){
        return{
            type: 'change_isCollapsed'
        }
    }
}

const TopHeader = (props) => {
    // 折叠侧边栏
    const changeIsCollapsed = () => {
        props.changeIsCollapsed()
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
                        props.history.replace('/login')
                    },
                    label: '退出',
                },
            ]}
        />
    );
    return (

        <Header className="site-layout-background" style={{ padding: '0 20px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeIsCollapsed} /> :
                    <MenuFoldOutlined onClick={changeIsCollapsed} />
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
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
