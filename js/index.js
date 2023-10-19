// 判断
checklogin()
    //调用渲染用户名函数
renderUsername()

//调用退出函数
registerLogout()
    //首页-统计数据
async function getData() {
    const token = localStorage.getItem('token')
        //调用接口
    const res = await axios({
        url: '/dashboard',
        //请求中携带token,不携带不能访问接口
        //  headers: {
        //      Authorization: token
        //   }
    })
    console.log(res);
    //const overview = res.data.overview;
    //console.log(overview)
    const { groupData, overview, salaryData, provinceData, year } = res.data;
    //渲染数据
    renderOverview(overview)
        //渲染年薪资走势(折线图)
    renderYearSalary(year)
        //渲染薪资分布函数(饼图)
    renderSalary(salaryData)
        //每组薪资函数所需的数据(柱状图)
    renderGroupSalary(groupData)
        //渲染男女薪资(两个饼图)
    renderGenderSalary(salaryData)
        // 籍贯分布（地图）
    renderProvince(provinceData)




}
getData()

//渲染数据函数
function renderOverview(overview) {
    Object.keys(overview).forEach(key => {
        // document.querySelector(`.${key}`) 是页面中标签元素
        //overview[key] 是 overview对象的属性值
        document.querySelector(`.${key}`).innerText = overview[key]
    })
}
// 渲染薪资走势(折线图)
function renderYearSalary(year) {
    //console.log(year);
    //初始化echarts对象
    const dom = document.querySelector('#line')
    const myChart = echarts.init(dom)
        // 定义配置项
    const option = {
        // 标题
        title: {
            text: '2022年薪资走势',
            left: '12',
            top: '15'
        },
        // 绘图网格
        grid: {
            top: '20%'
        },
        xAxis: {
            // 坐标轴的线样式
            axisLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#ccc'
                }
            },
            type: 'category',
            data: year.map(v => v.month)
        },
        yAxis: {
            type: 'value',
            //   调整分割线
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        toolp: {},
        series: [{
            data: year.map(v => v.salary),
            type: 'line',
            // 平滑曲线
            smooth: true,
            // 填充区域颜色
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'skyblue' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#e8f3fd' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            // 标记点的大小
            symbolSize: 10,
            // 线条样式
            lineStyle: {
                width: 7,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [{
                        offset: 0,
                        color: 'red' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: 'yellow' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            }
        }]
    };
    //让配置生效
    myChart.setOption(option);
}
//渲染薪资分布函数(饼图)
function renderSalary(salaryData) {

    console.log();
    //初始化一个echarts对象
    const dom = document.querySelector('#salary')
    const myChart = echarts.init(dom)
        //定义属性和配置
    const option = {
        //标题
        title: {
            text: '班级薪资分布',
            lef: 10,
            top: 5

        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center'
        },
        series: [{
            name: '班级薪资分布',
            type: 'pie',
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                //半径
                borderRadius: 15,
                borderColor: '#fff',
                //粗细
                borderWidth: 2
            },
            label: {
                show: false,
            },
            labelLine: {
                show: false
            },
            color: ['#fda224', '#5097ff', '#3abcfa', 'hotpink'],
            data: salaryData.map(v => {
                return { value: v.g_count + v.b_count, name: v.label }
            })
        }]
    };
    //让配置生效
    myChart.setOption(option);
}
//渲染每组薪资函数(柱状图)
function renderGroupSalary(groupData) {
    //初始化一个echarts对象
    const dom = document.querySelector('#lines');
    const myChart = echarts.init(dom);
    //定义选项和数据
    const option = {
        tooltip: {},
        grid: {
            left: 70,
            top: 30,
            right: 30,
            bottom: 50

        },
        xAxis: {
            type: 'category',
            //页面一打开，默认渲染第一组
            data: groupData[1].map(v => v.name),
            //线类型 颜色 文字颜色
            axisLine: {
                lineStyle: {
                    color: '#ccc',
                    type: 'dashed'
                }
            },
        },
        yAxis: {
            type: 'value',
            //分割线 虚线
            splitLine: {
                lineStyle: {
                    type: 'dashed'

                }
            }
        },
        series: [{
                //series中设置多个图形，就会渲染多个图形
                name: '期望薪资',
                type: 'bar',
                barWidth: '30%',
                //柱状图样式
                itemStyle: {
                    //柱状图颜色
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'yellow' //0%处的颜色
                        }, {
                            offset: 1,
                            color: 'orange' //100%处的颜色
                        }],
                        glodal: false //缺省为
                    }

                },
                data: groupData[1].map(v => v.hope_salary)
            },
            {
                name: '就业薪资',
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    //柱状图颜色
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'blue' //0%处的颜色
                        }, {
                            offset: 1,
                            color: 'Skyblue' //100%处的颜色
                        }],
                        glodal: false //缺省为
                    }

                },
                data: groupData[1].map(v => v.hope_salary)
            }
        ]
    };

    myChart.setOption(option);
    //高亮效果
    const btns = document.querySelector('#btns');
    //绑定事件
    btns.addEventListener('click', (e) => {
        // console.log(event.target);//目标元素
        //constains此方法判断某元素是否包含某类名
        if (e.target.classList.contains('btn')) {
            //把带有此类名的，去掉
            btns.querySelector('.btn-blue').classList.remove('btn-blue');
            //让我点击的哪一个加上此类名
            e.target.classList.add('btn-blue');
            //点击同时，数据也要换
            const index = e.target.innerText;
            //console.log(index);点击谁，拿到谁的标记号
            const data = groupData[index];
            console.log(data);
            option.xAxis.data = data.map(v => v.name);
            option.series[0].data = data.map(v => v.hope_salary)
            option.series[1].data = data.map(v => v.salary)
                //更改了配置项，记得从新渲染
            myChart.setOption(option);
        }
    })
}
//渲染男女薪资(两个饼图)
// 渲染男女薪资分布函数 
function renderGenderSalary(salaryData) {
    console.log(salaryData);
    // 初始化一个实例对象
    const dom = document.querySelector('#gender')
    const myChart = echarts.init(dom);
    // 定义配置项和数据
    const option = {
        // 标题，可以添加多个
        title: [{
                text: '男女薪资发布',
                left: 10,
                top: 10,
                textStyle: {
                    fontSize: 16
                }
            },
            {
                text: '男生',
                left: '50%',
                top: '45%',
                textStyle: {
                    fontSize: 12
                },
                textAlign: 'center'
            },
            {
                text: '女生',
                left: '50%',
                top: '85%',
                textStyle: {
                    fontSize: 12
                },
                textAlign: 'center'
            },


        ],
        tooltip: {
            trigger: 'item'
        },
        color: ['deeppink', 'aque', 'yellow', 'skyblue'],

        series: [{
                type: 'pie',
                radius: ['20%', '30%'],
                center: ['50%', '30%'],
                data: salaryData.map(v => {
                    return { value: v.b_count, name: v.label }
                })
            },
            {
                type: 'pie',
                radius: ['20%', '30%'],
                center: ['50%', '70%'],
                data: salaryData.map(v => {
                    return { value: v.b_count, name: v.label }
                })
            }
        ]
    };
    // 让配置项生效
    myChart.setOption(option);
}

