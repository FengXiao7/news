import {
    SoundOutlined,
    DollarOutlined,
    ExperimentOutlined,
    RocketFilled,
    DribbbleCircleFilled,
    CalculatorFilled,
    UserOutlined,
    HomeOutlined,
    LockOutlined,
    FormOutlined,
    CheckOutlined,
    DesktopOutlined
} from '@ant-design/icons';
// 新闻分类映射表
export const categoryIconList = {
    "1": <SoundOutlined />,
    "2": <DollarOutlined />,
    "3": <ExperimentOutlined />,
    "4": <RocketFilled />,
    "5": <DribbbleCircleFilled />,
    "6": <CalculatorFilled />
}
//侧边栏一级权限key和图标映射表
export const SideMenuIconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <LockOutlined />,
    "/news-manage": <DesktopOutlined />,
    "/audit-manage": <FormOutlined />,
    "/publish-manage": <CheckOutlined />
}
// 审核状态映射表
export  const auditList = {
    0: "未审核",
    1: '审核中',
    2: '已通过',
    3: '未通过'
}
// 发布状态映射表
export const publishList = {
    0: "未发布",
    1: '待发布',
    2: '已上线',
    3: '已下线'
}
// 状态颜色表
export const colorState = {
    0: "red",
    1: "orange",
    2: "green",
    3: "red"
}