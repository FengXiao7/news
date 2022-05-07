import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Meta } = Card;


const Home = () => {
    // 最多访问列表
    const [viewList, setViewList] = useState([]);
    //最多点赞列表
    const [starList, setStarList] = useState([]);
    //获取当前登录用户
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    //获得最多访问列表
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6')
            .then(res => {
                setViewList(res.data)
            })
    }, [])
    //获得最多点赞列表
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6')
            .then(res => {
                setStarList(res.data)
            })
    }, [])
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card title="用户最常浏览" bordered>
                    <List
                        size="small"
                        dataSource={viewList}
                        renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="用户点赞最多" bordered>
                    <List
                        size="small"
                        dataSource={starList}
                        renderItem={item => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    }
                    actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]}
                >
                    <Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title={username}
                        description={
                            <div>
                                <b>{region ? region : "全球"}</b>
                                <span style={{
                                    paddingLeft: "30px"
                                }}>{roleName}</span>
                            </div>
                        }
                    />
                </Card>
            </Col>
        </Row>
    );
}

export default Home;


