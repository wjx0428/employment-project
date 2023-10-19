//整合函数
checklogin();
//渲染用户名
renderUsername();
//退出登录
registerLogout();
//获取学员数据
async function getData() {
    //获取数据
    const res = await axios.get('/students');
    // console.log(res.data);
    const html = res.data.map((v) => {
        const { name, age, gender, group, hope_salary, salary, province, city, area, id } = v;
        return `
        <tr>
        <td>${name}</td>
        <td>${age}</td>
        <td>${gender ===0 ? '男':'女'}</td>
        <td>第${group}组</td>
        <td>${hope_salary}</td>
        <td>${salary}</td>
        <td>${province+city+area}</td>
        <td data-id = "${id}">
            <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen"></i></a>
            <a href="javascript:;" class="text-danger"><i class="bi bi-trash"></i></a>
            </td>
        </tr>
        `;
    }).join('');
    document.querySelector('.list').innerHTML = html;
    document.querySelector('.total').innerText = res.data.length;
}
getData();
//显示弹窗
const modalDom = document.querySelector('#modal');
const modal = new bootstrap.Modal(modalDom);
//
document.querySelector('#openModal').addEventListener('click', () => {
        //设置标题
        document.querySelector('.modal-title').innerText = '添加学员';
        //表单重置
        document.querySelector('#form').reset(); //js内置reset方法，可以把某一个form表单区域内重置成功
        citySelect.innerHTML = `<option value="">--城市--</option>`;
        areaSelect.innerHTML = `<option value="">--城市--</option>`;
        //删除模态框modal上面的自定义ai
        modalDom.dataset.id = '';

        //点击+，让填写模框显示
        modal.show();
    })
    //省市区联动
const proSelect = document.querySelector('[name=province]'); //省
const citySelect = document.querySelector('[name=city]'); //市
const areaSelect = document.querySelector('[name=area]'); //区
async function initSelect() {
    //省数据获取
    const proRes = await axios.get('/api/province');
    //console.log(proRes);
    const proHtml = proRes.list.map(v => {
        return `
            <option value="${v}">${v}</option>
             `;
    }).join('');
    proSelect.innerHTML = `<option value="">--省份--</option>${proHtml}`;
    //获取市的数据
    //change事件 -- 当表单状态改变时候触发
    proSelect.addEventListener('change', async() => {
            const cityRes = await axios.get('/api/city', {
                    params: {
                        pname: proSelect.value,
                    }
                })
                //console.log(cityRes.list);
            const cityHtml = cityRes.list.map(v => {
                return `
                <option value="${v}">${v}</option>
                `;
            }).join('');
            //console.log(cityHtml);
            citySelect.innerHTML = `<option value="">--城市--</option>${cityHtml}`;
            //清空区县下拉选框标签的内容，提高用户体验度
            areaSelect.innerHTML = '`<option value="">--地区--</option>'
        })
        //区县数据获取+渲染
    citySelect.addEventListener('change', async() => {
        const areaRes = await axios.get('/api/area', {
            params: {
                pname: proSelect.value,
                cname: citySelect.value
            }
        })

        const areaHtml = areaRes.list.map(v => {
            return ` <option value="${v}">${v}</option>`;
        }).join('');
        areaSelect.innerHTML = `<option value="">--地区--</option>${areaHtml}`;
    })
}
initSelect()
    //数据新增业务------------
document.querySelector('#submit').addEventListener('click', () => {
        // //调用新增学员数据    
        // addStudent()
        if (modalDom.dataset.id) {
            saveEdit();
        } else {
            //调用新增学院的函数
            addStudent();
        }
    })
    //函数抽取,新增学员
async function addStudent() {
    //收集表单数据
    const form = document.querySelector('#form');
    const data = serialize(form, { hash: true, empty: true });
    // console.log(data); 测试用函数
    data.age = +data.age;
    data.gender = +data.gender;
    data.hope_salary = +data.hope_salary;
    data.salary = +data.salary;
    data.group = +data.group;
    try {
        //新增数据
        const res = await axios.post('/students', data);
        showToast(res.message);
        // console.log(res);
        //重新渲染页面
        getData();
    } catch (error) {
        showToast(error.response.data.message);
    }
    modal.hide(); //添加成功/失败后，模态框要隐藏
}

//删除业务
//绑定事件
document.querySelector('.list').addEventListener('click', (e) => {
        //console.log(e.target);//目标元素
        //console()此方法，判断某元素是否包含指定的类名 返回值true false
        if (e.target.classList.contains('bi-trash')) {
            const id = e.target.parentNode.parentNode.dataset.id;
            // console.log(id);
            //调用删除功能函数接口
            delStudent(id);
        }
        //如果点击了编辑，调用对应函数
        if (e.target.classList.contains('bi-pen')) {
            const id = e.target.parentNode.parentNode.dataset.id;
            //编辑业务函数
            editStudent(id);
        }
    })
    //删除数据的函数
async function delStudent(id) {
    //console.log(id);
    //发起删除的请求
    await axios.delete(`/students/${id}`);
    //删除数据成功后，重新渲染页面
    getData();
};
//编辑业务----------------
async function editStudent(id) {
    //根据学员id查询详细信息
    const res = await axios.get(`/students/${id}`);
    console.log(res);
    //修改标题
    document.querySelector('.modal-title').innerText = '修改学员';
    //设置输入框（姓名、年龄、组号、期望薪资、就业薪资）
    //属性名的数组
    const keyArr = ['name', 'age', 'group', 'hope_salary', 'salary'];
    keyArr.forEach(key => {
            document.querySelector(`[name=${key}]`).value = res.data[key];

        })
        //设置性别(0男1女)
    const { gender } = res.data;
    const chks = document.querySelectorAll('[name=gender]'); //伪数组[‘男标签元素’，‘女标签元素’]
    chks[gender].checked = true; //单选按钮选中状态使用，对象.checked设置
    //设置籍贯-省 市 区县 的数据回显
    const { province, city, area } = res.data;
    //设置省
    proSelect.value = province
        //设置市
    const cityRes = await axios.get(`/api/city`, {
        params: { pname: province }
    });
    const cityHtml = cityRes.list.map(v => {
        return `<option value="${v}">${v}</option>`;

    }).join('');
    citySelect.innerHTML = `<option value="">--城市--</option>${cityHtml}`;
    citySelect.value = city;
    //设置区县
    const areaRes = await axios.get('/api/area', {
        params: {
            pname: province,
            cname: city
        }
    });
    const areaHtml = areaRes.list.map(v => {
        return `<option value="${v}">${v}</option>`;
    }).join('');
    areaSelect.innerHTML = `<option value="">--地区--</option>${areaHtml}`;
    areaSelect.value = area;
    modal.show(); //点击编辑按钮，让模态框显示
    //
    modalDom.dataset.id = id;

}
//抽取函数--保存修改
async function saveEdit() {
    //console.log('修改');
    //收集修改之后的数据
    const form = document.querySelector('#form');
    const data = serialize(form, { hash: true, empty: true });
    //console.log(data);
    //拿到表单修改之后的新值
    data.age = +data.age;
    data.gender = +data.gender;
    data.hope_salary = +data.hope_salary;
    data.salary = +data.salary;
    data.group = +data.group;
    // console.log(data);
    try {
        //修改成功
        const saveRes = await axios.put(`/students/${modalDom.dataset.id}`, data);
        showToast(saveRes.message);
        getData(); //修改成功后渲染页面
    } catch (error) {
        console.log(error.response.data.message); //修改失败的轻提示
    }
    modal.hide(); //无论修改成功与否，都要隐藏模态框

}