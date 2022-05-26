# 页面概览：



<img src="https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/149.gif" style="zoom: 100%"></img>



![image-20220508173452888](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508173452888.png)



![image-20220508173542982](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508173542982.png)



![image-20220508173658769](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508173658769.png)



![image-20220508173752203](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508173752203.png)



![image-20220508173829137](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508173829137.png)



![image-20220508174528540](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508174528540.png)



![image-20220508174944429](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508174944429.png)



![image-20220508175104442](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508175104442.png)



<img src="https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/150.gif" style="zoom: 100%"></img>

# 说明：

## json-server

整个项目的后端接口都是json-server做的，启动的时候请开启8000端口。

在src目录下启动json-server

命令：

json-server --watch .\db.json -p 8000

你也可以修改默认端口

![image-20220508172227688](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508172227688.png)

## 启动前端项目

npm install

npm start

## db.json

你可以直接访问http://localhost:8000查看数据库所有内容.

有7张表

### users

![image-20220508180811573](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508180811573.png)

### roles

![image-20220508181121337](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508181121337.png)

### children

![image-20220508181532928](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508181532928.png)



### rights

![image-20220508182046750](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508182046750.png)

### categories

![image-20220508182150165](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508182150165.png)

### regions:

![image-20220508182337075](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508182337075.png)

### news:

此表在第三天，新闻业务中有详细说明   <a href="#test">ctrl+鼠标左键跳转</a>



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
    "/right-manage": <LockOutlined />,
    "/news-manage": <DesktopOutlined />,
    "/audit-manage": <FormOutlined />,
    "/publish-manage": <CheckOutlined />
}
```

这里的key就是后台导航数组的key喔，很方便就可以取出来

### 默认选中项

因为是路由组件，从location里面拿就行了

```js
    // 用于展示默认key 数组
    const selectKeys = [location.pathname]//默认选中的二级权限
    const openKeys = ["/" + location.pathname.split("/")[1]]//默认展开的一级权限
```



## 3.权限管理

主要是Table组件

### render：

![image-20220504003517027](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220504003517027.png)

复杂数据都会用到喔。

columns数组配置对象里面的render。

这个render的参数我测试了下：

有dataIndex：

```js
{
            title: "权限路径",
            dataIndex: 'key',
            width: 200,
            render: (key,item,index) => {
                console.log(key)
                console.log(item)
                console.log(index)
                return <Tag color="green">{key}</Tag>
            }
        },
```

![image-20220525161629015](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220525161629015.png)

没有dataIndex

```js
    {
            title: "权限路径",
            width: 200,
            render: (key,item,index) => {
                console.log(key)
                console.log(item)
                console.log(index)
                return <Tag color="green">测试</Tag>
            }
        },
```

![image-20220525161825269](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220525161825269.png)

### 树形表格：

表格支持树形数据的展示，当数据中有 `children` 字段时会自动展示为树形表格。

我们的datasource里恰好有这个属性喔。就不用自己配置数据了。

如果不需要或配置为其他字段可以用 `childrenColumnName` 进行配置。

### Patch请求：

打补丁喔

传送门：

[PATCH和PUT方法的区别？ - SegmentFault 思否](https://segmentfault.com/q/1010000005685904)

# 第二天



## rowKey：

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

## antD里的 default属性：

一般antD里加了default属性表示是受控组件，没加表示非受控组件。

## 树形组件

加了checkStrictly属性后onCheck里面的参数有变化。

而且我们的数据恰好有key，title，children。满足treeData的要求

## 用户列表：

用户列表这块，状态有很多，不要绕晕了。我都写了很详细的注释。

### 添加用户和修改用户

这两个都是Form表单，大部分逻辑是一样的，抽取成一个公共组件，父组件Modal套一个就行了。我用的是ref拿到表单实例，官方提供了个钩子也可以：

![image-20220525201105966](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220525201105966.png)

### 表单验证以及错误信息：

validateFields，官方文档写的很清楚。

```jsx
	表单对象.validateFields().then(value => {
          //参数value就可以拿到所有表单填写字段了
        }).catch(err => {
        //错误信息还要再套一层才拿的到
            err.errorFields.forEach(e => {
                message.error(e.errors[0])
            })
        })
