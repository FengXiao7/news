import React, { useEffect, useState } from 'react';
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment';
import axios from 'axios';
import {HeartTwoTone} from '@ant-design/icons'
const Detail = ({ match,history }) => {

    // 新闻信息
    const [NewsInfo, setNewsInfo] = useState(null)
    // 获取新闻信息,访问量+1
    useEffect(() => {
        axios.get(`/news/${match.params.id}?_expand=category`).then(res => {
            // 本地浏览量+1
            setNewsInfo({
                ...res.data,
                view:res.data.view+1
            })
            return res.data
        }).then(res=>{
            // 同步到后端
            axios.patch(`/news/${match.params.id}`,{
                view:res.view+1
            })
        })

    }, [match.params.id])
    // 点赞
    const handleStar = ()=>{
        setNewsInfo({
            ...NewsInfo,
            star:NewsInfo.star+1
        })

        axios.patch(`/news/${match.params.id}`,{
            star:NewsInfo.star+1
        })
    }
    return (
        NewsInfo &&
        <>
            <PageHeader
                ghost={false}
                title={NewsInfo.title}
                subTitle={
                    <>
                        {NewsInfo.category.title }
                        <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar}/>
                    </>
                }
                onBack={() => history.goBack()}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{NewsInfo.author}</Descriptions.Item>
    
                    <Descriptions.Item label="发布时间">
                        {

                            NewsInfo.publishTime ?
                                moment(NewsInfo.publishTime).format("YYYY/Mo/Do HH:mm:ss") :
                                <span style={{ color: 'red' }}>还未发布！</span>
                        }

                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{NewsInfo.region}</Descriptions.Item>
       
                    <Descriptions.Item label="访问数量">{NewsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{NewsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <h2 style={{ textAlign: 'center' }}>新闻内容</h2>
            <div dangerouslySetInnerHTML={{
                __html: NewsInfo.content
            }} style={{
                margin: "0 24px",
                border: "1px solid gray"
            }}>
            </div>
        </>

    );
}

export default Detail;
