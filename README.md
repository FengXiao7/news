

# 说明：

整个项目的后端接口都是json-server做的，启动的时候请开启8000端口。

在src目录下启动，

命令：

json-server --watch .\db.json -p 8000

更多命令参见官网：



# 第一天

## 1.Layout组件高度

对照控制台看下，输出标签的类名。然后自己手动把高度改成和body一样高就行了

## 2.侧边栏

### 滚动条：

```js
/* 设置滚动条样式 */
::-webkit-scrollbar {width:5px;height:5px;position:absolute;}
::-webkit-scrollbar-thumb {background-color:#1890ff}
::-webkit-scrollbar-track {background-color:#ddd}
```

侧边框展开多了，我们自己用个容器包住，自己overflow:auto

### Menu

我的Menu是新版本，用的是<Menu items={[...]} /> 的简写方式。我用的方法是：

- 获取后台导航数组
- 然后新建一个数组装items
- 根据后台导航数组编写自己的items就行。
- 因为最深就只有两级，也不用递归。

```js
//menu即为获取到的后台导航数组
const renderMenu = (menu) => {
        let menuList = []
        menu.forEach(m => {
            //有第二级
            if (m.children.length > 0) {
                let children = []
                m.children.forEach(c => {
                    //pagepermisson是和后台的约定，必须为1才展示
                    if (c.pagepermisson === 1) {
                        children.push(getItem(c.title, c.key))
                    }
                })
                //iconList是key和icon的映射表,后面有提到
                //getItem是创建items对象的方法,后面有提到
                menuList.push(getItem(m.title, m.key, iconList[m.key], children))
            } else {
                menuList.push(getItem(m.title, m.key, iconList[m.key]))
            }
        })
        return menuList;
    }
```



### 图标：

这个是我创建items用的函数，

```js
//创建Menu子项
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
```

后台显然不知道我们需要用哪个icon，我们自己写个映射表就行

```js
//key和图标映射表
const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/user-manage/list": <LockOutlined />,
    "/right-manage": <UserOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />
}
```

这里的key就是后台导航数组的key喔，很方便就可以取出来

## 3.权限管理

主要是Table组件

### render：

![image-20220504003517027](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220504003517027.png)

复杂数据都会用到喔。

columns数组里面的render，

### 树形表格：

表格支持树形数据的展示，当数据中有 `children` 字段时会自动展示为树形表格。

我们的datasource里恰好有这个属性喔。就不用自己配置数据了。



### Patch：

传送门：

[PATCH和PUT方法的区别？ - SegmentFault 思否](https://segmentfault.com/q/1010000005685904)

## 用户管理：

### rowKey：

dataSource每行都应该有key喔，之前的权限管理恰好后台传过来的数据有key。后台没有的话，我们可以用

rowKey属性来指定key。

![image-20220504010804765](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220504010804765.png)

```jsx
		<Table
            dataSource={dataSource}
            columns={columns}
            rowKey={(item)=>item.id}
        />
```

