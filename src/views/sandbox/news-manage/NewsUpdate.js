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
// 这个地方大部分都和NewsAdd相似,可以考虑抽取成一个组件.这里就不抽取了
export default function NewsUpdate(props) {
    // 步骤条
    const [current, setCurrent] = useState(0)
    // 新闻分类
    const [categories, setCategories] = useState([])
    // 收集步骤0Form表单数据
    const [formData, setFormData] = useState({})
    // 收集步骤1富文本数据
    const [editorData, setEditorData] = useState("")
    // Form表单Ref
    const NewsForm = useRef(null)
    // 步骤2点击保存草稿箱或者提交审核，触发回调.
    //和NewsAdd组件不同的是，这里直接patch就行啦
    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formData,
            "content": editorData,
            "auditState": auditState
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
    // 获取新闻信息,用于更新新闻
    useEffect(() => {
        axios.get(`news/${props.match.params.id}?_expand=category&_expand=role`)
            .then(res => {
                let {title,categoryId,content}=res.data
                // 设置表单字段值
                NewsForm.current.setFieldsValue({
                    title,
                    categoryId
                })
                // 把富文本数据，传递给富文本
                setEditorData(content)
            })
    }, [props.match.params.id])
    return (
        <>
            {/* 页头 */}
            <PageHeader
                onBack={() => props.history.goBack()}
                title="更新新闻"
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
                    editorData={editorData}
                    getContent={(value) => {
                        setEditorData(value)
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










