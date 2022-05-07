import usePublish from '../../../components/publish-manage/usePublish'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import { Button, Popconfirm, Tooltip } from 'antd'
export default function Unpublished() {
    // 已发布为publishState为2
    const { dataSource, handleSunset } = usePublish(2)

    return (
        <NewsPublish
            dataSource={dataSource}
            // 这是一个传递给子项的属性名叫button
            //button是一个函数，函数返回一个组件
            button={(id) =>
                <Popconfirm
                    title="确定下线吗？"
                    okText="是"
                    cancelText="否"
                    onConfirm={() => handleSunset(id)}
                >
                    <Tooltip placement="bottomLeft" title={<span>下线新闻</span>} >
                        <Button danger>下线</Button>
                    </Tooltip>
                </Popconfirm>
            }
        />
    )
}
