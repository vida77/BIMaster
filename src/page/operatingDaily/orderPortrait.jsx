
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

class Portrait extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            title: '订单画像',
            total: 10,
            pageSize: 10,
            current: 1,
            load: true,
            dayNum: 10,
            tableData: [],
            selectValue: '',
            carCombine: { //其他车型 当前展示车型取非
                0: [],
                1: [37],
                2: [2],
                3: [3],
                4: [5],
                5: [78]
            },
            carTypes: { //车型
                0: '全部',
                1: '易达',
                2: '舒适',
                3: '豪华',
                4: '商务',
                5: '出租车'
            },
            city: '',
            start_at: '',
            end_at: '',
            car_type_id: '',
            searchParams: {},
            tableHeader: [
                {
                    title: '日期', dataIndex: 'start_time', key: 'start_time',  width: '100px'
                },
                {
                    title: '订单概览',
                    children: [
                        {title: '创建订单数', dataIndex: 'total_of_orders', key: 'total_of_orders'},
                        {title: '派发订单数', dataIndex: 'total_of_dispatch_orders', key: 'total_of_dispatch_orders'},
                        {title: '主动决策订单数', dataIndex: 'total_of_active_decision_orders', key: 'total_of_active_decision_orders'},
                        {title: '完成服务订单数', dataIndex: 'total_of_dispatch_intraday_finished_orders', key: 'total_of_dispatch_intraday_finished_orders'}
                    ]
                },
                {
                    title: '接单',
                    children: [
                        {title: '单均派单司机数', dataIndex: 'total_of_average_dispatch', key: 'total_of_average_dispatch'},
                        {title: '单均响应司机数', dataIndex: 'order_avg_response', key: 'order_avg_response'},
                    ]
                },
                {
                    title: '空驶',
                    children: [
                        {title: '平均距离(km)', dataIndex: 'kongshi_average_distance', key: 'kongshi_average_distance'},
                        {title: '平均时长(h)', dataIndex: 'kongshi_average_time', key: 'kongshi_average_time'}
                    ]
                },
                {
                    title: '服务',
                    children: [
                        {title: '平均距离(km)', dataIndex: 'order_average_distance', key: 'order_average_distance'},
                        {title: '平均时长(h)', dataIndex: 'order_average_time', key: 'order_average_time'}
                    ]
                },
                {
                    title: '打表',
                    children: [
                        {title: '打表接单数', dataIndex: 'total_of_bymeter_orders', key: 'total_of_bymeter_orders'},
                        {title: '打表接单占比(%)', dataIndex: 'rate_of_bymeter_order', key: 'rate_of_bymeter_order'},
                        {title: '单均金额', dataIndex: 'average_amount_of_bymeter_order', key: 'average_amount_of_bymeter_order'}
                    ]
                }
            ],
            exportParams: {},
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
            load:true
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
        this.setState({
            exportParams: exportParams
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
            total: this.getTotalPage()
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
    onShowSizeChange(current, size) {
        this.setState({
            pageSize: size,
            current: current,
            load: true
        }, () => {
            this.getTableData();
        });
    }
    // 获取表格数据
    getTableData() {
        let arrStr = ['start_time', 'rate_of_bymeter_order'];
        let searchParams = this.getParams();
        let searchParam = Object.assign(searchParams,this.state.checkedParam);
        let result =getFun('/web_api/operation/portrait',  searchParam);
        result.then(res => {
            this.setState({
                load: false,
                tableData: objectToArr(res.data, arrStr)

            },() => this.initExportData())
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
        let {title, carTypes, load, tableHeader, total, pageSize, collapseFlag} = this.state;
        const radioChildren = Object.keys(carTypes).map((key, index) => {
            return <RadioButton key={key} value={key}>{carTypes[key]}</RadioButton>
        });
        let tableData = milliFormat(this.state.tableData);
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
                    <div className="tableWrap">
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
                </div>
            </div>
        )
    }
}
export default Portrait;