```



### 添加用户：

添加用户成功后，要记得清空表单数据。以免下一次添加用户的时候，还存在上一次的数据。

方法是resetFields。然后就是注意字段要完整

```jsx
// 是否通过验证
        addForm.current.validateFields().then(value => {
            setIsModalVisible(false)
            // 重置表单
            addForm.current.resetFields()
            // 先向后台发请求，id自增
            axios.post('/users', {
                ...value,
                "roleState": true,
                "default": false,
            })
                .then(res => {
                 // 发完请求后，更新状态。也就是增添一名用户，需要注意dataSource是_expand=role发送的数据，
                    //我们也必须加上表连接后的属性role
                    setDataSource([...dataSource, {
                        ...res.data,
                        role: roles.filter(item => item.id === +value.roleId)[0]
                    }])
                })
```



## 修改用户：

修改用户需要拿到用户原始信息。使用setFieldsValue

![image-20220525194329497](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220525194329497.png)

![image-20220525194344239](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220525194344239.png)

### 发请求更新数据？

- 方案1 先在页面更新，再发送请求更新后台，缺点整理数据麻烦

- 方案2 发送请求更新成功后，再次发送请求得到最新数据,缺点要发两次请求.

  不知道哪种用的多一点。

### useState同步：

useState方法返回的set函数，不像setState一样有第二个回调函数。需要用set函数达到setState第二个回调函数的效果，

直接放在宏任务setTimeout里面就行。

[千锋2022版React全家桶教程_react零基础入门到项目实战完整版_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1dP4y1c7qd?p=169)  1小时35分开始



### 表格过滤

官网的参数看的不怎么懂。

有两个属性就行了。都写在columns表格列中。

#### 第一个属性filters:

第一个属性是filters,这个是一个数组，数组里面有很多个对象。

```js
filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Jim',
        value: 'Jim',
      },
      {
        text: 'Submenu',
        value: 'Submenu',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
```

##### text：

![image-20220505001921580](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505001921580.png)

##### value：

这个和第二个属性有关

#### 第二个属性

onFilter,这个属性是一个函数，接收两个参数。在里面写我们的筛选逻辑

第一个参数就是，之前的那个value.

第二个参数就是每行每行的数据，和render的那个item是一个意思

```js
 onFilter: (value, item) => item.name.indexOf(value) === 0,
```



## 粒子动画

传送门：

[(26条消息) 【前端react 粒子特效】_꧁༺龙小九༻ ꧂的博客-CSDN博客_前端粒子动画](https://blog.csdn.net/weixin_54127208/article/details/124380211?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-1.pc_relevant_paycolumn_v3&spm=1001.2101.3001.4242.2&utm_relevant_index=4)

[tsParticles | Samples | JavaScript Particles, Confetti and Fireworks animations for your website](https://particles.js.org/samples/index.html#preset)

我随便找了一个：

<img src="https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/147.gif" style="zoom: 100%"></img>

# 第三天

## 登录请求



三个信息不对，不能通过。

- 用户名不存在
- 用户名存在，但密码不正确
- 用户名存在，密码正确，但roleState为false，也就是本人限制了权限，见下图。

![image-20220505173340236](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505173340236.png)

由于是json-server，就不要奢望直接有接口判断输入数据合法性了，也没有索引什么的。为了保证正确提示信息，只能

一连4发请求，相当丑陋，应该有啥优化方法吧。暂时没想到。

```js
//表单收集完成回调 
  const onFinish = (values) => {
    axios.get(`http://localhost:8000/users?username=${values.username}`)
      .then(res => res.data.length === 0 ? message.warning(`不存在用户${values.username}！`) :
        axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}`)
          .then(res => res.data.length === 0 ? message.warning(`用户${values.username}密码错误！`) :
            axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true`)
              .then(res => res.data.length === 0 ? message.warning(`用户${values.username}没有权限！`) :
                axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
                  .then(res => {
        //这里把用户信息存进localStorage，再跳转
                    localStorage.setItem('token', JSON.stringify(res.data[0]))
                    message.success('欢迎'+values.username+"!")
                    history.push("/")
                  }
                  ))))
  }
