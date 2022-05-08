import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import {connect} from 'react-redux'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    LockOutlined,
    FormOutlined,
    CheckOutlined,
    DesktopOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
// 映射状态至props
const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
    return{
        isCollapsed
    }
}
//创建Menu子项
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
//key和图标映射表
const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <LockOutlined />,
    "/news-manage": <DesktopOutlined />,
    "/audit-manage": <FormOutlined />,
    "/publish-manage": <CheckOutlined />
}

//普通组件，用withRouter包一下，顺便拿一下location和history还有redux中的isCollapsed
function SideMenu({ location, history,isCollapsed }) {
    const [menu, setMenu] = useState([])
    //拿到权限
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    //设置Menu的items项
    //因为只有两级，就不用递归了
    const renderMenu = (menu) => {
        let menuList = []
        menu.forEach(m => {
            //有第二级
            if (m.children.length > 0 && changeMenuAuthority(m)) {
                let children = []
                m.children.forEach(c => {
                    // 只渲染符合权限要求的
                    if (changeMenuAuthority(c)) {
                        children.push(getItem(c.title, c.key))
                    }
                })
                menuList.push(getItem(m.title, m.key, iconList[m.key], children))
            } else {
                changeMenuAuthority(m) && menuList.push(getItem(m.title, m.key, iconList[m.key]))
            }
        })
        return menuList;
    }
    // 检查侧边栏菜单权限
    //两个要求pagepermisson为1，当前登录用户权限列表中有对应权限
    const changeMenuAuthority = (item) => {
        return item.pagepermisson && rights.includes(item.key)
    }
    //跳转路由
    const go = (e) => {
        history.push(e.key)
    }
    // 用于展示默认key 数组
    const selectKeys = [location.pathname]
    const openKeys = ["/" + location.pathname.split("/")[1]]

    // 获取侧边栏数据
    useEffect(() => {
        axios.get("/rights?_embed=children")
            .then(res => setMenu(res.data))
    }, [])
    return (
        <Sider trigger={null} collapsible={true} collapsed={isCollapsed}>
            <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                <div style={{
                    lineHeight: '32px',
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255,0.3)',
                    fontSize: '18px',
                    margin: '10px',
                    textAlign: 'center'
                }} >
                    新闻管理系统
                </div>
                <div style={{ flex: 1, "overflow": "auto" }}>
                    <Menu
                        onClick={go}
                        theme="dark"
                        mode="inline"
                        defaultOpenKeys={openKeys}
                        selectedKeys={selectKeys}
                        items={renderMenu(menu)}
                    />
                </div>

            </div>

        </Sider>
    )
}

export default connect(mapStateToProps)(withRouter(SideMenu))
