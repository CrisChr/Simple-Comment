const GET_DATA = "get_data";
const POST_DATA="post_data";
const GET_TOTAL = "get_total";
const UPDATE_TOTAL="update_total";

const $http= async(requsetType, alias="", params={})=>{
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest();
    if(requsetType==="GET" || requsetType==="get"){
      let page=1, limit=10;
      if(Object.keys(params).length){
        page = params.page;
        limit = params.limit;
      }
      if(alias===GET_TOTAL){
        xhr.open(requsetType, `http://localhost:3001/page`);
      }else if(alias === GET_DATA){
        xhr.open(requsetType, `http://localhost:3001/data?_page=${page}&_limit=${limit}`);
      }
      xhr.send();
    }else if(requsetType==="POST" || requsetType==="post"){
      if(alias === POST_DATA){
        xhr.open(requsetType, "http://localhost:3001/data");
      }else if(alias === UPDATE_TOTAL){
        xhr.open(requsetType, "http://localhost:3001/page");
      }
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(params));
    }
    xhr.onreadystatechange = function(){
      if(xhr.readyState===4){
        if(xhr.status === 200 || xhr.status === 201){
          resolve(JSON.parse(xhr.response));
        }else{
          reject("接口异常！");
        }
      }
    }
  }).catch(err => {
    console.log(err);
  })
}

export const getData=(params={})=>{
  return $http("get", GET_DATA, params);
}

export const postData=(params)=>{
  return $http("post", POST_DATA, params);
}

export const getTotal=()=>{
  return $http("get", GET_TOTAL);
}

export const updateTotal=(params={})=>{
  return $http("post", UPDATE_TOTAL, params);
}