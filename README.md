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
