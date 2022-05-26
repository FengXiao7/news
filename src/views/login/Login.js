import React from 'react';
import Particles from 'react-tsparticles'
import { loadFull } from "tsparticles";
import { Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css'
import axios from 'axios';




export default function Login({ history }) {
  //表单收集完成回调,相当丑陋！
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}`)
      .then(res => res.data.length === 0 ? message.warning(`不存在用户${values.username}！`) :
        axios.get(`/users?username=${values.username}&password=${values.password}`)
          .then(res => res.data.length === 0 ? message.warning(`用户${values.username}密码错误！`) :
            axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true`)
              .then(res => res.data.length === 0 ? message.warning(`用户${values.username}没有权限！`) :
                axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
                  .then(res => {
                    localStorage.setItem('token', JSON.stringify(res.data[0]))
                    message.success('欢迎'+values.username+"!")
                    history.push("/")
                  }
                  ))))
  }

  //初始化粒子动画
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  //粒子参数
  const options = {
    "background": {
      "color": {
        "value": "#232741"
      },
      "image": "url('/logo192.png')",
      "position": "50% 5%",
      "repeat": "no-repeat",
      "size": "10%"
    },
    "fullScreen": {
      "zIndex": 1
    },
    "interactivity": {
      "events": {
        "onClick": {
          "enable": true,
          "mode": "repulse"
        },
        "onHover": {
          "enable": true,
          "mode": "bubble"
        }
      },
      "modes": {
        "bubble": {
          "distance": 250,
          "duration": 2,
          "opacity": 0,
          "size": 0,
          "divs": {
            "distance": 200,
            "duration": 0.4,
            "mix": false,
            "selectors": []
          }
        },
        "grab": {
          "distance": 400
        },
        "repulse": {
          "distance": 400,
          "divs": {
            "distance": 200,
            "duration": 0.4,
            "factor": 100,
            "speed": 1,
            "maxSpeed": 50,
            "easing": "ease-out-quad",
            "selectors": []
          }
        }
      }
    },
    "particles": {
      "color": {
        "value": "#ffffff"
      },
      "links": {
        "color": {
          "value": "#ffffff"
        },
        "distance": 150,
        "opacity": 0.4
      },
      "move": {
        "attract": {
          "rotate": {
            "x": 600,
            "y": 600
          }
        },
        "enable": true,
        "outModes": {
          "bottom": "out",
          "left": "out",
          "right": "out",
          "top": "out"
        },
        "random": true,
        "speed": 1
      },
      "number": {
        "density": {
          "enable": true
        },
        "value": 160
      },
      "opacity": {
        "random": {
          "enable": true
        },
        "value": {
          "min": 0,
          "max": 1
        },
        "animation": {
          "enable": true,
          "speed": 1,
          "minimumValue": 0
        }
      },
      "size": {
        "random": {
          "enable": true
        },
        "value": {
          "min": 1,
          "max": 3
        },
        "animation": {
          "speed": 4,
          "minimumValue": 0.3
        }
      }
    }
  }

  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: "100%" }}>

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
      />

      <div className="formContainer">
        <div className="logintitle">新闻发布后台管理系统</div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '用户名不能为空',
              }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名"/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <Link to="/news">进入游客系统</Link>
            </Button>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};


