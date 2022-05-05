import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd';
import NewsEditor from '../../../components/news-manage/NewsEditor'
import axios from 'axios';
import {
    SoundOutlined,
    DollarOutlined,
    ExperimentOutlined,
    RocketFilled,
    DribbbleCircleFilled,
    CalculatorFilled
} from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select

//key和图标映射表
const iconList = {
    "1": <SoundOutlined />,
    "2": <DollarOutlined />,
    "3": <ExperimentOutlined />,
    "4": <RocketFilled />,
    "5": <DribbbleCircleFilled />,
    "6": <CalculatorFilled />
}
export default function NewsAdd(props) {
    // 步骤条
    const [current, setCurrent] = useState(0)
    // 新闻分类
    const [categories, setCategories] = useState([])
    // 收集步骤0Form表单数据
    const [formData, setFormData] = useState({})
    // 收集步骤1富文本数据
    const [editorData, seteditorData] = useState("")
    //角色数据
    const User = JSON.parse(localStorage.getItem('token'))
    // Form表单Ref
    const NewsForm = useRef(null)
    // 步骤2点击保存草稿箱或者提交审核，触发回调
    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formData,
            "content": editorData,
            "region": User.region ? User.region : "全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            "publishTime": 0
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: "top",
            });
        })
    }
    // 下一步
    const handleClickNext = () => {
        // 步骤0的表单数据校验下
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setFormData(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
            // 步骤1的富文本数据校验下是不是为空
        } else {
            if (editorData === '' || editorData === '') {
                message.warning("新闻内容不能为空！")
            } else {
                setCurrent(current + 1)
            }
        }

    }
    // 上一步
    const handleClickPrevious = () => {
        setCurrent(current - 1)
    }
    // 第一步表单回调
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    // 获取新闻分类
    useEffect(() => {
        axios.get("/categories").then(res => setCategories(res.data))
    }, [])

    return (
        <>
            {/* 页头 */}
            <PageHeader
                onBack={() => null}
                title="撰写新闻"
            />
            {/* 步骤条 */}
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            {/* 步骤0表单 */}
            <Form
                ref={NewsForm}
                style={{ display: current === 0 ? 'block' : 'none', marginTop: '30px' }}
                name="basic"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 20,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="新闻标题"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: '新闻标题不能为空!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="新闻分类"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: '新闻分类不能为空!',
                        },
                    ]}
                >
                    <Select>
                        {
                            categories.map(c => {
                                return <Option value={c.id} key={c.id}>{iconList[c.id]} {c.value}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
            {/* 步骤1富文本 */}
            <div style={{ display: current === 1 ? 'block' : 'none' }}>
                <NewsEditor
                    getContent={(value) => {
                        seteditorData(value)
                    }}
                >
                </NewsEditor>
            </div>

            {/* 步骤2保存草稿箱或者提交审核 */}
            <div style={{ marginTop: '100px' }}>
                {
                    current === 2 &&
                    <span style={{ float: 'right' }}>
                        <Button type="primary" style={{ margin: '5px' }} onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button type="primary" style={{ margin: '5px' }} onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current > 0 && <Button type="primary" onClick={handleClickPrevious} style={{ margin: '10px' }}>上一步</Button>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleClickNext} style={{ margin: '10px' }}>下一步</Button>
                }
            </div>

        </>
    )
}










