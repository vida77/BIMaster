

import React from 'react';
import {Card, Table, Radio, Row, Col, Button, Pagination} from 'antd';
import moment from 'moment';
import SearchBox from '../../components/searchBox/searchBox'
import ExportFileCom from '../../components/exportFile/exportFile'

import {getFun} from '../../utils/api'
import {objectToArr, dateDiff, milliFormat} from '../../utils/dataHandle'
import './operating.less'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class BargainingAnalysis extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            title: '议价分析',
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
                5: [78],
                6: [2,3,5,37,78]
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
                    title: '统计日期', dataIndex: 'start_time', key: 'start_time', fixed: 'left', width: 100
                },
                {
                    title: '创建订单数', dataIndex: 'total_of_orders', key: 'total_of_orders'
                },
                {
                    title: '真实议价订单数', dataIndex: 'total_of_bargain_orders', key: 'total_of_bargain_orders'
                },
                {
                    title: '议价订单决策成功单数', dataIndex: 'total_of_bargain_decision_orders', key: 'total_of_bargain_decision_orders'
                },
                {
                    title: '议价订单完成订单数', dataIndex: 'total_of_bargain_finished_orders', key: 'total_of_bargain_finished_orders'
                },
                {
                    title: '非议价订单数', dataIndex: 'total_of_no_bargain_orders', key: 'total_of_no_bargain_orders'
                },
                {
                    title: '非议价订单决策成功单数', dataIndex: 'total_of_no_bargain_decision_success_orders', key: 'total_of_no_bargain_decision_success_orders'
                },
                {
                    title: '非议价订单完成订单数', dataIndex: 'total_of_no_bargain_finished_orders', key: 'total_of_no_bargain_finished_orders'
                },
                {
                    title: '用户议价订单',
                    children: [
                        {title: '用户议价单数', dataIndex: 'total_of_user_bargain_orders', key: 'total_of_user_bargain_orders'},
                        {title: '加价单数', dataIndex: 'total_of_user_bargain_orders_add', key: 'total_of_user_bargain_orders_add'},
                        {title: '加价完成单数', dataIndex: 'total_of_user_bargain_finished_orders_add', key: 'total_of_user_bargain_finished_orders_add'},
                        {title: '减价单数', dataIndex: 'total_of_user_bargain_orders_sub', key: 'total_of_user_bargain_orders_sub'},
                        {title: '减价完成单数', dataIndex: 'total_of_user_bargain_finished_orders_sub', key: 'total_of_user_bargain_finished_orders_sub'},
                        {title: '取消单数', dataIndex: 'total_of_user_bargain_active_cancel_orders', key: 'total_of_user_bargain_active_cancel_orders'}
                    ]
                },
                {
                    title: '司机议价订单',
                    children: [
                        {title: '司机议价单数', dataIndex: 'total_of_driver_bargain_orders', key: 'total_of_driver_bargain_orders'},
                        {title: '加价单数', dataIndex: 'total_of_driver_bargain_orders_add', key: 'total_of_driver_bargain_orders_add'},
                        {title: '加价完成单数', dataIndex: 'total_of_driver_bargain_finished_orders_add', key: 'total_of_driver_bargain_finished_orders_add'},
                        {title: '减价单数', dataIndex: 'total_of_driver_bargain_orders_sub', key: 'total_of_driver_bargain_orders_sub'},
                        {title: '减价完成单数', dataIndex: 'total_of_driver_bargain_finished_orders_sub', key: 'total_of_driver_bargain_finished_orders_sub'}
                    ]
                }
            ],
            exportParams: {},
            flag: false
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
        let arrStr = ['start_time']
        let searchParams = this.getParams();
        let result =getFun('/web_api/operation/bargain',  searchParams);
        result.then(res => {
            this.setState({
                load: false,
                tableData: objectToArr(res.data, arrStr)

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
    getTotalPage() {
        let day = dateDiff(this.state.start_at, this.state.end_at);
        return day;
    }
    render() {
        let {title, carTypes, load, tableHeader, total, pageSize} = this.state;
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
                                <div className="cartype-wrapper">
                                    <label className="cartype-label">车型：</label>
                                    <RadioGroup onChange={this.carTypeChange.bind(this)} defaultValue='0' >
                                        {radioChildren}
                                    </RadioGroup>
                                    <p className="cartype-text">以订单车型筛选</p>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary" icon='search' onClick={this.searchBtn.bind(this)}>查询</Button>
                            </div>
                        </div>
                    </Card>
                    <div className="tableWrap">
                        <div>
                            <Table dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false} scroll={{x: '200%'}}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col span={10}>
                                    <ExportFileCom params={this.state.exportParams}></ExportFileCom>
                                </Col>
                                <Col span={14} style={{textAlign: 'right'}}>
                                    <Pagination  current={this.state.current} total={total} onChange={this.pageChange.bind(this)} pageSize={pageSize}  showQuickJumper></Pagination>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default BargainingAnalysis;