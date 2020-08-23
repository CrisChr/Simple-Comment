import React from 'react';
import { List, Comment, Spin, Pagination } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

const spinStyle = {
  position: "absolute",
  bottom: "40px",
  width: "100%",
  textAlign: "center"
}

const infiniteStyle = {
  border: "1px solid #e8e8e8",
  borderRadius: "4px",
  overflow: "auto",
  padding: "8px 24px",
  height: "500px"
}
export class CommentList extends React.Component {
  render() {
    const {comments,
      handleInfiniteOnLoad, loading,
      hasMore, pagination, currentPage, total} = this.props;
      return (
      comments.length > 0 &&
      (
        pagination ?
        <>
          <div style={{height:"500px",overflow:"auto",display:"flex",flexDirection:"column"}}>
            <List
              dataSource={comments}
              header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
              itemLayout="horizontal"
              renderItem={props => <Comment {...props} />}
            />
          </div>
          <div style={{display:"flex",flexDirection:"row-reverse"}}>
            <Pagination
            defaultCurrent={1} defaultPageSize={10} size="small" showTotal={total=>`Total ${total} items`}
            current={currentPage} total={total} onChange={this.onChange}/>
          </div>
        </>
        :
        <div style={infiniteStyle}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            useWindow={false}
            loadMore={handleInfiniteOnLoad}
            hasMore={!loading && hasMore}
          >
            <List
              dataSource={comments}
              header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
              itemLayout="horizontal"
              renderItem={props => <Comment {...props} />}
            >
            {loading && hasMore && (
            <div style={spinStyle}>
              <Spin/>
            </div>
            )}
            </List>
          </InfiniteScroll>
        </div>
      )
    )
  }

  onChange=(page)=>{
    this.props.handleInfiniteOnLoad(page);
  }
}