```

## 用户权限

不同角色所能管理的用户权限是不同的：

- 超级管理员：可以看到所有用户；可以添加或修改所有角色的所有属性
- 区域管理员：可以看到自己和与自己同一个区域下的区域编辑；可以添加的角色只有区域编辑，而且只能添加和自已一个区域的；不能修改角色的区域和角色等级，其他属性都可以修改
- 区域编辑：没有用户权限。

我们可以直接在localStorage里面拿到对应用户的权限，然后再去对应页面再筛一遍就行，不是很难办到。

## 路由权限

防止级别不高的角色，直接在地址栏输入无权进入的页面。比如区域编辑可以看用户列表之类的



因为后台数据里面的key值，已经包含了路由路径（就是权限，也就是key值）。我们可以**动态创建路由**。



注意我们的的key值包含在两张表里面，rights和children。我们可以只发一个rights?_embed=children请求，然后把

得到的数据数组扁平化。也可以用Promise.all发两条请求，合并在一起得到一个大数组。像下面这样，我就是用的这种方法。



再注意这里面**有些路径是不需要的**，它们只是单纯地代表权限，没有对应路由，我们用一个映射表筛一下，

![image-20220505165618486](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505165618486.png)

给有页面的路径，绑定组件，这样就形成了一个映射表。

像/user-manage/add这种没有路由的，就不需要绑定了。

```js
// 本地路由表映射
const LocalRouterMap = {
    "/home": Home,                               //首页
    "/user-manage/list": UserList,               //用户列表
    "/right-manage/role/list": RoleList,         //角色列表
    "/right-manage/right/list": RightList,       //权限列表
    "/news-manage/add": NewsAdd,                 //撰写新闻
    "/news-manage/draft": NewsDraft,             //草稿箱
    "/news-manage/category": NewsCategory,       //新闻分类
    "/news-manage/preview/:id": NewsPreview,     //新闻预览   routepermisson
    "/news-manage/update/:id": NewsUpdate,       //更新新闻   routepermisson
    "/audit-manage/audit": Audit,                //审核新闻
    "/audit-manage/list": AuditList,             //审核列表   只能看自己撰写的新闻
    "/publish-manage/unpublished": Unpublished,  //未发布新闻
    "/publish-manage/published": Published,		 //已发布新闻
    "/publish-manage/sunset": Sunset			//已下线新闻
}
```

最后结合localStorage里面的用户权限，遍历就行了

```js
 const [BackRouteList, setBackRouteList] = useState([])
    // 把rights和children直接合并在一起
    //或者查询rights?_embed=children，然后数组扁平化
    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res=>{
            setBackRouteList([...res[0].data,...res[1].data])
            // console.log(BackRouteList)
        })
    },[])
	//拿到用户权限
    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
    // 检查路由，本地得有且pagepermisson为1
    const checkRoute = (item)=>{
        return LocalRouterMap[item.key] && item.pagepermisson
    }
    //当前登录用户权限表里面必须得有对应权限
    const checkUserPermission = (item)=>{
        return rights.includes(item.key)
    }

    return (
        <Switch>
            {
                BackRouteList.map(item=>
                    {
                        if(checkRoute(item) && checkUserPermission(item)){
                            return <Route path={item.key} key={item.id} component=
                                //一定要精确匹配
                                {LocalRouterMap[item.key]} exact/> 
                         }
                        //  没有权限直接返回null，最终还是去找*，
                        return null
                    }   
                )
            }

            <Redirect from="/" to="/home" exact />
            {
                BackRouteList.length>0 && <Route path="*" component={Nopermission} />
            }
        </Switch>
    )
```



## 新闻业务

<a name="test">news</a>

业务字段：

![image-20220505165257705](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505165257705.png)

**auditState和publishState**这两个字段四个值含义一定要记清楚，不要搞混了。新闻发布流程基本就靠这2个字段了

审核流程：

![image-20220505165317110](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505165317110.png)

发布流程：

![image-20220505165342213](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505165342213.png)

## 发现一个更新bug

区域管理员更新角色后，居然会显示所用用户！

原来是这里当初为了偷懒，连发两次请求，还没有过滤数据

```js
axios.patch(`/users/${currentData.id}`, value).then(() => {
                    axios.get("/users?_expand=role").then(res => {
                        //这里要筛选一下喔
                        setDataSource(res.data)
                    })
                })
```

过滤一下：

```js
axios.patch(`/users/${currentData.id}`, value).then(() => {
                    axios.get("/users?_expand=role").then(res => {
                        let list = res.data
                        // 超级管理员可以看到所有用户
                        setDataSource(roleId === 1 ? list : [
                            // 区域管理员可以看到自己以及和自己同一区域以及区域编辑
                            ...list.filter(item => item.username === username),
                            ...list.filter(item => item.region === region && item.roleId === 3)
                        ])
                    })
                })
```

我的这个过滤只是把一个大请求里面的数据过滤，实际开发中一定不能这样做。一般都会重新发一个带更多修饰条件的请求的，这里偷懒了。

## 富文本：

传送门：

[jpuri/react-draft-wysiwyg: A Wysiwyg editor build on top of ReactJS and DraftJS. https://jpuri.github.io/react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)

[React Draft Wysiwyg (jpuri.github.io)](https://jpuri.github.io/react-draft-wysiwyg/#/demo)

判断用户是否填写内容，没在官方文档找到对应api。

自己写了个正则：

```js
/(\<p\>(\&nbsp;)*\<\/p\>){1,}/
```

但是如果用户输入<p></p>类似的，还是会匹配到。没想到啥好的解决办法。

而且有些特殊情况，比如用户输入文本过多之类的，还没解决

## antD通知框：

placement就是通知框跳出位置。

```js
notification.info({
                message: `通知`,
                description:
                    `您可以到审核列表中查看您的新闻`,
                placement: "top",
            });
