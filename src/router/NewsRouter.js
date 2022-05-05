import React, { useEffect, useState } from 'react'
import Home from '../views/sandbox/home/Home'
import Nopermission from '../views/sandbox/nopermission/Nopermission'
import RightList from '../views/sandbox/right-manage/RightList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import UserList from '../views/sandbox/user-manage/UserList'
import { Switch, Route, Redirect } from 'react-router-dom'
import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
import Audit from '../views/sandbox/audit-manage/Audit'
import AuditList from '../views/sandbox/audit-manage/AuditList'
import Unpublished from '../views/sandbox/publish-manage/Unpublished'
import Published from '../views/sandbox/publish-manage/Published'
import Sunset from '../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
// 本地路由表映射
const LocalRouterMap = {
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    "/news-manage/add":NewsAdd,
    "/news-manage/draft":NewsDraft,
    "/news-manage/category":NewsCategory,
    "/audit-manage/audit":Audit,
    "/audit-manage/list":AuditList,
    "/publish-manage/unpublished":Unpublished,
    "/publish-manage/published":Published,
    "/publish-manage/sunset":Sunset
}

export default function NewsRouter() {

    const [BackRouteList, setBackRouteList] = useState([])
    // 把rights和children直接合并在一起
    //或者查询rights?_embed=children，然后数组扁平化
    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res=>{
            setBackRouteList([...res[0].data,...res[1].data])
            // console.log(BackRouteList)
        })
    },[])
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    // 检查路由，本地得有且pagepermisson为1
    const checkRoute = (item)=>{
        return LocalRouterMap[item.key] && item.pagepermisson
    }
    //当前登录用户权限表里面必须得有，对应权限
    const checkUserPermission = (item)=>{
        return rights.includes(item.key)
    }

    return (
        <Switch>
            {
                BackRouteList.map(item=>
                    {
                        if(checkRoute(item) && checkUserPermission(item)){
                            return <Route path={item.key} key={item.id} component={LocalRouterMap[item.key]} exact/> 
                         }
                        //  没有权限直接返回null，最终还是去找*，
                        return null
                    }   
                )
            }

            <Redirect from="/" to="/home" exact />
            {
                BackRouteList.length>0 && <Route path="*" component={Nopermission} />
            }
        </Switch>
    )
}
