# Simple-Comment

## 基于React + Ant Design的评论小组件

---

* **启动**

```
cd mock-server
npm install
npm start
cd ..
npm install
npm start
```

* **主要功能**

1. 发表评论

2. 评论列表默认向下滚动无限加载
  pagination属性默认为false

3. 评论列表可设置为分页展示
  pagination属性设置为true

* **其它属性**

1. **getList**
  接受一个函数，该函数返回查询列表

2. **handleSubmit**
  事件处理函数，处理“发表评论”事件

* **举例**
```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './component/App';
import {getData, postData} from './api/data';

class Test extends React.Component{
  render(){
    return(
      <App
        getList={this.getDataSource}
        handleSubmit={this.postComment}
        pagination={true}
      />
    )
  }

  getDataSource=(params)=>{
    //return a Promise function
    return getData(params);
  }

  postComment=(content, callback)=>{
    postData(content).then(res=>{
      Object.values(callback).map(call => {
        return call();
      })
    })
  }
```
