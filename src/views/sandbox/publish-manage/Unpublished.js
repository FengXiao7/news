import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button, Popconfirm, Tooltip } from 'antd'
export default function Unpublished() {
    // 待发布为publishState为1
    const { dataSource, handlePublish } = usePublish(1)

    return (
        <NewsPublish
            dataSource={dataSource}
            // 这是一个传递给子项的属性名叫button
            //button是一个函数，函数返回一个组件
            button={(id) =>
                <Popconfirm
                    title="确定发布吗？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => handlePublish(id)}
                >
                    <Tooltip placement="bottomLeft" title={<span>发布新闻</span>} >
                        <Button type="primary">发布</Button>
                    </Tooltip>
                </Popconfirm>
            }
        />
    )
}
