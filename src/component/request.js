import {$http, API} from "../api/request-api";


export function getData(data = {}){
  return $http({
    url: API.data,
    method: "get",
    data
  });
}

export function postData(data = {}){
  return $http({
    url: API.data,
    method: "post",
    data
  });
}

export function getTotal(){
  return $http({
    url: API.total,
    method: "get"
  });
}

export function updateTotal(data = {}){
  return $http({
    url: API.total,
    method: "post",
    data
  });
}