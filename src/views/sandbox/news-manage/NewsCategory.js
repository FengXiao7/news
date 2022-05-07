import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Popconfirm, Form,Input } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
} from '@ant-design/icons';

export default function NewsCategory() {
    //表格数据源
    const [dataSource, setDataSource] = useState([])
    // 表格列
    // 可编辑的列需要额外加一个onCell
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render(id) {
                return <b>{id}</b>
            },
        },
        {
            title: '分类名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '分类名称',
                handleSave: handleSave,
              }),
        },
        {
            title: '操作',
            // 这里的item就是一整行的数据喔
            render: (item) => {
                return (
                    <Popconfirm
                        title="确定删除吗？"
                        okText="是"
                        cancelText="否"
                        onConfirm={() => deleteMethod(item)}
                    >
                        <Button danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>

                )
            }
        }
    ]
    //可编辑最终执行的回调
    const handleSave = (record)=>{
        // console.log(record)
        setDataSource(dataSource.map(d=>{
            if(d.id===record.id){
                return{
                    ...d,
                    title:record.title,
                }
            }
            return d
        }))
        axios.patch(`/categories/${record.id}`,{
            title:record.title,
            value:record.title
        })
    }
    //下面三个属性是为了，可编辑设置的。我在官网抄的，暂且不需要知道为什么。有空研究研究
    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };
    //获得表格数据源
    useEffect(() => {
        axios.get("/categories").then(res => {
            setDataSource(res.data)
        })
    }, [])


    //删除回调,button使用
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(d => d.id !== item.id))
        axios.delete(`/categories/${item.id}`)
    }

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={(item) => item.id}
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                }
            }}
        />
    )
}
