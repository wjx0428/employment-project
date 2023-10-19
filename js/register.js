// 用户注册
document.querySelector('#btn-register').addEventListener('click', async() => {
    //收集校验数据
    const form = document.querySelector('.register-form')
    const data = serialize(form, { empty: true, hash: true })
        //console.log(data);对象格式 需要解构出来
    const { username, password } = data;
    //1.判断是否为空
    if (username == '' || password == '') {
        showToast('用户名和密码不能为空')
        return;
    }
    //2.长度判断
    if (username.length < 8 || username.length > 30 || password.length < 6 || password.length > 30) {
        showToast('用户名长度为8-30,密码长度为6-30')
        return;
    }
    //3.提交数据
    // 如果try里面代码有错误，catch形参error就会触发（以对象格式触发的）
    try {
        const res = await axios.post('/register', { username, password })
            //console,log(res);
        showToast(res.message)
    } catch (error) {
        showToast(error.response.data.message);
    }
})