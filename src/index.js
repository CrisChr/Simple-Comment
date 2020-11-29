import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './component/App';
import {getData, postData} from './component/request';

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
    return getData(params);
  }

  postComment=(content, callback)=>{
    postData(content).then(res=>{
      callback();
    })
  }
}

ReactDOM.render(
    <Test />,
  document.getElementById('root')
);