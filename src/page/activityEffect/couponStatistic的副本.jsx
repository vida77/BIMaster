import React from 'react'
import {Button, Card, Table, Row, Col, Pagination} from 'antd'
import moment from 'moment';
import './activityEffect.less'
import ExportFileCom from "../../components/exportFile/exportFile";
import DateBox from "../../components/searchBox/dateBox";
// import SelectBox from "../../components/searchBox/selectBox";
import CityActivity from "../../components/searchBox/cityActivity";
import {getFun} from "../../utils/api";
import {dateDiff, objectToArr} from "../../utils/dataHandle";
export  default class couponStatistic extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            flag: false,
            showFlag: true,
            title: '优惠券统计',
            selectBoxTitle: '优惠券筛选',
            detailsTitle: '',
            load: true,
            load1: true,
            tableData: [
                {
                    key: 111, id: 111, name: '优惠券aaa', ffl: 100, syl: 100, jhyhs: 100, jhyhdds: 100, jhyhsr: 100, jhyhcb: 100, jhyhsjyh: 100, lyhs: 100, lyhdds: 100, lyhsr: 100, lyhcb: 100, lyhsjyh: 100
                }
            ],
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
                        {title: '激活用户数', dataIndex: 'new_user_num', key: 'new_user_num'},
                        {title: '激活用户订单数', dataIndex: 'new_user_order_num', key: 'new_user_order_num'},
                        {title: '激活用户订单支付金额', dataIndex: 'new_user_total_amount', key: 'new_user_total_amount'},
                        {title: '激活用户订单原始金额', dataIndex: 'new_user_origin_amount', key: 'new_user_origin_amount'},
                        {title: '激活用户订单司机分账金额', dataIndex: 'new_user_sharing_amount', key: 'new_user_sharing_amount'},
                        {title: '激活用户订单优惠金额', dataIndex: 'new_user_discount_amount', key: 'new_user_discount_amount'}
                    
                    ]
                },
                {
                    title: '老用户',
                    children: [
                        {title: '老用户数', dataIndex: 'old_user_num', key: 'old_user_num'},
                        {title: '老用户订单数', dataIndex: 'old_user_order_num', key: 'old_user_order_num'},
                        {title: '老用户订单支付金额', dataIndex: 'old_user_total_amount', key: 'old_user_total_amount'},
                        {title: '老用户订单原始金额', dataIndex: 'old_user_origin_amount', key: 'old_user_origin_amount'},
                        {title: '老用户订单司机分账金额', dataIndex: 'old_user_sharing_amount', key: 'old_user_sharing_amount'},
                        {title: '老用户订单优惠金额', dataIndex: 'old_user_discount_amount', key: 'old_user_discount_amount'}
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
                        {title: '激活用户数', dataIndex: 'new_user_num', key: 'new_user_num'},
                        {title: '激活用户订单数', dataIndex: 'new_user_order_num', key: 'new_user_order_num'},
                        {title: '激活用户订单支付金额', dataIndex: 'new_user_total_amount', key: 'new_user_total_amount'},
                        {title: '激活用户订单原始金额', dataIndex: 'new_user_origin_amount', key: 'new_user_origin_amount'},
                        {title: '激活用户订单司机分账金额', dataIndex: 'new_user_sharing_amount', key: 'new_user_sharing_amount'},
                        {title: '激活用户订单优惠金额', dataIndex: 'new_user_discount_amount', key: 'new_user_discount_amount'}
                    
                    ]
                },
                {
                    title: '老用户',
                    children: [
                        {title: '老用户数', dataIndex: 'old_user_num', key: 'old_user_num'},
                        {title: '老用户订单数', dataIndex: 'old_user_order_num', key: 'old_user_order_num'},
                        {title: '老用户订单支付金额', dataIndex: 'old_user_total_amount', key: 'old_user_total_amount'},
                        {title: '老用户订单原始金额', dataIndex: 'old_user_origin_amount', key: 'old_user_origin_amount'},
                        {title: '老用户订单司机分账金额', dataIndex: 'old_user_sharing_amount', key: 'old_user_sharing_amount'},
                        {title: '老用户订单优惠金额', dataIndex: 'old_user_discount_amount', key: 'old_user_discount_amount'}
                    ]
                }
            ],
            exportParams: {},
            exportParams1: {},
            current: 1,
            current1: 1,
            total: 1,
            total1: 1,
            pageSize: 10,
            pageSize1: 10,
            tableData1: [
                {
                    key: 111,start_time: '20180101', id1: 111, name1: '优惠券aaa', ffl1: 100, syl1: 100, jhyhs1: 100, jhyhdds1: 100, jhyhsr1: 100, jhyhcb1: 100, jhyhsjyh1: 100, lyhs1: 100, lyhdds1: 100, lyhsr1: 100, lyhcb1: 100, lyhsjyh1: 100
                }
            ],
            dayNum: 10,
            start_at: '',
            end_at: '',
            city: '',
            activity: {},
            typeOptionData: ['优惠券ID','优惠券名称'],
            flag: false,
        }
    }
    componentWillMount(){
        this.getTableData();
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
        });
    }
    // 初始化导出所需数据
    initExportData() {
        const exportParams = {
            city: this.state.city,
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
    // 查询
    searchBtn(){
        this.setState({
            load: true
        },() => {this.getTableData()})
    }
    // 查询--详情
    searchBtn1(){
        this.setState({
            load1: true
        })
    }
    // 获取城市，活动ID／活动名称--组件参数
    cityActivityParams(params){
        console.log(params)
        this.setState({
            activity: params.activity,
            city: params.city,
            flag: true
        })
    }
    // 获取日期--组建参数
    dateBoxParams(params){
        this.setState({
            dateParam: params
        })
    }
    // 获取列表数据
    getTableData(){
        let searchParams = this.getParams();
        // let result =getFun('/web_api/coupon/list',  searchParams);
        // result.then(res => {
        //     this.setState({
        //         load1: false,
        //         tableData1: objectToArr(res.data)
        
        //     }, )
        // }).catch(err => {
        //     console.log(err)
        // })
        this.setState({
            load: false,
        })
    }
    // 获取列表数据--详情
    getTableData1(){
        let arrStr = ['start_time']
        let searchParams = this.getParams1();
        // let result =getFun('/web_api/operation/bargain',  searchParams);
        // result.then(res => {
        //     this.setState({
        //         load1: false,
        //         tableData1: objectToArr(res.data, arrStr)
        //
        //     }, () => {this.initExportData1()})
        // }).catch(err => {
        //     console.log(err)
        // })
            this.setState({
                load1: false,
            })
    }
    // 获取接口参数
    getParams() {
        const params = {
            coupon_id: this.state.activity,
            coupon_name: this.state.activity,
            city: this.state.flag?this.state.city:this.getCityParams(),
        }
        console.log(params)
        return params;
    }
    // 获取接口参数--详情
    getParams1() {
        let start, end;
        start = this.pageStartDate();
        end = this.pageEndDate().format("YYYY-MM-DD");
        const params = {
            start_at: start,
            end_at: end,
        }
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
    getTotalPage() {
        let day = dateDiff(this.state.start_at, this.state.end_at);
        return day;
    }
    //分页查询的结束时间
    pageEndDate() {
        let days = (this.state.current1 - 1) * this.state.pageSize1;
        let copy = moment(this.state.end_at).add(0, 'days'); //复制结束日期的副本
        return  copy.subtract(days, 'days');
    }
    //分页查询的开始时间
    pageStartDate() {
        let days = this.state.current1 * this.state.pageSize1;
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
    gotoDetails(text){
        this.setState({
            detailsTitle:  ' / ' + text,
            showFlag: !this.state.showFlag
        })
        this.initDateRange(this.state.dayNum);//初始化查询日期
        let city = this.getCityParams();
        this.setState({
            city: city,
            load:true
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
        const { showFlag, title, detailsTitle, tableData, tableHeader, load, current, total, pageSize, 
            tableData1, tableHeader1, load1, current1, total1, pageSize1, selectBoxTitle, typeOptionData } = this.state;
        return (
            <div className="operating-wrapper coupon-wrapper">
                <div className={showFlag?"effect-wrapper": "effect-wrapper active"}>
                    <h3 className="cardTitle">{title}</h3>
                    <Card bordered={false}>
                        <div className="search-content">
                            <div className="search-wrapper">
                                <div>
                                    <CityActivity searchParams={params => this.cityActivityParams(params)} title={selectBoxTitle} typeOptionData={typeOptionData}></CityActivity>
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
                                    <DateBox searchParams={params => this.dateBoxParams(params)}></DateBox>
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
                                    <ExportFileCom params={this.state.exportParams}></ExportFileCom>
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