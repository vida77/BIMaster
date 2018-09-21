import React from 'react'
import {Tabs, Card, Radio, Icon,Table, Row, Col, Button, Pagination, Modal} from 'antd';
import CitySelect from '../../components/searchBox/citySelect'
import FunnelChart from '../../components/chart/overviewData'
import LineBarChart from '../../components/chart/overviewData/lineBarChart'
import CumulateBarChart from '../../components/chart/overviewData/cumulateBarChart'
import DateBox from '../../components/searchBox/dateBox'

import {getFun} from '../../utils/api'
import {objectToArr, dateDiff, milliFormat} from '../../utils/dataHandle'

import './overviewData.less'

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export  default class overviewData extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            dateType: ['0','0','0','0'],
            dateType0: '0',
            dateType1: '0',
            dateType2: '0',
            dateType3: '0',
            dateTypeModal: '0',
            activeKey: "1",
            activeKey0: "1",
            activeKey1: "1",
            activeKey2: "1",
            activeKey3: "1",
            activeKey4: "1",
            activeKey5: "1",
            chartInform0: [],
            chartInform1: [],
            chartInform2: [],
            chartInform3: [],
            chartData0: {},
            chartData1: {},
            chartData2: {},
            chartData3: {},
            dateTypes: {
                0: "日",
                1: "周",
            },
            dateTypeNum: {
                0: 0,
                1: 1,
            },
            // 漏斗图
            funnelchartData: 
            [
                {value: 60, name: '日均完成订单司机'},
                {value: 40, name: '日均中标司机'},
                {value: 20, name: '日均抢单司机'},
                {value: 80, name: '日均派单司机'},
                {value: 100, name: '日均有效在线司机'},
                {value: 140, name: '日均在线司机'}
            ],
            // 横向堆积图
            cumulateBarData:[
                {"create_order":500},
                {"zdqx":120,"ycjd":120,"ycwrj":120,"wckj":100,},
                {"zdqx":120,"zdxz":110,"csxz":80,},
                {"zdqx":90,"drwc":100,"ddfw":70,},
            ],
            // 柱图／折线图
            chartInform: [
                {name: '创建订单量', type: 'bar', filedName: 'a'},
                {name: '有车接单量', type: 'bar', filedName: 'b'},
                {name: '完成订单量', type: 'bar', filedName: 'c'},
                {name: '订单完成率', type: 'line', filedName: 'd'}
            ],
            chartData: {
                '09-03': {
                    'a': 100,
                    'b': 264,
                    'c': 39,
                    'd': 58,
                    'e': 180
                },
                '09-04': {
                    'a': 233,
                    'b': 142,
                    'c': 90,
                    'd': 350,
                    'e': 281
                },
                '09-05': {
                    'a': 190,
                    'b': 174,
                    'c': 68,
                    'd': 58,
                    'e': 180
                },
                '09-06': {
                    'a': 133,
                    'b': 132,
                    'c': 30,
                    'd': 350,
                    'e': 281
                },
                '09-07': {
                    'a': 100,
                    'b': 264,
                    'c': 39,
                    'd': 58,
                    'e': 180
                },
                '09-08': {
                    'a': 233,
                    'b': 142,
                    'c': 90,
                    'd': 350,
                    'e': 281
                },
                '09-09': {
                    'a': 190,
                    'b': 174,
                    'c': 68,
                    'd': 58,
                    'e': 180
                },
                '09-10': {
                    'a': 133,
                    'b': 132,
                    'c': 30,
                    'd': 350,
                    'e': 281
                }
            },
            xData:[],
            // 表格
            tableDataOrder: [],
            tableHeaderOrder: [
                {
                    title: '日期', dataIndex: 'start_time', key: 'start_time',  width: '100px'
                },
                {
                    title: '创建订单量', dataIndex: 'create_order_number', key: 'create_order_number'
                },
                {
                    title: '完成订单量', dataIndex: 'complete_order_number', key: 'complete_order_number'
                },
                {
                    title: '订单完成率', dataIndex: 'complete_order_radio', key: 'complete_order_radio'
                },
            ],
            // 组合表格
            tableHeaderL: [
                {
                    title: '指标', dataIndex: 'name', key: 'name',  width: '138px'
                },
                {
                    title: '数量', dataIndex: 'value', key: 'value', width: '100px'
                }
            ],
            tableHeaderR: [
                {
                    title: '指标', dataIndex: 'name', key: 'name',  width: '138px'
                },
                {
                    title: '数量', dataIndex: 'value', key: 'value', width: '100px'
                }
            ],
            tableHeaderLL: [
                {
                    title: '指标', dataIndex: 'name', key: 'name',  width: '138px'
                },
                {
                    title: '数量', dataIndex: 'value', key: 'value', width: '100px'
                }
            ],
            tableDataLL: [],
            load: false,
            lineBarChartVisible: false,
            tableData: [],
            tableHeader: [],
            tableData0: [],
            tableHeader0: [
                {
                    title: '日期', dataIndex: 'time0', key: 'time0',  width: '78px', fixed: 'left'
                },
                {
                    title: '创建订单量',
                    children: [
                        {
                            title: '数量', dataIndex: 'cjddl', key: 'cjddl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'cjddlrhb', key: 'cjddlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'cjddlztb', key: 'cjddlztb'
                        },
                    ]
                },

                {
                    title: '完成订单量',
                    children: [
                        {
                            title: '数量', dataIndex: 'wcdl', key: 'wcdl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'wcddlrhb', key: 'wcddlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'wcddlztb', key: 'wcddlztb'
                        },
                    ]
                },
                {
                    title: '订单完成率',
                    children: [
                        {
                            title: '数量', dataIndex: 'ddwcl', key: 'ddwcl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'ddwclrhb', key: 'ddwclrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'ddwclztb', key: 'ddwclztb'
                        },
                    ]
                }
            ],
            tableData1: [],
            tableHeader1: [
                {
                    title: '日期', dataIndex: 'time1', key: 'time1',  width: '138px',fixed: 'left'
                },
                {
                    title: '抽佣比例',
                    children: [
                        {
                            title: '数量', dataIndex: 'cybl', key: 'cybl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'cyblrhb', key: 'cyblrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'cyblztb', key: 'cyblztb'
                        },
                    ]
                },
                {
                    title: 'B端补贴',
                    children: [
                        {
                            title: '数量', dataIndex: 'bdbt', key: 'bdbt'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'bdbtrhb', key: 'bdbtrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'bdbtztb', key: 'bdbtztb'
                        },
                    ]
                },
                {
                    title: 'C端补贴',
                    children: [
                        {
                            title: '数量', dataIndex: 'cdbt', key: 'cdbt'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'cdbtrhb', key: 'cdbtrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'cdbtztb', key: 'cdbtztb'
                        },
                    ]
                },
                {
                    title: '毛利率',
                    children: [
                        {
                            title: '数量', dataIndex: 'mll', key: 'mll'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'mllrhb', key: 'mllrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'mllztb', key: 'mllztb'
                        }
                    ]
                },
            ],
            tableData2: [],
            tableHeader2: [
                {
                    title: '日期', dataIndex: 'time2', key: 'time2',  width: '138px',fixed: 'left'
                },
                {
                    title: '有效在线司机量',
                    children: [
                        {
                            title: '数量', dataIndex: 'yxzxsjl', key: 'yxzxsjl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'yxzxsjlrhb', key: 'yxzxsjlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'yxzxsjlztb', key: 'yxzxsjlztb'
                        }
                    ]
                },
                {
                    title: '活跃司机量',
                    children: [
                        {
                            title: '数量', dataIndex: 'hysjl', key: 'hysjl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'hysjlrhb', key: 'hysjlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'hysjlztb', key: 'hysjlztb'
                        }
                    ]
                },
                {
                    title: '新司机量',
                    children: [
                        {
                            title: '数量', dataIndex: 'xsjl', key: 'xsjl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'xsjlrhb', key: 'xsjlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'xsjlztb', key: 'xsjlztb'
                        }
                    ]
                },
                {
                    title: '老司机量',
                    children: [
                        {
                            title: '数量', dataIndex: 'lsjl', key: 'lsjl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'lsjlrhb', key: 'lsjlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'lsjlztb', key: 'lsjlztb'
                        }
                    ]
                },
                {
                    title: '当日司机平均收入',
                    children: [
                        {
                            title: '数量', dataIndex: 'drsjpjsr', key: 'drsjpjsr'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'drsjpjsrrhb', key: 'drsjpjsrrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'drsjpjsrztb', key: 'drsjpjsrztb'
                        }
                    ]
                },
                {
                    title: '司机单均补贴',
                    children: [
                        {
                            title: '数量', dataIndex: 'sjdjbt', key: 'sjdjbt'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'sjdjbtrhb', key: 'sjdjbtrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'sjdjbtztb', key: 'sjdjbtztb'
                        }
                    ]
                },
                {
                    title: '平均计费时长',
                    children: [
                        {
                            title: '数量', dataIndex: 'pjjfsc', key: 'pjjfsc'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'pjjfscrhb', key: 'pjjfscrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'pjjfscztb', key: 'mllzpjjfscztbtb'
                        }
                    ]
                },
                {
                    title: '平均小时收入',
                    children: [
                        {
                            title: '数量', dataIndex: 'pjxssr', key: 'pjxssr'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'pjxssrrhb', key: 'mlpjxssrrhblrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'pjxssrztb', key: 'pjxssrztb'
                        }
                    ]
                }
            ],
            tableData3: [],
            tableHeader3: [
                {
                    title: '日期', dataIndex: 'time3', key: 'time3',  width: '138px',fixed: 'left'
                },
                {
                    title: '新用户量',
                    children: [
                        {
                            title: '数量', dataIndex: 'xyhl', key: 'xyhl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'xyhlrhb', key: 'xyhlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'xyhlztb', key: 'xyhlztb'
                        }
                    ]
                },
                {
                    title: '老用户量',
                    children: [
                        {
                            title: '数量', dataIndex: 'lyhl', key: 'lyhl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'lyhlrhb', key: 'lyhlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'lyhlztb', key: 'lyhlztb'
                        }
                    ]
                },
                {
                    title: '新用户下单量',
                    children: [
                        {
                            title: '数量', dataIndex: 'xyhxdl', key: 'xyhxdl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'xyhxdlrhb', key: 'xyhxdlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'xyhxdlztb', key: 'xyhxdlztb'
                        }
                    ]
                },
                {
                    title: '老用户下单量',
                    children: [
                        {
                            title: '数量', dataIndex: 'lyhxdl', key: 'lyhxdl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'lyhxdlrhb', key: 'lyhxdlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'lyhxdlztb', key: 'lyhxdlztb'
                        }
                    ]
                },
                {
                    title: '新用户订单完成率',
                    children: [
                        {
                            title: '数量', dataIndex: 'xyhddwcl', key: 'xyhddwcl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'xyhddwclrhb', key: 'xyhddwclrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'xyhddwclztb', key: 'xyhddwclztb'
                        }
                    ]
                },
                {
                    title: '老用户订单完成率',
                    children: [
                        {
                            title: '数量', dataIndex: 'lyhddwcl', key: 'lyhddwcl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'lyhddwclrhb', key: 'lyhddwclrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'lyhddwclztb', key: 'lyhddwclztb'
                        }
                    ]
                },
                {
                    title: '新用户补贴率',
                    children: [
                        {
                            title: '数量', dataIndex: 'xyhbtl', key: 'xyhbtl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'xyhbtlrhb', key: 'xyhbtlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'xyhbtlztb', key: 'xyhbtlztb'
                        }
                    ]
                },
                {
                    title: '老用户补贴率',
                    children: [
                        {
                            title: '数量', dataIndex: 'lyhbtl', key: 'lyhbtl'
                        },
                        {
                            title: '日环比(%)', dataIndex: 'lyhbtlrhb', key: 'lyhbtlrhb'
                        },
                        {
                            title: '周同比(%)', dataIndex: 'lyhbtlztb', key: 'lyhbtlztb'
                        }
                    ]
                }
            ],
            xScroll: '100%',
            cumulateBarChartVisible: false,
            funnelChartVisible: false
        }
    }
    componentWillMount() {
        //初始化折柱图数据
        this.setState({
            chartInform0: this.state.chartInform,
            chartInform1: this.state.chartInform,
            chartInform2: this.state.chartInform,
            chartInform3: this.state.chartInform,
            chartData0: this.state.chartData,
            chartData1: this.state.chartData,
            chartData2: this.state.chartData,
            chartData3: this.state.chartData
        })
    }
    componentDidMount(){
        
    }
    // 点击查询
    searchBtn() {
      
    }
    // 获取下拉框组件参数
    thisSearchParams(params){
        this.setState({
            city: params.city,
        })
    }
    getCityParams(){
        let path = document.location.toString();
        let pathUrl = path.split('#');
        let url = pathUrl[1].split('/');
        let str = url[url.length - 1];
        let city = "";
        let auth = JSON.parse(localStorage.getItem("auth"));
        if(auth){
            let cityObj = auth;
            Object.keys(cityObj).map(item => {
                if(item.indexOf(str) > 0 ){
                    let cityArr = cityObj[item].city;
                    if(cityArr[0] == 'all'){
                        city = '';
                    }else {
                        city = cityArr.join(",")
                    }
                    // city = cityArr[cityArr.length - 1]
                }
            })
        }
        return city;
    }
    // 周，月
    dateTypeChange(n, event){
        let index = event.target.value;
        let dateType = [];
        switch(n){
            case 0:
                this.setState({
                    dateType0: (this.state.dateTypeNum[index]).toString()
                })
                break;
            case 1:
                this.setState({
                    dateType1: (this.state.dateTypeNum[index]).toString()
                })
                break;
            case 2:
                this.setState({
                    dateType2: (this.state.dateTypeNum[index]).toString()
                })
                break;
            case 3:
                this.setState({
                    dateType3: (this.state.dateTypeNum[index]).toString()
                })
                break;
        }
        let params = {
            dateType: dateType,
        }
        //
    }
    // 点击放大按钮显示折柱图图表
    showBigChart(n, event){
        switch(n){
            case 0:
                this.setState({
                    dateTypeModal: this.state.dateType0,
                    activeKey: this.state.activeKey0,
                    chartData: this.state.chartData0,
                    tableData: this.state.tableData0,
                    tableHeader: this.state.tableHeader0,
                    lineBarChartVisible: true
                })
                break;
            case 1:
                this.setState({
                    dateTypeModal: this.state.dateType1,
                    activeKey: this.state.activeKey1,
                    chartData: this.state.chartData1,
                    tableData: this.state.tableData1,
                    tableHeader: this.state.tableHeader1,
                    lineBarChartVisible: true
                })
                break;
            case 2:
                this.setState({
                    dateTypeModal: this.state.dateType2,
                    activeKey: this.state.activeKey2,
                    chartData: this.state.chartData2,
                    tableData: this.state.tableData2,
                    tableHeader: this.state.tableHeader2,
                    xScroll: '300%',
                    lineBarChartVisible: true
                })
                break;
            case 3:
                this.setState({
                    dateTypeModal: this.state.dateType3,
                    activeKey: this.state.activeKey3,
                    chartData: this.state.chartData3,
                    tableData: this.state.tableData3,
                    tableHeader: this.state.tableHeader3,
                    xScroll: '300%',
                    lineBarChartVisible: true
                })
                break;
            case 4:
                this.setState({
                    activeKey: this.state.activeKey4,
                    cumulateBarChartVisible: true
                })
                break;
            case 5:
                this.setState({
                    activeKey: this.state.activeKey5,
                    funnelChartVisible: true
                })
                break;
        }
    }
    hideModal(){
        this.setState({
            lineBarChartVisible: false,
            cumulateBarChartVisible: false,
            funnelChartVisible: false
        })
    }
    tabClickHandle(n, activeKey){
        switch(n){
            case 0:
                this.setState({
                    activeKey0: activeKey
                })
                break;
            case 1:
                this.setState({
                    activeKey1: activeKey
                })
                break;
            case 2:
                this.setState({
                    activeKey2: activeKey
                })
                break;
            case 3:
                this.setState({
                    activeKey3: activeKey
                })
                break;
            case 4:
                this.setState({
                    activeKey4: activeKey
                })
                break;
            case 5:
                this.setState({
                    activeKey5: activeKey
                })
                break;
        }
    }
    tabClickHandleModal(activeKey){
        this.setState({
            activeKey: activeKey
        })
    }
    render(){
        const {dateTypes, load, tableHeaderL, tableHeaderR, tableHeaderLL, tableData0, tableHeader0, tableData,tableHeader,
            tableData1, tableHeader1, tableData2, tableHeader2, tableData3, tableHeader3} = this.state;
        const radioChildren = Object.keys(dateTypes).map(item => {
            return <RadioButton key={item} value={item}>{dateTypes[item]}</RadioButton>
        })
        let tableDataL = [
            {
            key: 'aa',
            name: '创建订单',
            value: 12345,
          },{
            key: 'bb',
            name: '主动取消（派单阶段）',
            value: 2345,
          },{
            key: 'cc',
            name: '有车接单',
            value: 345,
          },{
            key: 'dd',
            name: '有车无人接',
            value: 45,
          },{
            key: 'ee',
            name: '无车可接',
            value: 123,
          },{
            key: 'ff',
            name: '主动取消（决策阶段）',
            value: 234,
          },{
            key: 'gg',
            name: '主动选择',
            value: 34,
          },{
            key: 'hh',
            name: '超时取消',
            value: 23,
          }]
        let tableDataR = [
            {
            key: 'aa',
            name: '主动取消（服务阶段）',
            value: 12,
          },{
            key: 'bb',
            name: '当日完成',
            value: 115,
          },{
            key: 'cc',
            name: '等待服务',
            value: 55,
          }]
        let tableDataLL = [
            {
            key: 'aa',
            name: '日均在线司机量',
            value: 12,
            },{
            key: 'bb',
            name: '日均有效在线司机量',
            value: 115,
            },{
            key: 'cc',
            name: '日均派单司机',
            value: 55,
            },{
            key: 'dd',
            name: '日均抢单司机',
            value: 12,
            },{
            key: 'ee',
            name: '日均中标司机',
            value: 115,
            },{
            key: 'ff',
            name: '日均完成订单司机',
            value: 55,
            }
        ]
          // let tableDataOrder = [{
        //     key: 'aa',
        //     create_order_number: 1111,
        //     complete_order_number: 222,
        //     complete_order_radio: 33
        //     },{
        //     create_order_number: 1111,
        //     complete_order_number: 222,
        //     complete_order_radio: 33
        //     },{
        //     create_order_number: 1111,
        //     complete_order_number: 222,
        //     complete_order_radio: 33
        // }]
          return (
            <div className="overview-wrapper">
                <div className="">
                    <Card bordered={false}>
                        <div className="search-content">
                            <div className="search-wrapper">
                                <div>
                                    <CitySelect searchParams={params => this.thisSearchParams(params)}></CitySelect>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary"  icon='search' onClick={this.searchBtn.bind(this)}>查询</Button>
                            </div>
                        </div>
                    </Card>
                    <div className="contentWrap">
                        <div className="chartExcelWrap">
                            <div className="chartExcel chartExcelL">
                                <RadioGroup onChange={this.dateTypeChange.bind(this,0)}  defaultValue={this.state.dateType0} >
                                    {radioChildren}
                                </RadioGroup>
                                <Icon type="arrows-alt" theme="outlined" onClick={this.showBigChart.bind(this, 0)}/>
                                <Tabs defaultActiveKey="1" onChange={this.tabClickHandle.bind(this, 0)}>
                                    <TabPane tab="图" key="1">
                                        <LineBarChart title="订单数据" chartInform={this.state.chartInform0} chartData={this.state.chartData0}></LineBarChart>
                                    </TabPane>
                                    <TabPane tab="表" key="2">
                                        <Table className="tabTable" dataSource={tableData0} bordered loading={load} columns={tableHeader0} pagination={false} scroll={{x: '210%'}}/>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className="chartExcel chartExcelR">
                                <RadioGroup onChange={this.dateTypeChange.bind(this,1)}  defaultValue={this.state.dateType1} >
                                    {radioChildren}
                                </RadioGroup>
                                <Icon type="arrows-alt" theme="outlined" onClick={this.showBigChart.bind(this, 1)} />
                                <Tabs defaultActiveKey="1"  onChange={this.tabClickHandle.bind(this, 1)}>
                                    <TabPane tab="图" key="1">
                                        <LineBarChart title="流水数据" chartInform={this.state.chartInform1} chartData={this.state.chartData1}></LineBarChart>
                                    </TabPane>
                                    <TabPane tab="表" key="2">
                                        <Table className="tabTable" dataSource={tableData1} bordered loading={load} columns={tableHeader1} pagination={false} scroll={{x: '210%'}}/>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                        <div className="chartExcelWrap">
                            <div className="chartExcel chartExcelL">
                                <RadioGroup onChange={this.dateTypeChange.bind(this,2)}  defaultValue={this.state.dateType2} >
                                    {radioChildren}
                                </RadioGroup>
                                <Icon type="arrows-alt" theme="outlined" onClick={this.showBigChart.bind(this, 2)}  />
                                <Tabs defaultActiveKey="1"  onChange={this.tabClickHandle.bind(this, 2)}>
                                    <TabPane tab="图" key="1">
                                        <LineBarChart title="司机活跃度数据"  chartInform={this.state.chartInform2} chartData={this.state.chartData2}></LineBarChart>
                                    </TabPane>
                                    <TabPane tab="表" key="2">
                                        <Table className="tabTable" dataSource={tableData2} bordered loading={load} columns={tableHeader2} pagination={false} scroll={{x: '310%'}}/>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className="chartExcel chartExcelR">
                                <RadioGroup onChange={this.dateTypeChange.bind(this,3)}  defaultValue={this.state.dateType3} >
                                    {radioChildren}
                                </RadioGroup>
                                <Icon type="arrows-alt" theme="outlined" onClick={this.showBigChart.bind(this, 3)}  />
                                <Tabs defaultActiveKey="1"  onChange={this.tabClickHandle.bind(this, 3)}>
                                    <TabPane tab="图" key="1">
                                        <LineBarChart title="乘客数据"  chartInform={this.state.chartInform3} chartData={this.state.chartData3}></LineBarChart>
                                    </TabPane>
                                    <TabPane tab="表" key="2">
                                        <Table className="tabTable" dataSource={tableData3} bordered loading={load} columns={tableHeader3} pagination={false} scroll={{x: '310%'}}/>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                        <div className="chartExcelWrap">
                            <div className="chartExcel chartExcelL">
                                <DateBox searchParams={params => this.thisSearchParams(params)}/>
                                <Icon type="arrows-alt" theme="outlined"  onClick={this.showBigChart.bind(this, 4)}  />
                                <Tabs defaultActiveKey="1" onChange={this.tabClickHandle.bind(this, 4)}>
                                    <TabPane tab="图" key="1">
                                    <CumulateBarChart chartData={this.state.cumulateBarData}></CumulateBarChart>
                                    </TabPane>
                                    <TabPane tab="表" key="2">
                                        <Table dataSource={tableDataL} bordered loading={load} columns={tableHeaderL} pagination={false} style={{float:'left', width: '49%'}}></Table>
                                        <Table dataSource={tableDataR} bordered loading={load} columns={tableHeaderR} pagination={false} style={{float:'left', width: '49%'}}></Table>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <div className="chartExcel chartExcelR">
                                <DateBox searchParams={params => this.thisSearchParams(params)}/>
                                <Icon type="arrows-alt" theme="outlined"  onClick={this.showBigChart.bind(this, 5)}   />
                                <Tabs defaultActiveKey="1" onChange={this.tabClickHandle.bind(this, 5)} >
                                    <TabPane tab="图" key="1">
                                    <FunnelChart chartData={this.state.funnelchartData}></FunnelChart>
                                    </TabPane>
                                    <TabPane tab="表" key="2">
                                        <Table dataSource={tableDataLL} bordered loading={load} columns={tableHeaderLL} pagination={false} style={{float:'left', width: '98%'}}></Table>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    className="overview-wrapper"
                    visible={this.state.lineBarChartVisible}
                    onCancel={this.hideModal.bind(this)}
                    cancelText="关闭"
                    height='400'
                    width='800px'
                >
                    <div className="chart-modal-wrapper">
                        <div className="chartExcel chartExcelL">
                            <RadioGroup onChange={this.dateTypeChange.bind(this)}  defaultValue={this.state.dateTypeModal} value={this.state.dateTypeModal}>
                                {radioChildren}
                            </RadioGroup>
                            <Tabs defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} onChange={this.tabClickHandleModal.bind(this)}>
                                <TabPane tab="图" key="1">
                                    <LineBarChart chartInform={this.state.chartInform} chartData={this.state.chartData}></LineBarChart>
                                </TabPane>
                                <TabPane tab="表" key="2">
                                    <Table className="tabTable" dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false} scroll={{x: this.state.xScroll}}/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </Modal>
                <Modal
                    className="overview-wrapper"
                    visible={this.state.cumulateBarChartVisible}
                    onCancel={this.hideModal.bind(this)}
                    cancelText="关闭"
                    height='400'
                    width='800px'
                >
                    <div className="chart-modal-wrapper">
                        <div className="chartExcel chartExcelL">
                            <DateBox searchParams={params => this.thisSearchParams(params)}/>
                            <Tabs defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} onChange={this.tabClickHandleModal.bind(this)}>
                                <TabPane tab="图" key="1">
                                    <CumulateBarChart chartData={this.state.cumulateBarData}></CumulateBarChart>
                                </TabPane>
                                <TabPane tab="表" key="2">
                                    <Table dataSource={tableDataL} bordered loading={load} columns={tableHeaderL} pagination={false} style={{float:'left', width: '49%'}}></Table>
                                    <Table dataSource={tableDataR} bordered loading={load} columns={tableHeaderR} pagination={false} style={{float:'left', width: '49%'}}></Table>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </Modal>
                <Modal
                    className="overview-wrapper"
                    visible={this.state.funnelChartVisible}
                    onCancel={this.hideModal.bind(this)}
                    cancelText="关闭"
                    height='400'
                    width='800px'
                >
                    <div className="chart-modal-wrapper">
                        <div className="chartExcel chartExcelR">
                            <DateBox searchParams={params => this.thisSearchParams(params)}/>
                            <Tabs defaultActiveKey={this.state.activeKey} activeKey={this.state.activeKey} onChange={this.tabClickHandleModal.bind(this)}>
                                <TabPane tab="图" key="1">
                                    <FunnelChart chartData={this.state.funnelchartData}></FunnelChart>
                                </TabPane>
                                <TabPane tab="表" key="2">
                                    <Table dataSource={tableDataLL} bordered loading={load} columns={tableHeaderLL} pagination={false} style={{float:'left', width: '98%'}}></Table>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}