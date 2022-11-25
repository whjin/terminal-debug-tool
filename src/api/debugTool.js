import request from "@/utils/request";

// 测试接口
export function testApi(url) {
  return request({
    url: url + "/terminal/testing/test",
    method: "get",
  });
}

// 获取服务器主分机APP版本号
export function getUpdateInfo(url) {
  return request({
    url: url + "/terminal/testing/getUpdateInfo",
    method: "get",
  });
}

// 获取主机列表
export function getControlList(url, params) {
  return request({
    url: url + "/terminal/testing/getControlList",
    method: "post",
    data: params,
  });
}

// 获取主机列表
export function getTerminalList(url, params) {
  return request({
    url: url + "/terminal/testing/getTerminalList",
    method: "post",
    data: params,
  });
}

// 获取命令编号
export function getCommandInfo(url) {
  return request({
    url: url + "/terminal/testing/getCommandInfo",
    method: "get",
  });
}

// 发送指令
export function sendCommand(url, params) {
  return request({
    url: url + "/terminal/testing/sendCommand",
    method: "post",
    data: params,
  });
}

// 测试人脸接口
export function faceComparTest(url, params) {
  return request({
    url: url + "/terminal/faceRecognition/faceComparTest",
    method: "post",
    data: params,
  });
}