```



# 第四天

## 新闻预览

![image-20220506142346524](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220506142346524.png)

## 时间处理

还是用moment喔

npm install moment *--save*

## 善于利用映射表

```js
// 审核状态映射表
const auditList = {
    0: "未审核",
    1: '审核中',
    2: '已通过',
    3: '未通过'
}
// 发布状态映射表
const publishList = {
    0: "未发布",
    1: '待发布',
    2: '已上线',
    3: '已下线'
}
// 状态颜色表
const colorState = {
    0: "red",
    1: "yellow",
    2: "green",
    3: "red"
}
```

## dangerouslySetInnerHTML:

我们要在新闻预览页面可以看到新闻内容喔，就需要在页面上插入HTML。为避免XSS攻击，就需要用这个属性喔



传送门：

[(26条消息) react中dangerouslySetInnerHTML使用（简洁）_exploringfly的博客-CSDN博客_dangerouslysetinnerhtml](https://blog.csdn.net/exploringfly/article/details/80582859)

- 1.dangerouslySetInnerHTMl 是React标签的一个属性，类似于angular的ng-bind，vue中的v-html
- 2.有2个{{}}，第一{}代表jsx语法开始，第二个是代表dangerouslySetInnerHTML接收的是一个对象键值对;

- 3.既可以插入DOM，又可以插入字符串；

- 4.不合时宜的使用 innerHTML 可能会导致 cross-site scripting (XSS) 攻击。 净化用户的输入来显示的时候，经常会出现错误，不合适的净化也是导致网页攻击的原因之一。dangerouslySetInnerHTML 这个 prop 的命名是故意这么设计的，以此来警告，它的 prop 值（ 一个对象而不是字符串 ）应该被用来表明净化后的数据。

## 修改新闻

这个时候我们又需要把html写回富文本，看官方文档吧。很容易找到

[React Draft Wysiwyg (jpuri.github.io)](https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp)

用这个就行

```
import htmlToDraft from 'html-to-draftjs';
```

## json-server操作符

_ne不等于，__lte小于等于我们会用到。还有 _like, _gte等等操作符

[typicode/json-server: Get a full fake REST API with zero coding in less than 30 seconds (seriously) (github.com)](https://github.com/typicode/json-server#operators)

## antD可编辑表格

这个太复杂了，目前我感觉会用就行了。有空研究研究。

我记录下官方写法：

### 1.components

Table多了一个属性最里面有两个属性EditableRow和EditableCell

```jsx
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
```

### 2.EditableRow和EditableCell

这两个就是复杂的地方，有空研究研究。

需要用到context和ref，记得提前引入和创建

![image-20220506214727705](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220506214727705.png)

### 3.columns

在columns数组里面，在你想要可编辑单元格的地方，多写一个 onCell属性，见下

```js
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
```

### 4.handleSave

最终我们写个handleSave函数，第一个参数就可以接收最新的单元格信息。

<img src="https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/148.gif" style="zoom: 100%"></img>

# 第五天

## 发布管理

这部分3个页面，待发布，已发布，已下线。页面都差不多，直接抽成一个组件。函数部分也一样，就是axios请求的publishState不一样，直接自定义hooks就行。

还有一个不一样的地方就是按钮，由于按钮触发的回调不一样，但都必须拿到新闻id。我们直接传函数，以未发布组件为例：

自定义hooks中：

```js
//未发布的发布按钮回调
    const handlePublish = (id) => {
        //执行发布逻辑
    }
