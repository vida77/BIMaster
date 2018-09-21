
import React from 'react';
import {Card, Table, Radio, Row, Col, Button, Pagination, Select, Icon} from 'antd';
import moment from 'moment';
import SearchBox from '../../components/searchBox/searchBox'
// import SearchCheckBox from '../../components/searchBox/searchCheckBox'
import ExportFileCom from '../../components/exportFile/exportFile'

import {getFun} from '../../utils/api'
import {objectToArr, dateDiff, milliFormat} from '../../utils/dataHandle'
import './operating.less'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class CapacityAnalysis extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            title: '运力分析',
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
            driverCombine: {
                0: '',
                1: 'A',
                2: 'B',
                3: 'C',

            },
            driverTypes: {
                0: '全部',
                1: '全职',
                2: '半全职',
                3: '兼职',
            },
            certificateCombine: {
                0: '',
                1: 6,
                2: 5,
                3: 7,

            },
            certificateTypes: {
                0: '全部',
                1: '人证通过',
                2: '车证通过',
                3: '双证通过',
            },
            city: '',
            start_at: '',
            end_at: '',
            car_type_id: '',
            si_ji_fen_ceng: '',
            shuang_zheng_shen_he_zhuang_tai: '',
            searchParams: {},
            tableHeader: [
                {
                    title: '统计日期', dataIndex: 'start_time', key: 'start_time',  width: '100px'
                },
                {
                    title: '司机加盟',
                    children: [
                        {title: '等待审核', dataIndex: 'driver_reg_check', key: 'driver_reg_check'},
                        {title: '通过审核', dataIndex: 'total_of_registered_drivers', key: 'total_of_registered_drivers'},
                        {title: '激活', dataIndex: 'total_of_activation_drivers', key: 'total_of_activation_drivers'},
                        {title: '累计注册', dataIndex: 'driver_reg_total', key: 'driver_reg_total'},
                        {title: '累计激活', dataIndex: 'driver_active_total', key: 'driver_active_total'}                    
                    ]
                },
                {
                    title: '司机接单',
                    children: [
                        {title: '有效听单司机数', dataIndex: 'effective_listening_driver_num', key: 'effective_listening_driver_num'},
                        {title: '派单司机数', dataIndex: 'dispatch_driver_num', key: 'dispatch_driver_num'},
                        {title: '中标司机数', dataIndex: 'win_bid_driver_num', key: 'win_bid_driver_num'},
                        {title: '活跃司机数', dataIndex: 'total_of_active_drivers', key: 'total_of_active_drivers'},
                        {title: '抢单率(%)', dataIndex: 'rate_of_accept', key: 'rate_of_accept'},
                        {title: '中标率(%)', dataIndex: 'rate_of_win_bid', key: 'rate_of_win_bid'}
                    ]
                },
                {
                    title: '服务时长及收入',
                    children: [
                        {title: '平均在线时长(h)', dataIndex: 'avg_online_time', key: 'avg_online_time'},
                        {title: '平均服务时长(h)', dataIndex: 'avg_service_time', key: 'avg_service_time'},
                        {title: '日均收入', dataIndex: 'avg_daily_income', key: 'avg_daily_income'},
                        {title: '在线小时收入', dataIndex: 'hours_online_income', key: 'hours_online_income'},
                        {title: '服务小时收入', dataIndex: 'hours_service_income', key: 'hours_service_income'},
                    ]
                }
            ],
            exportParams: {},
            flag: false,
            leasCompanies: [],
            leasCompaniesObj: {},
            leasCompaniesOption: [],
            leasCompaniesAllOption: [],
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
        this.getLeasCompaniesAllData();
    }
    componentDidMount(){
        this.setState({
            load:true
        },() => {
            this.getTableData();
        })
    }
    getLeasCompaniesAllData(){
        let  leasCompanies = JSON.parse(localStorage.getItem('leasCompanies'));
        if(leasCompanies){
            this.setState({
                leasCompaniesObj: leasCompanies,
                leasCompaniesAllOption: this.getLeasCompaniesAllOptionData(leasCompanies),
                leasCompaniesOption: this.getLeasCompaniesAllOptionData(leasCompanies)
            })

        }else {
            let result = getFun('/web_api/dim_info/city_company');
            result.then(res => {
                localStorage.setItem('leasCompanies',JSON.stringify(res.data));
                this.setState({
                    leasCompaniesObj: res.data,
                    leasCompaniesAllOption: this.getLeasCompaniesAllOptionData(res.data),
                    leasCompaniesOption: this.getLeasCompaniesAllOptionData(res.data)
                })
            })
        }
    }
    getLeasCompaniesAllOptionData(obj){
        let arr = [];
        Object.keys(obj).map(item => {
            arr.push(obj[item][0])
        })
        return arr;
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
            car_type_id: '',
            si_ji_fen_ceng: '',
            shuang_zheng_shen_he_zhuang_tai: ''
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
        console.log(params)
        this.setState({
            city: params.city,
            start_at: params.selectedStartDate,
            end_at: params.selectedEndDate,
            flag: true
        },() => this.getLeasCompaniesData())
    }
    getLeasCompaniesData(){
        let city = this.state.city.split(",");
        let leasCompanies = this.state.leasCompaniesObj;
        let arr = [];
        if(!city){
            this.setState({
                leasCompaniesOption: this.state.leasCompaniesAllOption
            })
        }else {
            city.map(item => {
                if(leasCompanies[item]){
                    arr.push(leasCompanies[item][0])
                }
            })
            this.setState({
                leasCompaniesOption: arr
            })
        }

    }
    // 获取车型参数
    carTypeChange(e) {
        let index = e.target.value;
        this.setState({
            car_type_id: this.state.carCombine[index].join(',')
        })
    }
    // 司机属性
    driverTypeChange(e) {
        let index = e.target.value;
        console.log(index)
        this.setState({
            si_ji_fen_ceng: this.state.driverCombine[index]
        })
    }
    // 司机证件
    certificateTypeChange(e) {
        let index = e.target.value;
        this.setState({
            shuang_zheng_shen_he_zhuang_tai: this.state.certificateCombine[index]
        })
    }
    // 获取订单类型、下单时间、预估里程参数
    // checkedBoxParams(params){
    //     this.setState({
    //         checkedParam: params
    //     })
    // }
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
        let arrStr = ['start_time', 'rate_of_active_drivers', 'rate_of_accept', 'rate_of_win_bid'];
        let searchParams = this.getParams();
        // let searchParam = Object.assign(searchParams,this.state.checkedParam);
        let result =getFun('/web_api/operation/driver',  searchParams);
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
            car_type_id: this.state.car_type_id,
            si_ji_fen_ceng: this.state.si_ji_fen_ceng,
            shuang_zheng_shen_he_zhuang_tai: this.state.shuang_zheng_shen_he_zhuang_tai,
            zu_lin_gong_si: this.state.leasCompanies.join(",")     // 租赁公司参数
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
                    // city = cityArr[cityArr.length - 1]
                    if(cityArr[0] == 'all'){
                        city = '';
                    }else {
                        city = cityArr.join(",")
                    }
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
    // 租赁公司搜索
    handleSearch(value){}
    // 租赁公司下拉框取值
    handleChange(value){
        this.setState({
            leasCompanies: value
        })
    }
    collapseClick(){
        this.setState({
            collapseFlag: !this.state.collapseFlag
        })
    }
    render() {
        let {title, carTypes, driverTypes, certificateTypes, load, tableHeader, total, pageSize, leasCompaniesOption,collapseFlag} = this.state;
        const radioChildren = Object.keys(carTypes).map((key, index) => {
            return <RadioButton key={key} value={key}>{carTypes[key]}</RadioButton>
        });
        const radioChildren0 = Object.keys(certificateTypes).map((key, index) => {
            return <RadioButton key={key} value={key}>{certificateTypes[key]}</RadioButton>
        });
        const radioChildren1 = Object.keys(driverTypes).map((key, index) => {
            return <RadioButton key={key} value={key}>{driverTypes[key]}</RadioButton>
        });
        let tableData = milliFormat(this.state.tableData);
        let optionData = leasCompaniesOption.map(item => {
            return <Option key={item.company_id} value={item.company_id}>{item.company_name}</Option>
        })
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
                                    <div className="cartype-wrapper">
                                        <label className="cartype-label">司机证件：</label>
                                        <RadioGroup onChange={this.certificateTypeChange.bind(this)} defaultValue='0'>
                                            {radioChildren0}
                                        </RadioGroup>
                                    </div>
                                    <div className="cartype-wrapper">
                                        <label className="cartype-label">司机属性：</label>
                                        <RadioGroup onChange={this.driverTypeChange.bind(this)} defaultValue='0'>
                                            {radioChildren1}
                                        </RadioGroup>
                                    </div>
                                    {/* <SearchCheckBox checkedBoxParams={params => this.checkedBoxParams(params)}></SearchCheckBox> */}
                                    <div className="cartype-wrapper">
                                        <label className="cartype-label">车型：</label>
                                        <RadioGroup onChange={this.carTypeChange.bind(this)} defaultValue='0' >
                                            {radioChildren}
                                        </RadioGroup>
                                        <p className="cartype-text">以司机注册车型筛选</p>
                                    </div>
                                    <div>
                                        <label className="cartype-label">租赁公司：</label>
                                        <Select
                                            mode="multiple"
                                            placeholder="请选择"
                                            showArrow={true}
                                            value={this.state.leasCompanies}
                                            style={{width: 300}}
                                            onSearch={this.handleSearch.bind(this)}
                                            filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                            onChange={this.handleChange.bind(this)}>
                                            {optionData}
                                        </Select>
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
                            <Table dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false} scroll={{x: '200%'}}>

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
export default CapacityAnalysis;