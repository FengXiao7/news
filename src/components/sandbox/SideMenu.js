import React, { useEffect, useState } from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios';
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    LockOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
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
    "/user-manage/list": <LockOutlined />,
    "/right-manage": <UserOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />
}
//普通组件，用withRouter包一下，顺便拿一下location和history
function SideMenu({location,history}) {
    const [menu, setMenu] = useState([])
    // 获取侧边栏数据
    useEffect(() => {
        axios.get("http://localhost:8000/rights?_embed=children")
            .then(res => setMenu(res.data))
    }, [])
    //设置Menu的items项
    //因为只有两级，就不用递归了
    const renderMenu = (menu) => {
        let menuList = []
        menu.forEach(m => {
            //有第二级
            if (m.children.length > 0) {
                let children = []
                m.children.forEach(c => {
                    // 只渲染pagepermisson为1的
                    if (c.pagepermisson === 1) {
                        children.push(getItem(c.title, c.key))
                    }
                })
                menuList.push(getItem(m.title, m.key, iconList[m.key], children))
            } else {
                menuList.push(getItem(m.title, m.key, iconList[m.key]))
            }
        })
        return menuList;
    }
    //跳转路由
    const go = (e)=>{
        history.push(e.key)
    }
    // 用于展示默认key 数组
    const selectKeys = [location.pathname]
    const openKeys = ["/"+location.pathname.split("/")[1]]
    return (
        <Sider trigger={null} collapsible={true} >
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
                <div style={{flex:1,"overflow":"auto"}}>
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

export default withRouter(SideMenu)
