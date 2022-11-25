import axios from "axios";
import config from "@/utils/variable";
import { Message } from "element-ui";

// axios请求实例构造
const instance = axios.create({
  baseURL: config.baseUrl,
});

// axios请求拦截
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// axios响应拦截
instance.interceptors.response.use(
  (response) => {
    let res = response.data;
    if (res.state.code == "200") {
      return res;
    } else {
      Message({
        title: "提示",
        message: "请检查服务器IP或端口是否填写正确",
        type: "error",
      });
      return Promise.reject();
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
