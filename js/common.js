//存放一些公共逻辑

//设置基础地址
axios.defaults.baseURL = 'https://hmajax.itheima.net';
//调用接口可以省略配置部分
//axios({
//    url:'/register',
//    //https://hmajax.itheima.net/login
//    method:'post',
//    date:{
//      uesrname:'itheima008',
//      password:'123456'
//    }
//
//})

function showToast(msg) {
    const toastDom = document.querySelector('.my-toast')
    const toast = new bootstrap.Toast(toastDom)
        //修改内容
    document.querySelector('.toast-body').innerText = msg
    toast.show()
}

function checklogin() {
    const token = localStorage.getItem('token')
    if (token == null) {
        showToast('请先登录')
        setTimeout(() => {
            location.href = './login.html'
        }, 1500)
    }
}
//获取用户名
function renderUsername() {
    const username = localStorage.getItem('username')
    document.querySelector('.username').innerText = username;
}

//抽取退出登录的函数
function registerLogout() {
    document.querySelector('#logout').addEventListener('click', () => {
        //删除缓存并且跳转到登录页面
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        location.href = './login.html'
    })
}

//添加请求拦截器
axios.interceptors.request.use(function(config) {
    //console.log(config);对象
    //在发送请求之前做了些什么
    //每次发送请求，都会执行这个调函数，在发送请求之前,统一设置token
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = token
    }
    return config;
}, function(error) {
    //对请求错误做些什么
    return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(function(response) {
    //对响应数据做点什么
    return response.data;
}, function(error) {
    //对响应错误做点什么，比如统一处理token失效
    //判断token失效(401)
    if (error.response.status == 401) {
        //删除本地缓存并提醒用户
        localStorage.removeItem('token')
        localStorage.removeItem('username')
            //给一个提示，让其重新登录
        showToast('请重新登录')
            //上面如果token过期或者被恶意更改，强制让其重新登录
        setTimeout(() => {
            location.href = 'login.html'
        }, 1500)
    }
    return Promise.reject(error);
});