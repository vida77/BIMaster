import React, {Component} from 'react';
import {Row, Col, Card, DatePicker, Select} from 'antd';
import moment from 'moment';
import dateFormat from '../../utils/dateFormat';
import TimeLineChart from '../../components/chart/realTimeOrder';
import {getFun} from '../../utils/api';
import CitySelect from '../../components/searchBox/citySelect'

import './realtime.less';

const today = dateFormat(new Date(), 'yyyy-MM-dd');
const Option = Select.Option;
const topColResponsiveProps = {
    xs: 24,
    sm: 24,
    md: 4,
    lg: 4,
    xl: 4,
    style: {marginBottom: 24},
};

class ColItem extends Component{

    render() {
        return (
            <Col {...topColResponsiveProps} >
                <Card>
                    <p>{this.props.chNAME}</p>
                    <p className="num">{this.props.orderData[this.props.enNAME]}
                        {this.props.sign ? '%' : ''}
                    </p>
                </Card>
            </Col>

        )
    }
}

export default class RealTimeOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stat_date: today,
            car_type: '',
            order_type: '',
            date_type: 'day',
            dateType: [
                {value: 'day', text: '当日'},
                {value: 'week', text: '周'},
                {value: 'month', text: '月'}
            ],
            serverType: [
                {value: '', text: '全部'},
                {value: '17', text: 'asap'},
                {value: '0', text: '预约'}
            ],
            carType: [
                {value: '', text: '全部车型'},
                {value: '37', text: 'Young'},
                {value: '2', text: '舒适车型'},
                {value: '5', text: '商务车型'},
                {value: '3', text: '豪华车型'},
                {value: '75', text: '易来车型'},
                {value: '999', text: '其他车型'}

            ],

            orderCountField: [
                {order_dispatch_cnt: '派发订单数'},
                {order_accept_cnt: '有车接单数'},
                {order_cancel_cnt_before_accept: '接单前取消数'},
                {order_cancel_cnt_after_accept: '接单后取消数'},
                {order_finish_cnt: '订单完成数'}

            ],
            orderPercentField: [
                {order_accept_rate: '接单率'},
                {order_dispatch_success_rate: '派单成功率'},
                {order_cancel_rate_before_accept: '接单前取消率'},
                {order_cancel_rate_after_accept: '接单后取消率'},
                {order_finish_rate: '订单完成率'}
            ],
            orderData: {
                "order_dispatch_cnt": '--',
                "order_accept_rate": '--',
                "order_accept_cnt": '--',
                "order_dispatch_success_rate": '--',
                "order_cancel_cnt_before_accept": '--',
                "order_cancel_rate_before_accept": '--',
                "order_cancel_cnt_after_accept": '--',
                "order_cancel_rate_after_accept": '--',
                "order_finish_cnt": '--',
                "order_finish_rate": '--'
            },
            sourceData: null,
            freshFlag: true,
            city: '',
            cityFlag: false,
        };

        this.Timer = null;
    }
    componentWillMount() {
        let city = this.getCityParams();
        this.setState({
            city: city
        })
    }
    componentDidMount() {
        this.getRealtime();
        this.Timer = setInterval(() => {
            this.getRealtime();
        }, 1000 * 60);
    }
    componentWillUnmount() {
        window.clearInterval(this.Timer);
    }
    componentWillReceiveProps(nextProps) {
        this.getRealtime();
    }
    getRealtime() {
        if (this.state.stat_date === today) {
            this.getOrderData();
            this.setState({
                freshFlag: true
            })
        } else {
            if (this.state.freshFlag) {
                this.getOrderData();
                this.setState({
                    freshFlag: false
                })
            }
        }
        this.getOrderChart();
    }

    getOrderData() {
        console.log(this.state.order_type)
        let result = getFun('/web_api/realtime/order', {
            action: 'now',
            // stat_date: this.state.stat_date,
            car_type: this.state.car_type,
            order_type: this.state.order_type,
            // data_type: this.state.date_type,
            city_key: this.state.cityFlag?this.state.city:this.getCityParams(),
        })
        result.then(data => {
            this.setState({
                orderData: data.data
            })
        }).catch(errCode => {
            window.clearInterval(this.Timer);
        });
    }

    getOrderChart() {
        this.setState({
            loading: true
        });

        let result = getFun('/web_api/realtime/order', {
            action: 'chart',
        })
        result.then(data => {
            this.setState({
                sourceData: data.data,
                loading: false
            })
        }).catch(errCode => {
            window.clearInterval(this.Timer);
        });
    }

    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    handleChangeDate(date, dateString) {
        const that = this;
        this.setState({
            stat_date: dateString
        }, () => that.getOrderData())
    }

    handleServerChange(value, type) {
        console.log(value,type)
        const that = this;
        if (type === 0) { //服务类型
            that.setState({
                order_type: value
            // }, () => console.log(this.state.order_type))
            }, () => that.getOrderData())
        } else if (type === 1) { //车型
            that.setState({
                car_type: value
            }, () => that.getOrderData())
        } else { //日期
            that.setState({
                date_type: value
            }, () => that.getOrderData())
        }
    }
    // 获取下拉框组件参数
    thisSearchParams(params){
        this.setState({
            city: params.city,
            cityFlag: true
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

    render() {
        const {loading} = this.state;
        return (
            <div>
                <div className="summary-num">
                    <div className="sum-search">
                        
                        <Select value={this.state.order_type} style={{width: 120}}
                                onChange={(val) => this.handleServerChange(val, 0)}>
                            {
                                this.state.serverType.map((item, index) => {

                                    return <Option key={item.text} value={item.value}>{item.text}</Option>
                                })
                            }
                        </Select>
                        <Select value={this.state.car_type} style={{width: 120}}
                                onChange={(val) => this.handleServerChange(val, 1)}>
                            {
                                this.state.carType.map((item, index) => {

                                    return <Option key={item.text} value={item.value}>{item.text}</Option>
                                })
                            }
                        </Select>

                        <CitySelect searchParams={params => this.thisSearchParams(params)} style={{}}></CitySelect>
                    
                        {/* <DatePicker
                            disabledDate={this.disabledDate.bind(this)}
                            allowClear={false}
                            value={moment(this.state.stat_date, 'YYYY-MM-DD')}
                            onChange={this.handleChangeDate.bind(this)}/> */}

                        {/*<div class="check-day">*/}
                        {/*<span class="check-l hand" onClick={() => this.handleDate(7)}>7天</span>*/}
                        {/*<span class="check-r hand" onClick={() => this.handleDate(30)}>30天</span>*/}
                        {/*</div>*/}

                        {/* <Select value={this.state.date_type} style={{width: 120}}
                                onChange={(val) => this.handleServerChange(val, 2)}>
                            {
                                this.state.dateType.map((item, index) => {

                                    return <Option key={item.text} value={item.value}>{item.text}</Option>
                                })
                            }
                        </Select> */}

                    </div>

                    <Row className="row" type="flex" justify="space-between">
                        {

                            this.state.orderCountField.map((data, index) => {
                                var enName = Object.keys(data)[0];
                                var chName = data[enName];
                                return <ColItem key={index} enNAME={enName} chNAME={chName} orderData={this.state.orderData}>

                                </ColItem>
                            })
                        }
                    </Row>

                    <Row className="row" type="flex" justify="space-between">
                        {

                            this.state.orderPercentField.map((data, index) => {
                                var enName = Object.keys(data)[0];
                                var chName = data[enName];
                                return <ColItem key={index} enNAME={enName} chNAME={chName} orderData={this.state.orderData} sign={'%'}>

                                </ColItem>
                            })
                        }

                    </Row>
                </div>
                <Card
                    loading={loading}
                    bordered={false}
                    bodyStyle={{padding: 24}}
                    className="summary-chart"
                >
                    <TimeLineChart data={this.state.sourceData} desc={this.state.orderCountField}/>

                </Card>
            </div>
        )
    }
}