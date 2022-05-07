import React from 'react';
import {Table } from 'antd';
import { Link } from 'react-router-dom';
import {
    SoundOutlined,
    DollarOutlined,
    ExperimentOutlined,
    RocketFilled,
    DribbbleCircleFilled,
    CalculatorFilled
} from '@ant-design/icons';
//key和图标映射表
const iconList = {
    "1": <SoundOutlined />,
    "2": <DollarOutlined />,
    "3": <ExperimentOutlined />,
    "4": <RocketFilled />,
    "5": <DribbbleCircleFilled />,
    "6": <CalculatorFilled />
}
const Newspublish = (props) => {
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
                return <span>{iconList[item.categoryId]}{item.category.title}</span>
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
    return (
        <Table
            dataSource={props.dataSource}
            columns={columns}
            rowKey={item=>item.id}
        />
    );
}

export default Newspublish;
