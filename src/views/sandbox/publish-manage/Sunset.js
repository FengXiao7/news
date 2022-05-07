import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button, Popconfirm, Tooltip } from 'antd'
export default function Unpublished() {
    // 已下线publishState为3
    const { dataSource, handleDelete } = usePublish(3)

    return (
        <NewsPublish
            dataSource={dataSource}
            // 这是一个传递给子项的属性名叫button
            //button是一个函数，函数返回一个组件
            button={(id) =>
                <Popconfirm
                    title="确定删除吗？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => handleDelete(id)}
                >
                    <Tooltip placement="bottomLeft" title={<span>删除新闻</span>} >
                        <Button danger>删除</Button>
                    </Tooltip>
                </Popconfirm>
            }
        />
    )
}
