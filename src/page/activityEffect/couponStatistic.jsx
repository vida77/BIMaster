import React from 'react'
import {Button, Card, Table, Row, Col, Pagination} from 'antd'
import moment from 'moment';

import ExportFileCom from "../../components/exportFile/exportFile";
import CityActivity from "../../components/searchBox/cityActivity";
import DateBoxMarket from "../../components/searchBox/dateBoxMarket";

import {getFun} from "../../utils/api";
import dateFormat from "../../utils/dateFormat";
import {dateDiff, objectToArr, objectToArr2,milliFormat} from "../../utils/dataHandle";

import './activityEffect.less'
export  default class couponStatistic extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            flag: false,
            showFlag: true,
            title: '优惠券统计',
            selectBoxTitle: '优惠券筛选',
            detailsTitle: '',
            tableData: [],
            tableData1: [],
            tableHeader: [
                {title: '优惠券ID', dataIndex: 'coupon_id', key: 'coupon_id'},
                {title: '优惠券名称', dataIndex: 'coupon_name', key: 'coupon_name',
                    render: (text,record ) => (<a href="javascript:;" onClick={this.gotoDetails.bind(this, text,record)}>{text}</a>),
                },
                {title: '发放量', dataIndex: 'sent_num', key: 'sent_num'},
                {title: '使用量', dataIndex: 'used_num', key: 'used_num'},
                {
                    title: '新激活用户',
                    children: [
                        {title: '用户数', dataIndex: 'new_user_num', key: 'new_user_num'},
                        {title: '订单数', dataIndex: 'new_user_order_num', key: 'new_user_order_num'},
                        {title: '订单支付金额', dataIndex: 'new_user_total_amount', key: 'new_user_total_amount'},
                        {title: '订单原始金额', dataIndex: 'new_user_origin_amount', key: 'new_user_origin_amount'},
                        {title: '订单司机分账金额', dataIndex: 'new_user_sharing_amount', key: 'new_user_sharing_amount'},
                        {title: '订单优惠金额', dataIndex: 'new_user_discount_amount', key: 'new_user_discount_amount'}
                    
                    ]
                },
                {
                    title: '老用户',
                    children: [
                        {title: '用户数', dataIndex: 'old_user_num', key: 'old_user_num'},
                        {title: '订单数', dataIndex: 'old_user_order_num', key: 'old_user_order_num'},
                        {title: '订单支付金额', dataIndex: 'old_user_total_amount', key: 'old_user_total_amount'},
                        {title: '订单原始金额', dataIndex: 'old_user_origin_amount', key: 'old_user_origin_amount'},
                        {title: '订单司机分账金额', dataIndex: 'old_user_sharing_amount', key: 'old_user_sharing_amount'},
                        {title: '订单优惠金额', dataIndex: 'old_user_discount_amount', key: 'old_user_discount_amount'}
                    ]
                }
            ],
            tableHeader1: [
                {title: '日期', dataIndex: 'date_ts', key: 'date_ts'},
                {title: '优惠券ID', dataIndex: 'coupon_id', key: 'coupon_id'},
                {title: '优惠券名称', dataIndex: 'coupon_name', key: 'coupon_name'},
                {title: '发放量', dataIndex: 'sent_num', key: 'sent_num'},
                {title: '使用量', dataIndex: 'used_num', key: 'used_num'},
                {
                    title: '新激活用户',
                    children: [
                        {title: '用户数', dataIndex: 'new_user_num', key: 'new_user_num'},
                        {title: '订单数', dataIndex: 'new_user_order_num', key: 'new_user_order_num'},
                        {title: '订单支付金额', dataIndex: 'new_user_total_amount', key: 'new_user_total_amount'},
                        {title: '订单原始金额', dataIndex: 'new_user_origin_amount', key: 'new_user_origin_amount'},
                        {title: '订单司机分账金额', dataIndex: 'new_user_sharing_amount', key: 'new_user_sharing_amount'},
                        {title: '订单优惠金额', dataIndex: 'new_user_discount_amount', key: 'new_user_discount_amount'}
                    
                    ]
                },
                {
                    title: '老用户',
                    children: [
                        {title: '用户数', dataIndex: 'old_user_num', key: 'old_user_num'},
                        {title: '订单数', dataIndex: 'old_user_order_num', key: 'old_user_order_num'},
                        {title: '订单支付金额', dataIndex: 'old_user_total_amount', key: 'old_user_total_amount'},
                        {title: '订单原始金额', dataIndex: 'old_user_origin_amount', key: 'old_user_origin_amount'},
                        {title: '订单司机分账金额', dataIndex: 'old_user_sharing_amount', key: 'old_user_sharing_amount'},
                        {title: '订单优惠金额', dataIndex: 'old_user_discount_amount', key: 'old_user_discount_amount'}
                    ]
                }
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
            dayNum: 60,
            dateParams:{},
            start_at: '',
            end_at: '',
            city: '',
            id_value:'',
            name_value:'',
            coupon_id_detail:'',
            coupon_name_detail: '',
            typeOptionData: ['优惠券ID','优惠券名称'],
            activity_id: '',
            defaultCity:[]
        }
    }   
    componentWillMount(){
        this.initDateRange(this.state.dayNum);//初始化查询日期
        
        let cityParam = this.props.location.search.substr(1).split('&')[1].split('=')[1]
        if(this.props.location.search){
            if(cityParam){ 
                let cityStr = this.props.location.search.split('=')[2].split('-')
                this.setState({
                    city: cityStr.join(","),
                    defaultCity: cityStr, 
                    activity_id: this.props.location.search.split('=')[1].split('&')[0]
                })
                console.log(cityStr.join(","))
            }else{
                this.setState({
                    city: '',
                    defaultCity: ['all'], 
                    activity_id: this.props.location.search.split('=')[1].split('&')[0]
                })
            }
        }else{
            this.setState({
                city: '',
                defaultCity: ['all'], 
                activity_id: ''
            })
        }
        
    }
    componentDidMount(){
        this.getTableData();
    }
    GetQueryString(name)
    {
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    //初始化查询起止日期
    initDateRange(rangeDays) {
        //时间类型为moment格式
        const  endTime= moment().subtract(1, 'days');//当前时间
        const startTime = moment().subtract(rangeDays, 'days');//当前时间
        const start = new Date((moment(startTime).subtract())._d);
        const end = new Date((moment(endTime).subtract())._d);
        this.setState({
            start_at: this.formatDate(start),
            end_at: this.formatDate(end), //当前时间减n天
        });
    }
    // 初始化导出所需数据
    initExportData() {
        const exportParams = {
            title: '优惠券_' + this.state.title,
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
            title: '优惠券_' + this.state.detailsTitle,
            tableHeader: this.state.tableHeader1,
            exportData: this.state.tableData1
        }
        this.setState({
            exportParams1: exportParams
        })
    }
    // 获取城市，活动ID／活动名称--组件参数
    cityActivityParams(params){
        console.log('组件城市／活动ID／活动名称参数',params)
        if(params.city[0] == 'all'){
            params.city = '';
        }
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
            total: this.state.total,
            current: 1
        },() => {
            this.getTableData()
        })
    }
    // 查询--详情
    searchBtn1(){
        this.setState({
            load1: true,
            total1: this.state.total1,
            current1: 1
        },() => {
            this.getTableData1()
        })
    }
    // 获取列表数据
    getTableData(){
        let arrStr = ['start_time','coupon_name']
        let searchParams = this.getParams();
        console.log("q",searchParams)
        let result =getFun('/web_api/market/coupon',  searchParams);
        result.then(res => {
            // console.log(res.data)
            this.setState({
                load: false,
                tableData: objectToArr2(res.data.data,arrStr),
                total: res.data.total,
                id_value: '',
                name_value: '',
                // city: searchParams.city

            }, () => {this.initExportData()})
        }).catch(err => {
            console.log(err)
        })
        // this.setState({
        //     // load: false,
        //     id_value: '',
        //     name_value: ''
        // })
    }
    // 获取列表数据--详情
    getTableData1(){
        let arrStr = ['date_ts','coupon_name']
        let searchParams = this.getParams1();
        let result =getFun('/web_api/market/coupon',  searchParams);
        result.then(res => {
            res.data.data.map(item=>{
                item.date_ts = dateFormat(item.date_ts*1000,"yyyy-MM-dd")
                // console.log(item.date_ts)
            })
            this.setState({
                load1: false,
                tableData1: objectToArr2(res.data.data, arrStr),
                total1: res.data.total,
                city: searchParams.city
        
            }, () => {this.initExportData1()})
        }).catch(err => {
            console.log(err)
        })
    }
    // 获取接口参数
    getParams() {
        const params = {
            coupon_id: this.state.id_value?this.state.id_value:'',
            coupon_name: this.state.name_value?this.state.name_value:'',
            page: this.state.current,
            activity_id: this.state.activity_id?this.state.activity_id:'',
            city: this.state.city?this.state.city:this.getCityParams()
        }
        console.log('请求参数',params)
        // this.setState({
        //     city: params.city,
        // })
        return params;
    }
    // 获取接口参数--详情
    getParams1() {
        console.log(this.state.city)
        // let start, end;
        // start = this.pageStartDate();
        // end = this.pageEndDate().format("YYYY-MM-DD");
        const params = {
            coupon_id: this.state.coupon_id_detail,
            coupon_name: this.state.coupon_name_detail,
            start_at: this.state.start_at,
            end_at: this.state.end_at,
            groupby: 'date',
            page: this.state.current1,
            city: this.state.city
        }
        console.log('详情页请求参数',params)
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
    getTotalPage() {
        let day = dateDiff(this.state.start_at, this.state.end_at);
        return day;
    }
    // //分页查询的结束时间
    // pageEndDate() {
    //     let days = (this.state.current1 - 1) * this.state.pageSize1;
    //     let copy = moment(this.state.end_at).add(0, 'days'); //复制结束日期的副本
    //     return  copy.subtract(days, 'days');
    // }
    // //分页查询的开始时间
    // pageStartDate() {
    //     let days = this.state.current1 * this.state.pageSize1;
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
    // }
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
        // let city = this.getCityParams();
        this.setState({
            // city: city,
            load1: true,
            coupon_id_detail: record.coupon_id,
            coupon_name_detail: '',

        },() => {
            this.getTableData1();
        })
    }
    // 优惠券统计详情页->优惠券统计
    goBackDetails(){
        this.setState({
            showFlag: !this.state.showFlag,
            load: false,
            // city: ''
        },() => {
            this.getTableData();
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
    render(){
        const { showFlag, title, detailsTitle, tableHeader, load, current, total, pageSize, 
             tableHeader1, load1, current1, total1, pageSize1, selectBoxTitle, typeOptionData } = this.state;
        let tableData = milliFormat(this.state.tableData);
        let tableData1 = milliFormat(this.state.tableData1);        
            return (
            <div className="operating-wrapper coupon-wrapper">
                <div className={showFlag?"effect-wrapper": "effect-wrapper active"}>
                    <h3 className="cardTitle">{title}</h3>
                    <Card bordered={false}>
                        <div className="search-content">
                            <div className="search-wrapper">
                                <div>
                                    <CityActivity defaultCity={this.state.defaultCity} searchParams={params => this.cityActivityParams(params)} title={selectBoxTitle} typeOptionData={typeOptionData}></CityActivity>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary" icon='search' onClick={this.searchBtn.bind(this)}>查询</Button>
                            </div>
                        </div>
                    </Card>
                    {/*<Button onClick={this.gotoDetails.bind(this)}>click</Button>*/}
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
                                    <Pagination  current={current} total={total} onChange={this.pageChange.bind(this)} pageSize={pageSize}  showQuickJumper></Pagination>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div className={showFlag?"effect-details-wrapper": "effect-details-wrapper active"}>
                    <h3 className="cardTitle"><a onClick={this.goBackDetails.bind(this)}>返回 活动优惠券统计</a>{detailsTitle}</h3>
                    <Card bordered={false}>
                        <div className="search-content">
                            <div className="search-wrapper">

                                <div>
                                    <DateBoxMarket searchParams={params => this.dateBoxParams(params)}></DateBoxMarket>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary" icon='search' onClick={this.searchBtn1.bind(this)}>查询</Button>
                            </div>
                        </div>
                    </Card>
                    <div className="tableWrap">
                        <div>
                            <Table dataSource={tableData1} bordered loading={load1} columns={tableHeader1} pagination={false} scroll={{x: '130%'}}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col span={10}>
                                    <ExportFileCom params={this.state.exportParams1}></ExportFileCom>
                                </Col>
                                <Col span={14} style={{textAlign: 'right'}}>
                                    <Pagination  current={current1} total={total1} onChange={this.pageChange1.bind(this)} pageSize={pageSize1}  showQuickJumper></Pagination>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}