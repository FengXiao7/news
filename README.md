# 说明：

整个项目的后端接口都是json-server做的，启动的时候请开启8000端口。

在src目录下启动，

命令：

json-server --watch .\db.json -p 8000

更多命令参见官网



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

## 用户权限管理状态：

用户权限管理这块，状态有很多，不要绕晕了。我都写了很详细的注释，代码里面更详细



## 同步：

useState方法返回的set函数，不像setState一样有第二个回调函数。需要用set函数达到setState第二个回调函数的效果，

直接放在宏任务setTimeout里面就行。

## 表格过滤

官网的参数看的不怎么懂。

有两个属性就行了。都写在columns表格列中。

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

### text：

![image-20220505001921580](https://picture-feng.oss-cn-chengdu.aliyuncs.com/img/image-20220505001921580.png)

### value：

这个和第二个属性有关

### 第二个属性

onFilter,这个属性是一个函数，接收两个参数。在里面写我们的筛选逻辑

第一个参数就是，之前的那个value.

第二个参数就是每行每行的数据，和render的那个item是一个意思

```js
 onFilter: (value, item) => item.name.indexOf(value) === 0,
```

## 发请求更新数据？

- 方案1 先在页面更新，再发送请求更新后台，缺点整理数据麻烦
- 方案2 发送请求更新成功后，再次发送请求得到最新数据,缺点要发两次请求.

  不知道哪种用的多一点。

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
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    "/news-manage/add":NewsAdd,
    "/news-manage/draft":NewsDraft,
    "/news-manage/category":NewsCategory,
    "/audit-manage/audit":Audit,
    "/audit-manage/list":AuditList,
    "/publish-manage/unpublished":Unpublished,
    "/publish-manage/published":Published,
    "/publish-manage/sunset":Sunset
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
                            return <Route path={item.key} key={item.id} component={LocalRouterMap[item.key]} exact/> 
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



## 新闻业务前瞻

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