//  地图： 需要依赖于地图插件 china (地图)
// 需要找社区
// 渲染籍贯分布（地图）
function renderProvince(provinceData) {
    // console.log(provinceData)
    const dom = document.querySelector('#map')
    const myEchart = echarts.init(dom)
    const dataList = [
        { name: '南海诸岛', value: 0 },
        { name: '北京', value: 0 },
        { name: '天津', value: 0 },
        { name: '上海', value: 0 },
        { name: '重庆', value: 0 },
        { name: '河北', value: 0 },
        { name: '河南', value: 0 },
        { name: '云南', value: 0 },
        { name: '辽宁', value: 0 },
        { name: '黑龙江', value: 0 },
        { name: '湖南', value: 0 },
        { name: '安徽', value: 0 },
        { name: '山东', value: 0 },
        { name: '新疆', value: 0 },
        { name: '江苏', value: 0 },
        { name: '浙江', value: 0 },
        { name: '江西', value: 0 },
        { name: '湖北', value: 0 },
        { name: '广西', value: 0 },
        { name: '甘肃', value: 0 },
        { name: '山西', value: 0 },
        { name: '内蒙古', value: 0 },
        { name: '陕西', value: 0 },
        { name: '吉林', value: 0 },
        { name: '福建', value: 0 },
        { name: '贵州', value: 0 },
        { name: '广东', value: 0 },
        { name: '青海', value: 0 },
        { name: '西藏', value: 0 },
        { name: '四川', value: 0 },
        { name: '宁夏', value: 0 },
        { name: '海南', value: 0 },
        { name: '台湾', value: 0 },
        { name: '香港', value: 0 },
        { name: '澳门', value: 0 },
    ]

    // 筛选数据
    dataList.forEach(item => {
            const res = provinceData.find(v => {
                    return v.name.includes(item.name)
                })
                // console.log(res)
                // 数据赋值
            if (res !== undefined) {
                item.value = res.value
            }
        })
        // console.log(dataList)

    const option = {
        title: {
            text: '籍贯分布',
            top: 10,
            left: 10,
            textStyle: {
                fontSize: 16,
            },
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} 位学员',
            borderColor: 'transparent',
            backgroundColor: 'rgba(0,0,0,0.5)',
            textStyle: {
                color: '#fff',
            },
        },
        visualMap: {
            min: 0,
            max: 6,
            left: 'left',
            bottom: '20',
            text: ['6', '0'],
            inRange: {
                color: ['#ffffff', '#0075F0'],
            },
            show: true,
            left: 40,
        },
        geo: {
            map: 'china',
            roam: false,
            zoom: 1.0,
            label: {
                normal: {
                    show: true,
                    fontSize: '10',
                    color: 'rgba(0,0,0,0.7)',
                },
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                    color: '#e0ffff',
                },
                emphasis: {
                    areaColor: '#34D39A',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
        series: [{
            name: '籍贯分布',
            type: 'map',
            geoIndex: 0,
            data: dataList,
        }, ],
    }
    myEchart.setOption(option)
}