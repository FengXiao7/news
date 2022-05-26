import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios'
import _ from "lodash"
const News = (props) => {
    // 已发布的所有新闻
    const [newsList, setNewsList] = useState([]);
    // 获取已发布的所有新闻
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category')
            .then(res => {
                // setNewsList(res.data)
                let tempData =_.groupBy(res.data, item=>item.category.title)
                setNewsList(Object.entries(tempData))
            })
    }, [])
    return (
        <>
            <PageHeader
                title="全球大新闻!"
                onBack={() => props.history.goBack()}
            />,
            {/* card套List,各列上下间距16px */}
            <Row gutter={[16, 16]}>
                {
                    newsList.length > 0 &&
                    newsList.map(news => {
                        return (
                            <Col span={8} key={news[0]}>
                                <Card title={news[0]} bordered={true} hoverable>
                                    <List
                                        dataSource={news[1]}
                                        renderItem={data => (
                                            <List.Item>
                                                <Link to={`/detail/${data.id}`}>{data.title}</Link>
                                            </List.Item>
                                        )}
                                        pagination={{
                                            pageSize: 5
                                        }}
                                    />
                                </Card>
                            </Col>
                        )
                    })
                }

            </Row>
        </>
    );
}

export default News;


