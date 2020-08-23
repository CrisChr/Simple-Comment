import React from 'react';
import 'antd/dist/antd.css';
import { Comment, Avatar, Form, Input, Button, message} from 'antd';
import moment from 'moment';
import {CommentList} from './comment-list';
import {getTotal, updateTotal } from "../api/data";

const {TextArea} = Input;

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      author: "Red",
      avatar:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      value:undefined,
      comments:[],
      submitting: false,
      loading: false,
      hasMore: true,
      page: 1,
      limit: 10,
      total: 10,
      pagination: props.pagination || false
    }
  }
  render(){
    const {
      value,
      author,
      avatar,
      comments,
      submitting,
      loading,
      hasMore,
      page,
      total,
      pagination
    } = this.state;
    return(
      <>
        <Comment
            avatar={
              <Avatar
                src={avatar}
                alt={author}
              />
            }
            content={
              <>
                <Form.Item>
                  <TextArea rows={4} onChange={this.onChange} value={value} />
                </Form.Item>
                <Form.Item style={{float:"right"}}>
                  <Button htmlType="submit" loading={submitting} onClick={()=>this.onSubmit()} type="primary">
                    Add Comment
                  </Button>
                </Form.Item>
              </>
            }
          />
          <CommentList comments={comments} pagination={pagination}
            loading={loading} hasMore={hasMore}
            currentPage={page} total={total}
            handleInfiniteOnLoad={this.loadMore}/>
        </>
    )
  }
  componentDidMount(){
    this.getTotal();
    this.getList();
  }

  getTotal=()=>{
    getTotal().then(res=>{
      this.setState({total: res.total});
    })
  }

  getList=()=>{
    const {getList} = this.props;
    const {page, limit, pagination} = this.state;
    getList({page, limit}).then(res=>{
      this.setState((prevState) => ({
        comments: pagination ? res : prevState.comments.concat(res),
        page: pagination ? 1 : (prevState.page + 1)
      }))
    })
  }

  onChange=(e)=>{
    this.setState({
      value:e.target.value
    })
  }
  loadMore=(currentPage)=>{
    this.setState({loading:true});
    const {getList} = this.props;
    let {page, limit, pagination} = this.state;
    page = pagination ? currentPage : page;
    getList({page, limit}).then(res=>{
      if(res.length===0){
        message.warning("Loaded all");
        this.setState({
          hasMore:false,
          loading:false
        })
        return;
      }
      this.setState((prevState) => ({
        comments: pagination ? res : prevState.comments.concat(res),
        loading: false,
        page: pagination ? page : prevState.page +1
      }))
    })
  }

  onSubmit=()=>{
    if(!this.state.value){
      return;
    }
    this.setState({submitting:true});
    this.props.handleSubmit({
      id: Math.random(),
      author:this.state.author,
      avatar:this.state.avatar,
      content:this.state.value,
      datetime: moment().fromNow()
    }, {getList: this.getList, getTotal:this.getTotal});
    //update total
    updateTotal({total:this.state.total+1});
    const timer = setTimeout(()=>{
      this.setState({value:undefined,submitting:false});
      clearTimeout(timer);
    }, 1500);
  }
}

export default App;
