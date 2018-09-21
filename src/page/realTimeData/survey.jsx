

import React, {Component} from 'react';
import {Row, Col, Card, Tabs, DatePicker} from 'antd';
import moment from 'moment';
import dateFormat from '../../utils/dateFormat';
import RealSummaryChart from '../../components/chart/realTime';
import {getFun} from '../../utils/api';

import './realtime.less';


const TabPane = Tabs.TabPane;

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
            freshFlag: true
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

    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    render() {
        const {currentTabKey, loading} = this.state;

        const activeKey = currentTabKey;
        return (
            <div>
                <div className="summary-num">
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
                                            <DatePicker className="cal-sum"
                                                        disabledDate={this.disabledDate.bind(this)}
                                                        allowClear={false}
                                                        value={moment(this.state.startDate, 'YYYY-MM-DD')}
                                                        onChange={this.handleChangeDate.bind(this)}/>
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