import axios from 'axios';
import { inject } from './index';
// import Config from '../config';
// import AjaxUploader from "ant-design-vue/es/vc-upload/src/AjaxUploader";


const service = axios.create({
    baseURL: "./cas", // api的base_url
    timeout: 20000 // 请求超时时间
});

inject(service);

export default service;