import React,{useState,useEffect} from 'react'
import { Table } from 'antd'
import axios from 'axios'

export default function RoleList() {
    const [dataSource,setdataSource] = useState([])
    const columns=[
        {
            title:'ID',
            dataIndex:'id',
            render(id) {
                return <b>{id}</b>
            },
        },
        {
            title:'角色名称',
            dataIndex:'roleName'
        },
        {
            title:'操作',
            
        }
    ]
    useEffect(()=>{
        axios.get("http://localhost:8000/roles").then(res=>{
            setdataSource(res.data)
        })
    },[])
    
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={(item)=>item.id}
        />
    )
}
