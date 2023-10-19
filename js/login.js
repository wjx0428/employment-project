/**
 * 用户登录
 * 收集用户填写的数据
 * 提交表单
 * 缓存响应的数据
 * 跳转到首页index页面
 */
document.querySelector('#btn-login').addEventListener('click', async() => {
    //1.收集用户填写的数据
    const form = document.querySelector('.login-form');
    const data = serialize(form, { empty: true, hash: true })
    const { username, password } = data;
    //非空判断
    if (username === '' || password === '') {
        showToast('用户名和密码不能为空')
        return;
    }
    //格式的判断
    if (username.length < 8 || username.length > 30 || password.length < 6 || password.length > 30) {
        showToast('用户名长度为8-30,密码长度为6-30')
        return;
    }

    //提交数据
    try {
        const res = await axios.post('/login', { username, password })
        console.log(res);
        showToast(res.message)
            //缓存响应数据
            //localStorage.setItem('键名',值)
            //本地存储
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
            //跳转到首页
            //延迟一会儿 再跳转 让提示框显示
        setTimeout(() => {
            location.href = './index.html'
        }, 1500)
    } catch (error) {
        showToast(error.response.data.message)
    }

})