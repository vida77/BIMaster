

import React, {Component} from 'react';
import {Row, Col, Card, Tabs, DatePicker,Select} from 'antd';
import moment from 'moment';
import dateFormat from '../../utils/dateFormat';
import RealSummaryChart from '../../components/chart/realTime';
import {getFun} from '../../utils/api';
import CitySelect from '../../components/searchBox/citySelect'
import SwitchButton from '../../components/searchBox/switchButton'

import './realtime.less';


const TabPane = Tabs.TabPane;
const Option = Select.Option;
const today = dateFormat(new Date(), 'yyyy-MM-dd');
const CustomTab = ({data, currentTabKey: currentKey}) => (

    <Row>
        <Col>
            <Card>
                <p className="num">{data.num}</p>
                <p>{data.name}</p>
            </Card>
        </Col>
    </Row>
);

export default class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: true,
            loading: true,
            currentTabKey: '0',
            summaryType: [
                {name: '创建订单数', tabKey: '0', num: '--', cntName: 'order_create_cnt'},
                {name: '派发订单数', tabKey: '1', num: '--', cntName: 'order_dispatch_cnt'},
                {name: '有车接单数', tabKey: '2', num: '--', cntName: 'order_accept_cnt'},
                {name: '订单完成数', tabKey: '3', num: '--', cntName: 'order_finish_cnt'}
            ],
            startDate: today,
            freshFlag: true,
            city: '',
            cityFlag: false,

            stat_date: today,
            car_type: '',
            order_type: '',
            // date_type: 'day',
            // dateType: [
            //     {value: 'day', text: '当日'},
            //     {value: 'week', text: '周'},
            //     {value: 'month', text: '月'}
            // ],
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
            switchBoolean: false
        };
        this.Timer = null;
    }
    componentWillMount(){
       
    }
    componentDidMount() {
        this.getRealtime();
        this.Timer = setInterval(() => {
            this.getRealtime();
        }, 1000 * 60);
    }
    componentWillReceiveProps(nextProps) {
        this.getRealtime();
    }
    componentWillUnmount() {
        window.clearInterval(this.Timer);
    }

    getRealtime() {
        if (today === this.state.startDate) {
            this.getSummaryChart();
            this.setState({
                freshFlag: true
            })
        } else {
            if (this.state.freshFlag) {
                this.getSummaryChart();
                this.setState({
                    freshFlag: false
                })

            }
        }
        this.getSummary();
    }

    getSummary() {
        let result = getFun('/web_api/realtime/summary', {
            action: 'now',
            stat_date: this.state.stat_date,
            car_type: this.state.car_type,
            order_type: this.state.order_type,
            city_key: this.state.cityFlag?this.state.city:this.getCityParams(),
        })
        result.then(data => {
            let _summary = this.state.summaryType;
            _summary.forEach(function (item, index) {
                _summary[index].num = data.data[_summary[index].cntName];
            });
            this.setState({
                summaryType: _summary
            });
        }).catch(errCode => {
            window.clearInterval(this.Timer);
        });
    }

    getSummaryChart() {
        this.setState({
            loading: true
        });

        let result = getFun('/web_api/realtime/summary', {
            action: 'chart',
            stat_date: this.state.startDate,
            index_key: this.state.summaryType[this.state.currentTabKey].cntName,
        })
        result.then(data => {
            let _summary = this.state.summaryType;
            _summary[this.state.currentTabKey].chart = data.data;
            this.setState({
                summaryType: _summary,
                loading: false
            })
        }).catch(errCode => {
            window.clearInterval(this.Timer);
        });
    }

    handleTabChange(key) {
        this.setState({
            currentTabKey: key,
        }, () => {
            this.getSummaryChart()
        });
    }

    handleChangeDate(date, dateString) {
        this.setState({
            startDate: dateString
        }, () => this.getSummaryChart())

    }
    handleServerChange(value, type) {
        const that = this;
        if (type === 0) { //服务类型
            that.setState({
                order_type: value
            }, () => that.getSummary())
        } else if (type === 1) { //车型
            that.setState({
                car_type: value
            }, () => that.getSummary())
        } else { //日期
            that.setState({
                date_type: value
            }, () => that.getSummary())
        }
    }
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    // 获取下拉框组件参数
    thisSearchParams(params){
        this.setState({
            city: params.city,
            cityFlag: true
        })
    }
    // 获取倍率开关布尔参数
    switchSearchParams(params){
        // console.log(params)
        this.setState({
            switchBoolean: !params.switchBoolean
        },() => {
            this.getRealtime();
        },console.log(this.state.switchBoolean))
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
        const {currentTabKey, loading} = this.state;

        const activeKey = currentTabKey;
        return (
            <div className="survey-wrapper">
            {/* <SwitchButton searchParams={params => this.switchSearchParams(params)}></SwitchButton> */}
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

                        <CitySelect searchParams={params => this.thisSearchParams(params)}></CitySelect>
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
                                onChange={(val) => this.handleServerChange(val, '2')}>
                            {
                                this.state.dateType.map((item, index) => {

                                    return <Option key={item.text} value={item.value}>{item.text}</Option>
                                })
                            }
                        </Select> */}

                    </div>
                    <Tabs className='tab_nav_summary'
                          activeKey={activeKey}
                          onChange={this.handleTabChange.bind(this)}
                    >

                        {
                            this.state.summaryType.map(item => (
                                <TabPane
                                    tab={<CustomTab data={item} currentTabKey={activeKey}/>}
                                    key={item.tabKey}
                                >
                                    <div>
                                        <Card bordered={false} bodyStyle={{padding: 24}} loading={loading}>
                                            {/* <DatePicker className="cal-sum"
                                                        disabledDate={this.disabledDate.bind(this)}
                                                        allowClear={false}
                                                        value={moment(this.state.startDate, 'YYYY-MM-DD')}
                                                        onChange={this.handleChangeDate.bind(this)}/> */}
                                            <RealSummaryChart data={item.chart} height={450} currentTabKey={activeKey}/>
                                        </Card>
                                    </div>
                                </TabPane>

                            ))
                        }
                    </Tabs>
                </div>
            </div>

        )
    }
}