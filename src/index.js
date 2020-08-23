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
}

ReactDOM.render(
    <Test />,
  document.getElementById('root')
);