```

待发布组件Unpublished：

```jsx
 // 待发布为publishState为1
    const { dataSource, handlePublish } = usePublish(1)

    return (
        <NewsPublish
            dataSource={dataSource}
            // 这是一个传递给子项的属性名叫button
            //button是一个函数，函数返回一个组件
    		//写成函数才能拿到id喔
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
```



公共组件NewsPublish：

columns列中

```jsx
{
            title:'操作',
            render(item){
                // 执行button这个函数，这样就可以拿到id了
                return(
                    <>
                        {props.button(item.id)}
                    </>
                )
            }
}
```

## antD的Spin

加载，包裹在需要加载的地方。我包在NewsRouter里面。

然后属性spinning控制是否显示加载，用redux管理这个状态就行

```jsx
<Spin size="large" spinning={props.isLoading}>
            <Switch>
…………………………………………………………………………………………路由…………………………………………………………………………………………
            </Switch>
        </Spin>
```



## react-redux

主要引入两个reducer，分别处理折叠侧边栏，和loading。两个都是简单的布尔值，由于隔得太远，就用redux了。

没啥好说的。

喔，loading是放在axios拦截器里面dispatch的，没在组件里面，所以要手动引入下store

## redux持久化

用这个库：redux-persist。

官方文档：[rt2zz/redux-persist: persist and rehydrate a redux store (github.com)](https://github.com/rt2zz/redux-persist)

刷新后redux的状态不会变为初始值，我们的这个设置把状态放在localStorage里面了。

一切配置按照官网说明来

![image-20220507170506376](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220507170506376.png)

### store.js:

```js
import { createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducer/CollapsedReducer'
import { isLoadingReducer } from './reducer/isLoadingReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//持久化配置
const persistConfig = {
    key: '小冯',
    storage,
}
// 合并reducer
const reducer = combineReducers({
    CollapsedReducer,
    isLoadingReducer
})
// 改造我们的reducer
const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer, composeWithDevTools())
let persistor = persistStore(store)


export  { store, persistor }
```

### App.js

```jsx
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import { store,persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  )
}
export default App
```

### 自定制持久化

当然不能把所有的状态都持久化，可以自定制的。

用白名单或者黑名单都行。

https://github.com/rt2zz/redux-persist#blacklist--whitelist

## 数据可视化：

### json-server排序，分页

为获取浏览量最多的新闻，点赞数最多的新闻。需要使用额外条件筛选

传送门：

[typicode/json-server: Get a full fake REST API with zero coding in less than 30 seconds (seriously) (github.com)](https://github.com/typicode/json-server#sort)

https://github.com/typicode/json-server#paginate

# 第六天

## 数据可视化：

### echars Bar柱状图

我们在官方案例上，改改就行了，还是很简单。深入就难了喔。

#### 导入问题

传送门：

[Import *](https://zh.javascript.info/import-export#import)

#### 数据转化

转化成这样的格式

![image-20220508135646280](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220508135646280.png)

用loadsh的groupBy就行

传送门:[lodash中文文档 - 首页 (think2011.net)](http://lodash.think2011.net/groupBy)

```js
_.groupBy(res.data, item=>item.category.title)
```

最后根据echarts所需数据格式再转换一遍就行。

x轴是Object.keys(data),y轴映射数组长度就行Object.values(data).map(item=>item.length)

#### 小数

y轴不应该有小数喔

传送门：[Documentation - Apache ECharts](https://echarts.apache.org/zh/option.html#yAxis.minInterval)

#### 响应式

好像自带就有

```jsx
// 响应式
        window.onresize = () => {
            myChart.resize()
        }
```

注意销毁时机，在useEffect return里面

### echars Bar饼状图

和Bar大差不差

#### 抽屉

把所需容器放在抽屉里。

两个问题：

1.必须在dom创建之后再绘制(setTimeOut解决)；

2.由于抽屉打开关闭，会导致重复初始化。(把初始化的值，用状态保存。判断一下状态是否为空就行)



## 游客系统

写一个非常简单的游客系统，供游客浏览点赞新闻，没有登录注册。

只有两个路由：/news 所有已发布的新闻。/detail 新闻细节(和新闻预览页面基本上一样)

获取数据，注意数据转化格式。

```js
// 已发布的所有新闻
    const [newsList, setNewsList] = useState([]);
    // 获取已发布的所有新闻
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category')
            .then(res => {
                // setNewsList(res.data)
                let tempData = _.groupBy(res.data, item => item.category.title)
                setNewsList(Object.entries(tempData))
            })
    }, [])
```



新闻浏览+1

链式更新.不知道真正的这种业务该咋做，我这个只要一进来页面，就会访问量+1，应该再配套一个游客登录注册系统会好做一点

```js
  // 获取新闻信息,访问量+1
    useEffect(() => {
        axios.get(`/news/${match.params.id}?_expand=category`).then(res => {
            // 本地浏览量+1
            setNewsInfo({
                ...res.data,
                view:res.data.view+1
            })
            return res.data
        }).then(res=>{
            // 同步到后端
            axios.patch(`/news/${match.params.id}`,{
                view:res.view+1
            })
        })

    }, [match.params.id])
```

