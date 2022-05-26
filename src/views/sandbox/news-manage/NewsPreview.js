import React, { useEffect, useState } from 'react';
import { PageHeader, Descriptions } from 'antd';
import moment from 'moment';
import axios from 'axios';
import {auditList,publishList,colorState} from '../../../util/mappingTable'

const Newspreview = ({ match,history }) => {
    // 新闻信息
    const [NewsInfo, setNewsInfo] = useState(null)
    // 获取新闻信息
    useEffect(() => {
        axios.get(`news/${match.params.id}?_expand=category&_expand=role`)
            .then(res => setNewsInfo(res.data))
    }, [match.params.id])
    return (
        NewsInfo &&
        <>
            <PageHeader
                ghost={false}
                title={NewsInfo.title}
                subTitle={NewsInfo.category.title}
                onBack={() => history.goBack()}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{NewsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(NewsInfo.createTime).format("YYYY/Mo/Do HH:mm:ss")}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {

                            NewsInfo.publishTime ?
                                moment(NewsInfo.publishTime).format("YYYY/Mo/Do HH:mm:ss") :
                                <span style={{ color: 'red' }}>还未发布！</span>
                        }

                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{NewsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态">
                        <span style={{ color: colorState[NewsInfo.auditState] }}>
                            {auditList[NewsInfo.auditState]}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="发布状态">
                        <span style={{ color: colorState[NewsInfo.publishState] }}>
                            {publishList[NewsInfo.publishState]}
                        </span>
                    </Descriptions.Item>
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

export default Newspreview;
