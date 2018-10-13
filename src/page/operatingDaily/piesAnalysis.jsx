
import React from 'react';
import {Card, Table, Radio, Row, Col, Button, Pagination, Icon} from 'antd';
import moment from 'moment';
import SearchBox from '../../components/searchBox/searchBox'
import SearchCheckBox from '../../components/searchBox/searchCheckBox'
import ExportFileCom from '../../components/exportFile/exportFile'

import {getFun} from '../../utils/api'
import {objectToArr, dateDiff, milliFormat} from '../../utils/dataHandle'
import './operating.less'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class PiesAnalysis extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            title: '派单分析',
            total: 10,
            pageSize: 10,
            current: 1,
            load: true,
            total2: 10, //table2
            pageSize2: 10,
            current2: 1,
            load2: true,
            dayNum: 10,
            tableData: [],
            tableData2: [],
            selectValue: '',
            carCombine: { //其他车型 当前展示车型取非
                0: [],
                1: [37],
                2: [2],
                3: [3],
                4: [5],
                5: [78],
                6: [999]
            },
            carTypes: { //车型
                0: '全部',
                1: '易达',
                2: '舒适',
                3: '豪华',
                4: '商务',
                5: '出租车',
                6: '其他'
            },
            city: '',
            start_at: '',
            end_at: '',
            car_type_id: '',
            searchParams: {},
            tableHeader: [
                {
                    title: '日期', dataIndex: 'start_time', key: 'start_time', fixed: 'left', width:100
                },
                {
                    title: '下单量', dataIndex: 'total_of_orders', key: 'total_of_orders'
                },
                {
                    title: '派单',
                    children: [
                        {title: '有车接单', dataIndex: 'total_of_dispatch_orders', key: 'total_of_dispatch_orders'},
                        {title: '有车无人接', dataIndex: 'dispatch_no_driver_accept', key: 'dispatch_no_driver_accept'},
                        {title: '无车可派', dataIndex: 'no_car_can_dispatch', key: 'no_car_can_dispatch'},
                        {title: '主动取消', dataIndex: 'dispatch_user_active_cancel', key: 'dispatch_user_active_cancel'}
                    ]
                },
                {
                    title: '决策',
                    children: [
                        {title: '主动选择', dataIndex: 'total_of_active_decision_orders', key: 'total_of_active_decision_orders'},
                        {title: '主动取消', dataIndex: 'dispatch_decision_active_cancel', key: 'dispatch_decision_active_cancel'},
                        {title: '超时取消', dataIndex: 'dispatch_decision_timeout_cancel', key: 'dispatch_decision_timeout_cancel'}
                    ]
                },
                {
                    title: '服务',
                    children: [
                        {title: '当日完成', dataIndex: 'total_of_dispatch_intraday_finished_orders', key: 'total_of_dispatch_intraday_finished_orders'},
                        {title: '等待服务', dataIndex: 'dispatch_service_waiting_service', key: 'dispatch_service_waiting_service'},
                        {title: '主动取消', dataIndex: 'dispatch_service_active_cancel', key: 'dispatch_service_active_cancel'}                
                    ]
                }
            ],
            tableHeader2: [
                {
                    title: '日期', dataIndex: 'start_time', key: 'start_time', fixed: 'left', width:100
                },
                {
                    title: '下单量', dataIndex: 'total_of_orders', key: 'total_of_orders'
                },
                {
                    title: '派单主动取消率 (%)', dataIndex: '090aa7a1081eae3e00f953673afb1069e5549c41', key: '090aa7a1081eae3e00f953673afb1069e5549c41'
                },
                {
                    title: '无车可派率 (%)', dataIndex: 'b2df6486564713dd039ba8307243125beacaa349', key: 'b2df6486564713dd039ba8307243125beacaa349'
                },
                {
                    title: '有车无人接率 (%)', dataIndex: '289700f36a6cef914317fe5b7a80887f772d1c0f', key: '289700f36a6cef914317fe5b7a80887f772d1c0f'
                },
                {
                    title: '有车接单率 (%)', dataIndex: '57eee1c58741ab96b403f9297827a535d87f82ab', key: '57eee1c58741ab96b403f9297827a535d87f82ab'
                },
                {
                    title: '决策主动取消率 (%)', dataIndex: '1c69e5b66e623f037bf7a08b5e408d1c026d2f31', key: '1c69e5b66e623f037bf7a08b5e408d1c026d2f31'
                },
                {
                    title: '主动选择率 (%)', dataIndex: '8bbfc1d8b42d8ece718eb1b016c5f4bc2547e3be', key: '8bbfc1d8b42d8ece718eb1b016c5f4bc2547e3be'
                },
                {
                    title: '超时取消率 (%)', dataIndex: 'fffd51e61cb9a6c6c55e60a6475abc4f2ff49a66', key: 'fffd51e61cb9a6c6c55e60a6475abc4f2ff49a66'
                },
                {
                    title: '服务主动取消率 (%)', dataIndex: 'bb15937f59a372fd139c2e0abaf9cc1762517d19', key: 'bb15937f59a372fd139c2e0abaf9cc1762517d19'
                },
                {
                    title: '服务完成率 (%)', dataIndex: '61a889b74f7ada2a9b3cc0fc718c95bfd374616a', key: '61a889b74f7ada2a9b3cc0fc718c95bfd374616a'
                }
            ],
            exportParams: {},
            exportParams2: {},
            flag: false,
            collapseFlag: true,
            checkedParam: {}
        }
    }
    componentWillMount() {
        this.initDateRange(this.state.dayNum);//初始化查询日期
        let city = this.getCityParams();
        this.setState({
            city: city
        })
    }
    componentDidMount(){
        this.setState({
            load:true,
            load2:true
        },() => {
            this.getTableData();
        })
    }
    //初始化查询起止日期
    initDateRange(rangeDays) {
        //时间类型为moment格式
        const  endTime= moment().subtract(1, 'days');//当前时间
        const startTime = moment().subtract(rangeDays, 'days');//当前时间
        const start = new Date((moment(startTime).subtract())._d);
        const end = new Date((moment(endTime).subtract())._d);
        this.setState({
            city: this.state.city,
            start_at: this.formatDate(start),
            end_at: this.formatDate(end), //当前时间减n天
            car_type_id: ''
        });
    }
    // 初始化导出所需数据
    initExportData() {
        const exportParams = {
            start_at: this.state.start_at,
            end_at: this.state.end_at,
            title: this.state.title,
            city: this.state.city,
            car_type_id: this.state.car_type_id,
            tableHeader: this.state.tableHeader,
            exportData: this.state.tableData
        }
        // table2
        const exportParams2 = {
            start_at: this.state.start_at,
            end_at: this.state.end_at,
            title: this.state.title,
            city: this.state.city,
            car_type_id: this.state.car_type_id,
            tableHeader: this.state.tableHeader2,
            exportData: this.state.tableData2
        }
        this.setState({
            exportParams: exportParams,
            exportParams2: exportParams2
        })
    }
    // 时间格式转化
    formatDate (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };
    // 获取下拉框和日期参数
    searchParams(params){

        this.setState({
            city: params.city,
            start_at: params.selectedStartDate,
            end_at: params.selectedEndDate,
            flag: true
        })
    }
    // 获取车型参数
    carTypeChange(e) {
        let index = e.target.value;
        this.setState({
            car_type_id: this.state.carCombine[index].join(',')
        })
    }
    // 获取订单类型、下单时间、预估里程参数
    checkedBoxParams(params){
        this.setState({
            checkedParam: params
        })
    }
    // 点击查询
    searchBtn() {
        this.setState({
            load: true,
            total: this.getTotalPage(),
            load2: true,
            total2: this.getTotalPage()
        },() => {
            this.getTableData()
        })
    }
    // 获取当前页数
    pageChange(page, pageSize) {
        this.setState({
            current: page,
            pageSize: pageSize,
            load: true
        },() => {
            this.getTableData()
        })
    }
    // 获取当前页数-table2
    pageChange2(page, pageSize) {
        this.setState({
            current2: page,
            pageSize2: pageSize,
            load2: true
        },() => {
            this.getTableData()
        })
    }
    onShowSizeChange(current, size) {
        this.setState({
            pageSize: size,
            current: current,
            load: true
        }, () => {
            this.getTableData();
        });
    }
    onShowSizeChange2(current, size) {
        this.setState({
            pageSize2: size,
            current2: current,
            load2: true
        }, () => {
            this.getTableData();
        });
    }
    // 获取表格数据
    getTableData() {
        let arrStr = ['start_time', 'rate_of_dispatch_descision', 'rate_of_dispatch_intraday_finished_order', 'rate_of_finished_order', 'rate_of_dispatch_success'];
        let searchParams = this.getParams();
        let searchParam = Object.assign(searchParams,this.state.checkedParam);
        let result =getFun('/web_api/operation/dispatch',  searchParam);
        result.then(res => {
            this.setState({
                load: false,
                load2: false,
                tableData: objectToArr(res.data1, arrStr),
                tableData2: objectToArr(res.data2, arrStr)
            }, () => {this.initExportData()})
        }).catch(err => {
            console.log(err)
        })
    }
    // 获取接口参数
    getParams() {
        let start, end;
        start = this.pageStartDate();
        end = this.pageEndDate().format("YYYY-MM-DD");
        const params = {
            start_at: start,
            end_at: end,
            city: this.state.flag?this.state.city:this.getCityParams(),
            car_type_id: this.state.car_type_id
        }
        return params;
    }
    getCityParams(){
        let auth = JSON.parse(localStorage.getItem("auth"));
        let arr = Object.keys(auth);

        let path = document.location.toString();
        let pathUrl = path.split('#');
        let url = pathUrl[1].split('/');
        let str = url[url.length - 1];
        let city = "";
        // let auth = JSON.parse(localStorage.getItem("auth"));
        if(auth){
            let cityObj = auth;
            Object.keys(cityObj).map(item => {
                if(item.indexOf(str) > 0 ){
                    let cityArr = cityObj[item].city;
                    if(cityArr[0] == 'all' || arr.indexOf("-1") > -1){
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
    // getCityParams(){
    //     let path = document.location.toString();
    //     let pathUrl = path.split('#');
    //     let url = pathUrl[1].split('/');
    //     let str = url[url.length - 1];
    //     let city = "";
    //     let auth = JSON.parse(localStorage.getItem("auth"));
    //     if(auth){
    //         let cityObj = auth;
    //         Object.keys(cityObj).map(item => {
    //             if(item.indexOf(str) > 0 ){
    //                 let cityArr = cityObj[item].city;
    //                 if(cityArr[0] == 'all'){
    //                     city = '';
    //                 }else {
    //                     city = cityArr.join(",")
    //                 }
    //                 // city = cityArr[cityArr.length - 1]
    //             }
    //         })
    //     }
    //     return city;
    // }
    //分页查询的结束时间
    pageEndDate() {
        let days = (this.state.current - 1) * this.state.pageSize;
        let copy = moment(this.state.end_at).add(0, 'days'); //复制结束日期的副本
        return  copy.subtract(days, 'days');
    }

    //分页查询的开始时间
    pageStartDate() {
        let days = this.state.current * this.state.pageSize;
        let copy, dt;
        copy = moment(this.state.end_at); //复制结束日期的副本
        copy = copy.add(1, 'days'); //查日期为当前结束日期+1天
        dt = copy.subtract(days, 'days');
        let bb = dt.format("YYYY-MM-DD");
        if(this.state.start_at && bb < this.state.start_at) {
            return this.state.start_at;
        }else {
            return bb;
        }
    }
    getTotalPage() {
        let day = dateDiff(this.state.start_at, this.state.end_at);
        return day;
    }
    collapseClick(){
        this.setState({
            collapseFlag: !this.state.collapseFlag
        })
    }
    render() {
        let {title, carTypes, load, load2, tableHeader, tableHeader2, total, pageSize, total2, pageSize2,collapseFlag} = this.state;
        const radioChildren = Object.keys(carTypes).map((key, index) => {
            return <RadioButton key={key} value={key}>{carTypes[key]}</RadioButton>
        });
        let tableData = milliFormat(this.state.tableData);
        let tableData2 = milliFormat(this.state.tableData2);
        return (
            <div>
                <div className="operating-wrapper">
                    <h3 className="cardTitle">{title}</h3>
                    <Card bordered={false}>
                        <div className="search-content">
                            <div className="search-wrapper">
                                <div>
                                    <SearchBox searchParams={params => this.searchParams(params)}></SearchBox>
                                </div>
                                <div className={collapseFlag?"collapse-search":""}>
                                    <SearchCheckBox checkedBoxParams={params => this.checkedBoxParams(params)}></SearchCheckBox>
                                    <div className="cartype-wrapper">
                                        <label className="cartype-label">车型：</label>
                                        <RadioGroup onChange={this.carTypeChange.bind(this)} defaultValue='0' >
                                            {radioChildren}
                                        </RadioGroup>
                                        <p className="cartype-text">以订单车型筛选</p>
                                    </div>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary"  icon='search' onClick={this.searchBtn.bind(this)}>查询</Button>
                                <a className="collapse-text" onClick={this.collapseClick.bind(this)}>{collapseFlag?"展开":"收起"}<Icon type={collapseFlag?"down":"up"}></Icon></a>                            
                            </div>
                        </div>
                    </Card>
                    <h4 className="cardTitle">派单分析／数值</h4>
                    <div className="tableWrap" style={{marginBottom: 16}}>
                        <div>
                            <Table dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false} scroll={{x: '130%'}}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col span={10}>
                                    <ExportFileCom params={this.state.exportParams}></ExportFileCom>
                                </Col>
                                <Col span={14} style={{textAlign: 'right'}}>
                                    <Pagination current={this.state.current} total={total} onChange={this.pageChange.bind(this)} pageSize={pageSize}  showQuickJumper></Pagination>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <h4 className="cardTitle">派单分析／比率</h4>
                    <div className="tableWrap">
                        <div>
                            <Table dataSource={tableData2} bordered loading={load2} columns={tableHeader2} pagination={false} scroll={{x: '130%'}}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col span={10}>
                                    <ExportFileCom params={this.state.exportParams2}></ExportFileCom>
                                </Col>
                                <Col span={14} style={{textAlign: 'right'}}>
                                    <Pagination current={this.state.current2} total={total2} onChange={this.pageChange2.bind(this)} pageSize={pageSize2}  showQuickJumper></Pagination>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default PiesAnalysis;