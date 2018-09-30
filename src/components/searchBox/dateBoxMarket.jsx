import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initMenu} from '../../store/index/action'


import {getFun} from '../../utils/api'
import './searchBox.less';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

class DateBoxMarket extends React.Component{
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            selectedStartDate: '',
            selectedEndDate: '',
            dayNum: 60,
        };
    }
    componentWillMount() {
        this.initDateRange(this.state.dayNum);//初始化查询日期
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps) {
        
    }
    //初始化查询起止日期
    initDateRange(rangeDays) {
        //时间类型为moment格式
        this.setState({
            selectedEndDate: moment().subtract(1, 'days'), //当前时间
            selectedStartDate: moment().subtract(rangeDays, 'days'), //当前时间减n天
        });

    }
    
    formatDate (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };
    handleChange(value){
        const start = new Date((moment(this.state.selectedStartDate).subtract())._d);
        const end = new Date((moment(this.state.selectedEndDate).subtract())._d);
        const param = {
            selectedStartDate: this.formatDate(start),
            selectedEndDate: this.formatDate(end)
        }
        this.props.searchParams(param)
        console.log(param)
    }
    
    handleSearch(value){

    }
    handlePickerChange(dates, dateStrings) {
        this.setState({
            selectedStartDate: dates[0],
            selectedEndDate: dates[1]
        })
        const param = {
            selectedStartDate: dateStrings[0],
            selectedEndDate: dateStrings[1]
        }
        this.props.searchParams(param)
    }
    disabledDate(current) {
        return current && current > moment().subtract(1, 'days')
    }
    render() {
        const { selectedStartDate,  selectedEndDate} = this.state;
        return (
            <div className="search-box-wrapper">
                <div className="time-range">
                    {/* <label>日期：</label> */}
                    <RangePicker
                        value={[selectedStartDate, selectedEndDate]}
                        format={dateFormat}
                        onChange={this.handlePickerChange.bind(this)}
                        disabledDate={this.disabledDate.bind(this)}
                    />
                </div>
            </div>
        )
    }
}
export default connect(state => ({
    initDataFun: state.initDataFun,
}), {
    initData,
    initMenu
})(DateBoxMarket);