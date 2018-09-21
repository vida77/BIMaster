import React from 'react'
import { hashHistory } from 'react-router';
import {Card, Table, Row, Col, Button, Pagination} from 'antd';
import moment from 'moment';
// import SearchBox from '../../components/searchBox/searchBox'
import CityActivity from "../../components/searchBox/cityActivity";
import ExportFileCom from '../../components/exportFile/exportFile'
import DateBox from "../../components/searchBox/dateBox";

import {getFun} from '../../utils/api'
import dateFormat from "../../utils/dateFormat";
import {objectToArr, dateDiff, milliFormat} from '../../utils/dataHandle'

import './activityEffect.less'
export  default class effectStatistic extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            flag: false,
            title: '活动效果统计',
            detailsTitle: '',
            selectBoxTitle: '活动筛选',
            showFlag: true,
            tableData: [],
            tableData1: [],
            tableHeader: [
                {
                    title: '活动ID', dataIndex: 'activity_id', key: 'activity_id'
                },
                {
                    title: '活动名称', dataIndex: 'activity_name', key: 'activity_name',
                    render: (text, record, index) => <a href="javascript:;" onClick={this.gotoDetails.bind(this,text)}>{text}</a>,
                },
                {
                    title: '发放量', dataIndex: 'issue_count', key: 'issue_count',
                    render: (text, record, index) => <a href="javascript:;" onClick={this.gotoCoupon.bind(this,record)}>{text}</a>
                },
                {
                    title: '使用量', dataIndex: 'use_count', key: 'use_count'
                },
                {
                    title: '新用户数', dataIndex: 'new_user_count', key: 'new_user_count'
                },
                {
                    title: '召回用户', dataIndex: 'recall_user_count', key: 'recall_user_count'
                },
                {
                    title: '总单量', dataIndex: 'total_order_count', key: 'total_order_count'
                },
                {
                    title: '总金额', dataIndex: 'total_amount', key: 'total_amount'
                },
                {
                    title: '总补贴', dataIndex: 'total_subsidy', key: 'total_subsidy'
                },
                {
                    title: '均单价', dataIndex: 'order_average_amount', key: 'order_average_city_subsidy'
                },
                {
                    title: '单均收入', dataIndex: 'order_average_income', key: 'order_average_income'
                },
                {
                    title: '单均补贴', dataIndex: 'order_average_subsidy', key: 'order_average_subsidy'
                },
                {
                    title: '单均利润', dataIndex: 'order_average_profit', key: 'order_average_profit'
                },
                {
                    title: 'CAC', dataIndex: 'CAC', key: 'CAC'
                },
            ],
            tableHeader1: [
                {
                    title: '日期', dataIndex: 'start_time', key: 'start_time'
                },
                {
                    title: '活动ID', dataIndex: 'activity_id', key: 'activity_id'
                },
                {
                    title: '活动名称', dataIndex: 'activity_name', key: 'activity_name',
                },
                {
                    title: '发放量', dataIndex: 'issue_count', key: 'issue_count'
                },
                {
                    title: '使用量', dataIndex: 'use_count', key: 'use_count'
                },
                {
                    title: '新用户数', dataIndex: 'new_user_count', key: 'new_user_count'
                },
                {
                    title: '召回用户', dataIndex: 'recall_user_count', key: 'recall_user_count'
                },
                {
                    title: '总单量', dataIndex: 'total_order_count', key: 'total_order_count'
                },
                {
                    title: '总金额', dataIndex: 'total_amount', key: 'total_amount'
                },
                {
                    title: '总补贴', dataIndex: 'total_subsidy', key: 'total_subsidy'
                },
                {
                    title: '均单价', dataIndex: 'order_average_amount', key: 'order_average_city_subsidy'
                },
                {
                    title: '单均收入', dataIndex: 'order_average_income', key: 'order_average_income'
                },
                {
                    title: '单均补贴', dataIndex: 'order_average_subsidy', key: 'order_average_subsidy'
                },
                {
                    title: '单均利润', dataIndex: 'order_average_profit', key: 'order_average_profit'
                },
                {
                    title: 'CAC', dataIndex: 'CAC', key: 'CAC'
                },

            ],
            exportParams: {},
            exportParams1: {},
            load: true,
            load1: true,
            current: 1,
            current1: 1,
            total: 1,
            total1: 1,
            pageSize: 10,
            pageSize1: 10,
            dayNum: 10,
            dateParams:{},
            start_at: '',
            end_at: '',
            city: '',
            id_value:'',
            name_value:'',
            activity_id_detail:'',
            activity_name_detail: '',
            typeOptionData: ['活动ID','活动名称'],
            
        }
        this.gotoDetails = this.gotoDetails.bind(this)
    }
    componentWillMount(){
        this.getTableData();
    }
    componentDidMount(){
        this.setState({
            load:true
        },() => {
            this.getTableData();
        })
    }
   
    //初始化查询起止日期-详情页
    initDateRange(rangeDays) {
        //时间类型为moment格式
        const  endTime= moment().subtract(1, 'days');//当前时间
        const startTime = moment().subtract(rangeDays, 'days');//当前时间
        const start = new Date((moment(startTime).subtract())._d);
        const end = new Date((moment(endTime).subtract())._d);
        this.setState({
            // city: this.state.city,
            start_at: this.formatDate(start),
            end_at: this.formatDate(end), //当前时间减n天
        });
    }
    // 初始化导出所需数据
    initExportData() {
        const exportParams = {
            title: '活动效果_' + this.state.title,
            tableHeader: this.state.tableHeader,
            exportData: this.state.tableData,
        }
        this.setState({
            exportParams: exportParams
        })
    }
    // 初始化导出所需数据--详情
    initExportData1() {
        const exportParams = {
            start_at: this.state.start_at,
            end_at: this.state.end_at,
            title: '活动效果_' + this.state.title,
            tableHeader: this.state.tableHeader,
            exportData: this.state.tableData1
        }
        this.setState({
            exportParams: exportParams
        })
    }
     // 获取城市，活动ID／活动名称--组件参数
    cityActivityParams(params){
        console.log('组件城市／活动ID／活动名称参数',params)
        this.setState({
            id_value: params.id_value,
            name_value: params.name_value,
            city: params.city,
            flag: true
        })
    }
    // 获取日期--组建参数
    dateBoxParams(params){
        console.log('组件日期参数',params)
        this.setState({
            dateParams: params,
            start_at: params.selectedStartDate,
            end_at: params.selectedEndDate,
        })
    }
    // 查询
    searchBtn(){
        this.setState({
            load: true,
            total: this.state.total
        },() => {
            this.getTableData()
        })
    }
    // 查询--详情
    searchBtn1(){
        this.setState({
            load1: true,
            total1: this.state.total1
        },() => {
            this.getTableData1()
        })
    }
    // 获取列表数据
    getTableData(){
        let arrStr = ['start_time','coupon_name']
        let searchParams = this.getParams();
        let result =getFun('/web_api/coupon/list',  searchParams);
        result.then(res => {
            // console.log(res.data)
            this.setState({
                load: false,
                tableData: objectToArr(res.data.data,arrStr),
                total: res.data.total

            }, () => {this.initExportData()})
        }).catch(err => {
            console.log(err)
        })
        this.setState({
            load: false,
        })
    }
    // 获取列表数据--详情
    getTableData1(){
        let arrStr = ['date_ts','coupon_name']
        let searchParams = this.getParams1();
        let result =getFun('/web_api/coupon/list',  searchParams);
        result.then(res => {
            res.data.data.map(item=>{
                item.date_ts = dateFormat(item.date_ts*1000,"yyyy-MM-dd")
                console.log(item.date_ts)
            })
            this.setState({
                load1: false,
                tableData1: objectToArr(res.data.data, arrStr),
                total: res.data.total
        
            }, () => {this.initExportData1()})
        }).catch(err => {
            console.log(err)
        })
            this.setState({
                load1: false,
            })
    }
    
    // 获取接口参数
    getParams() {
        const params = {
            coupon_id: this.state.id_value?this.state.id_value:'',
            coupon_name: this.state.name_value?this.state.name_value:'',
            city: this.state.flag?this.state.city:this.getCityParams(),
            page: this.state.current,
        }
        // console.log('请求参数',params)
        return params;
    }
   
    // 城市权限
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
    // pageEndDate() {
    //     let days = (this.state.current - 1) * this.state.pageSize;
    //     let copy = moment(this.state.end_at).add(0, 'days'); //复制结束日期的副本
    //     return  copy.subtract(days, 'days');
    // }

    // //分页查询的开始时间
    // pageStartDate() {
    //     let days = this.state.current * this.state.pageSize;
    //     let copy, dt;
    //     copy = moment(this.state.end_at); //复制结束日期的副本
    //     copy = copy.add(1, 'days'); //查日期为当前结束日期+1天
    //     dt = copy.subtract(days, 'days');
    //     let bb = dt.format("YYYY-MM-DD");
    //     if(this.state.start_at && bb < this.state.start_at) {
    //         return this.state.start_at;
    //     }else {
    //         return bb;
    //     }
    //}
    getTotalPage() {
        let day = dateDiff(this.state.start_at, this.state.end_at);
        return day;
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
    // 获取当前页数--详情
    pageChange1(page, pageSize) {
        this.setState({
            current1: page,
            pageSize1: pageSize,
            load1: true
        },() => {
            this.getTableData1()
        })
    }
    // 优惠券统计->优惠券统计详情页
    gotoDetails(text,record){
        // console.log(record)
        this.setState({
            detailsTitle:  ' / ' + text,
            showFlag: !this.state.showFlag
        })
        this.initDateRange(this.state.dayNum);//初始化查询日期
        let city = this.getCityParams();
        this.setState({
            city: city,
            load1: true,
            coupon_id_detail: record.coupon_id,
            coupon_name_detail: record.coupon_name,

        },() => {
            this.getTableData1();
        })
    }
    // 优惠券统计详情页->优惠券统计
    goBackDetails(){
        this.setState({
            showFlag: !this.state.showFlag,
            load: false
        })
    }
    gotoCoupon(record){
        hashHistory.push({
            pathname: '/app/activityEffect/couponStatistic',
            query: {
                activity_id: record.activity_id
            },
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
    // onShowSizeChange(current, size) {
    //     this.setState({
    //         pageSize: size,
    //         current: current,
    //         load: true
    //     }, () => {
    //         this.getTableData();
    //     });
    // }
    render(){
        const { showFlag, title, detailsTitle, tableData, tableHeader, load, current, total, pageSize, 
            tableData1, tableHeader1, load1, current1, total1, pageSize1, selectBoxTitle, typeOptionData } = this.state;
        //let tableData = milliFormat(this.state.tableData);
        //let tableData2 = milliFormat(this.state.tableData2);
        return (
            <div>
                <div className={showFlag?"effect-wrapper": "effect-wrapper active"}>
                    <div className="operating-wrapper">
                        <h3 className="cardTitle">{title}</h3>
                        <Card bordered={false}>
                            <div className="search-content">
                                <div className="search-wrapper">
                                    <div>
                                        {/* <SelectBox searchParams={params => this.thisSearchParams(params)} title={selectBoxTitle} typeOptionData={typeOptionData}></SelectBox> */}
                                        <CityActivity searchParams={params => this.cityActivityParams(params)} title={selectBoxTitle} typeOptionData={typeOptionData}></CityActivity>
                                    </div>
                                </div>
                                <div className="search-btn-wrapper">
                                    <Button type="primary"  icon='search' onClick={this.searchBtn.bind(this)}>查询</Button>
                                </div>
                            </div>
                        </Card>
                        <div className="tableWrap" style={{marginBottom:16}}>
                            <div>
                                <Table dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false}>

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
                <div className={showFlag?"effect-details-wrapper": "effect-details-wrapper active"}>
                    <div className="operating-wrapper">
                        <h3 className="cardTitle">
                            <a onClick={this.goBackDetails.bind(this)}>返回 活动效果统计 </a>
                            <span> {detailsTitle}</span>
                        </h3>
                        <Card bordered={false}>
                            <div className="search-content">
                                <div className="search-wrapper">
                                <div>
                                    <DateBox searchParams={params => this.dateBoxParams(params)}></DateBox>
                                </div>
                                </div>
                                <div className="search-btn-wrapper">
                                    <Button type="primary"  icon='search' onClick={this.searchBtn1.bind(this)}>查询</Button>
                                </div>
                            </div>
                        </Card>
                        <div className="tableWrap" style={{marginBottom:16}}>
                            <div>
                                <Table dataSource={tableData1} bordered loading={load1} columns={tableHeader1} pagination={false}>

                                </Table>
                            </div>
                            <div className="page-footer">
                                <Row>
                                    <Col span={10}>
                                        <ExportFileCom params={this.state.exportParams}></ExportFileCom>
                                    </Col>
                                    <Col span={14} style={{textAlign: 'right'}}>
                                        <Pagination current={this.state.current1} total={total1} onChange={this.pageChange1.bind(this)} pageSize={pageSize1}  showQuickJumper></Pagination>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}