import React,{useState,useEffect} from 'react';
import {Table } from 'antd';
import { Link } from 'react-router-dom';

import axios from 'axios';
import {categoryIconList} from '../../util/mappingTable'

const Newspublish = (props) => {
    const [categories, setCategories] = useState([]);
    const columns=[
        {
            title:"新闻标题",
            dataIndex: 'title',
            render(title, item) {
                return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            }
        },
        {
            title:"作者",
            dataIndex:"author"
        },
        {
            title: '新闻分类',
            render(item) {
                return <span>{categoryIconList[item.categoryId]}{item.category.title}</span>
            },
            filters:[
                ...categories.map(c=>{
                    return{
                        text:c.title,
                        value:c.value
                    }
                })
            ],
            onFilter:(value,item)=>{
                return item.category.title===value
            }
        },
        {
            title:'操作',
            render(item){
                // 执行button这个函数，这样就可以拿到id了
                return(
                    <>
                        {props.button(item.id)}
                    </>
                )
            }
        }
    ]

    useEffect(() => {
        axios.get("/categories").then(res=>setCategories(res.data))
    }, []);
    
    return (
        <Table
            dataSource={props.dataSource}
            columns={columns}
            rowKey={item=>item.id}
        />
    );
}

export default Newspublish;
