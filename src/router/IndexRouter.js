import React from 'react'
import {BrowserRouter,Redirect,Route, Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import News from '../views/news/News'
import Details from '../views/news/Detail'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                {/* 下面两个路径为：游客系统 */}
                <Route path="/news" component={News}/>
                <Route path="/detail/:id" component={Details}/>
                <Route path="/" render={()=>
                    localStorage.getItem("token")?
                    <NewsSandBox></NewsSandBox>:
                    <Redirect to="/login"/>
                }/>
            </Switch>
        </BrowserRouter>
    )
}
