import axios from 'axios'
import qs from 'qs'

const domain = window.location.host;
let BI_API_BASE_URL = '';
if(domain == 'localhost:3000'){
    BI_API_BASE_URL = 'https://bi.yongche.com';
}else {
    BI_API_BASE_URL = 'https://'+domain;
}

// axios 配置
const xhr = axios.create({
    baseURL: BI_API_BASE_URL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
})

//添加请求拦截器
xhr.interceptors.request.use(
    function(config) {
        // console.log('api传参', config)
        let entToken = localStorage.getItem('userInfo');
        // console.log('api请求token', entToken);
        if (entToken && entToken.length > 0) {
            // console.log('拿到token');
            config.headers['Authorization'] = 'Bearer ' + entToken;
        }
        else {
            // console.log('token失败返回');
            // this.$router.push({path: '/login'});
            // window.location.href = 'http://sso.yongche.com/auth/login?app_id=67&done=https%3A%2F%2Fbi.yongche.com%2Findex%2Finit&cn=E&idle=1'
            return config;
        }
        // 如果请求是 post 的请求 用qs 配置下 请求参数
        if (config.method === 'post' || config.method === 'put') {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            return config
        }
        // 采用完全自定义的方式书写 get 的请求时，将 post请求中放在 data 里面的数据，放到 params当中
        if (config.method === 'get' && config.data && Object.keys(config.data).length) {
            config.params = qs.parse(config.data);
            return config;
        }
        // 简单的调用 get 请求
        if (config.method === 'get') {

            // console.log(config)
            // let params = handleChinese(config.params)         // 中文字符替换成 ASCII 码
            // config.url += '?' + qs.stringify(params, { encode: false })
            // config.params = {}
            return config
        }

        return config
    },
    function(error) {
        //请求错误时做些事
        return Promise.reject(error);
    }
)

// 添加响应拦截器
xhr.interceptors.response.use(
    function(response) {
        console.log(response)
        // if (response.data[STATUS] === ERR_OK) {
        //     return response.data
        // } else {
        //     // 接口异常返回
        //     const flag = parseInt(response.data[STATUS], 10)
        //     const msg =
        //         flag === 201
        //             ? '201 error: Missing parameter'
        //             : flag === 202
        //             ? '202 error: Parameter is malformed'
        //             : flag === 500
        //                 ? '500 error: Background error'
        //                 : flag === '501' ? '501 error: No data' : flag === '502' ? '502 error: Session expired' : 'Unknown error';
        //
        //     if (flag === 10000) {
        //         utiljs.afterLoginOut();
        //         router.replace({path: '/login'});
        //     }
        //     else {
        //         console.error(msg);
        //         return Promise.reject(response.data);
        //     }
        // }
    },
    function(error) {
        console.error('Request failed')
        return Promise.reject(error)
    }
)

export default xhr;