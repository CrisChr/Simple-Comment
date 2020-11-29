/**
 * 请求通用方法
 */
import React from "react";
import ReactDOM from "react-dom";
import {message, Spin} from "antd";
import {apis} from "./api";

//组合所有API
const API = Object.assign({}, apis);

//发送网络请求
const $http = function(
  {
    url,
    method="post",
    data={},
    resType="json",
    headers={},
    withCredentials=true,
    onProgress=(e)=>e,
    noLoading = false
  }
){
  return new Promise((resolve, reject) => {
    const close = loadingSpin();

    //请求头
    const reqHeader = Object.assign({
      "Content-Type":method.toLocaleUpperCase()==="GET" ? "application/x-www-form-urlencoded" : "application/json"
    }, headers);

    const xhr = new XMLHttpRequest();

    //请求参数
    const reqData = ()=>{
      if(reqHeader["Content-Type"].includes("multipart/form-data")){
        xhr.upload.onprogress=onProgress;
        const formData = FormData();
        Object.entries(data).forEach(item => {
          formData.append(item[0], item[1]);
        });
        delete reqHeader["Content-Type"];
        return formData;
      }else if(["GET","DELETE"].includes(method.toLocaleUpperCase())){
        return parseQueryParams(data);
      }else{
        return JSON.stringify(data);
      }
    };

    //设置请求头
    const setReqHeader = function(reqHeader={}){
      Object.entries(reqHeader).forEach(item => {
        xhr.setRequestHeader(item[0], item[1]);
      });
      const tokenId = sessionStorage.getItem("tokenId");
      if(tokenId){
        xhr.setRequestHeader("tokenId", tokenId);
      }
      xhr.withCredentials = withCredentials; // 允许跨域
    };

    noLoading && close();

    const requestData = reqData();

    if(["GET","DELETE"].includes(method.toLocaleUpperCase())){
      xhr.open(method.toLocaleUpperCase(), url+requestData);
      setReqHeader(reqHeader);
      xhr.send();
    }else if(["POST","PUT"].includes(method.toLocaleUpperCase())){
      xhr.open(method.toLocaleUpperCase(), url);
      setReqHeader(reqHeader);
      xhr.send(requestData);
    }
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 2){
        xhr.responseType = resType;
      }
      if(xhr.readyState === 4){
        if(xhr.status === 200 || xhr.status === 201){
          // if(!(url.includes("/auth/login") || url.includes("/auth/logout") || url.includes("/auth/code"))){
          //   loginAvailable(xhr);
          //   close();
          // }
          if(xhr.response === null){
            reject("接口没有响应体");
            message.error("接口没有响应体", 2.0);
            close();
          }else if(xhr.response || resType==="blob"){
            resolve(xhr.response);
            close();
          }else{
            reject((xhr.response || {}).message || "接口异常！");
            message.error((xhr.response || {}).message || "接口异常！", 2.0);
            close();
          }
        }else{
          reject("接口异常！");
          message.error("接口异常！", 2.0);
          close();
        }
      }
    };
  });
}

//加载动画
const loadingSpin = function(){
  const spinWrapper = document.createElement("div");
  spinWrapper.setAttribute("id", "spin-wrapper");
  document.body.appendChild(spinWrapper);
  ReactDOM.render(<Spin size="large" tip="数据交互中..."/>, spinWrapper);
  return ()=>{
    spinWrapper.remove();
  }
}

//将对象转化为params字符串
const parseQueryParams = function(data={}){
  if(Object.entries(data).length === 0){
    return ""
  }else{
    return "?"+Object.entries(data).map(item=>{
      return item[0]+"="+encodeURIComponent(item[1]);
    }).join("&");
  }
}

// 解析字符串为对象
const parseParams = function(str = ""){
  if(str.indexOf("?") === 0){
    str = str.substring(1);
  }
  if(str.trim() === ""){
    return ""
  }
  return str.split("&").reduce((init, item) => {
    const key = item.split("=")[0];
    const value = decodeURIComponent(item.split("=")[1]);
    init[key] = value;
    return init;
  }, {});
}

//执行登录失效校验
const loginAvailable = function(xhr){
  const tokenIdStatus = xhr.getResponseHeader("tokenIdStatus");
  const nullText = "获取tokenIdStatus失败，后端请设置Access-Control-Expose-Headers:tokenIdStatus";
  const noTokenIdText = "获取tokenIdStatus失败，请检查响应头";
  const validateFailText = "token失效，请重新登录";
  switch(tokenIdStatus){
    case null:
      message.error(nullText, 3);
      break;
    case "noTokenId":
      message.error(noTokenIdText, 3);
      break;
    case "validateFail":
      message.error(validateFailText, 3);
      sessionStorage.clear();
      logoutCallback();
      break;
    default:
      break;
  }
}

//账号登出
const logoutCallback=function(){
  const loginUrl = sessionStorage.getItem("loginUrl");
  sessionStorage.clear();
  if(loginUrl){
    window.location.href=loginUrl;
  }else{
    window.location.reload();
  }
}

export {API, $http, logoutCallback, parseQueryParams, parseParams};