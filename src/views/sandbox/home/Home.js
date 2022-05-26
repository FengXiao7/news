import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, List, Avatar, Drawer,Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;


const Home = () => {
    // 最多访问列表6个
    const [viewList, setViewList] = useState([]);
    //最多点赞列表6个
    const [starList, setStarList] = useState([]);
    // 所有已发布新闻
    const [newsList, setNewsList] = useState([]);
    // 抽屉是否显示
    const [visible, setVisible] = useState(false);
    // PieChart初始化，避免重复初始化
    const [pieChatInit, setPieChatInit] = useState(null);
    // 显示抽屉，并绘制Bar图表
    const showDrawer = () => {
        setVisible(true);
        setTimeout(() => {
            renderPieChart()
        }, 0)
    };
    // 关闭抽屉
    const onClose = () => {
        setVisible(false);
    };
    //每门新闻分类所含已发布新闻数图表容器
    const BarChartRef = useRef(null)
    //用户已发布新闻数图表容器
    const PieChartRef = useRef(null)

    //获取当前登录用户
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    //绘制  每门新闻分类所含已发布新闻数  图表函数
    const renderBarChart = (data) => {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(BarChartRef.current);
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类'
            },
            tooltip: {},
            legend: {
                data: ['发布数']
            },
            xAxis: {
                data: Object.keys(data)
            },
            yAxis: { minInterval: 1 },
            series: [
                {
                    name: '发布数',
                    type: 'bar',
                    data: Object.values(data).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // 响应式
        window.onresize = () => {
            myChart.resize()
        }
    }
    //绘制  当前用户所发布的新闻数，按新闻类型分类 图表函数
    const renderPieChart = () => {
        // 真数据
        let data = []
        if (newsList.length !== 0) {
            // 当前用户发布的新闻
            let tempData = newsList.filter(n => n.author === username)
            // 截取标题
            let tempData_1 = _.groupBy(tempData, item => item.category.title)
            for (let key in tempData_1) {
                data.push({
                    name: key,
                    value: tempData_1[key].length
                })
            }
        }
        var myChart;
        // 没有初始化过，初始化一次.否则直接取值,避免重复初始化
        if (!pieChatInit) {
            myChart = echarts.init(PieChartRef.current);
            setPieChatInit(myChart)
        } else {
            myChart = pieChatInit
        }
        var option;
        // 配置项
        option = {
            legend: {
                top: 'bottom'
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: `${username}发布的新闻`,
                    type: 'pie',
                    radius: [25, 100],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data
                }
            ]
        };

        myChart.setOption(option);
    }
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
    //获取所有已发布新闻,并绘制Bar图表
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category")
            .then(res => {
                setNewsList(res.data)
                // 以category.title分组
                renderBarChart(_.groupBy(res.data, item => item.category.title))
            })
        // 销毁 window.onresize方法
        return () => {
            window.onresize = null
        }
    }, [])

    return (
        <>
            {/* 三张卡片，水平间隔16px */}
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
                            <Tooltip placement="bottom" title={"查看你发布新闻"} color="blue">
                                <SearchOutlined
                                    onClick={showDrawer}
                                />
                            </Tooltip>
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
            {/* 抽屉 */}
            <Drawer title={`${username}发布的新闻`} placement="right" onClose={onClose} visible={visible} width="500px">
                {/*  为 Pie 准备一个定义了宽高的 DOM  */}
                <div ref={PieChartRef} style={{ width: '100%', height: "400px" }} />
            </Drawer>
            {/*  为 Bar 准备一个定义了宽高的 DOM  */}
            <div ref={BarChartRef} style={{ width: '100%', height: "400px" }} />

        </>
    );
}

export default Home;


