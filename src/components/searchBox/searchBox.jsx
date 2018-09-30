import React from 'react';
import {Select, DatePicker} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initMenu} from '../../store/index/action'


import {getFun} from '../../utils/api'
import './searchBox.less';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

class SearchBox extends React.Component{
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            city: [],
            selectedStartDate: '',
            selectedEndDate: '',
            dayNum: 10,
            cityOptionData: {},
            cityData: {},
            auth: {}
        };
    }
    componentWillMount() {
        this.initDateRange(this.state.dayNum);//初始化查询日期
        let auth = JSON.parse(localStorage.getItem("auth"));
        if(auth){
            this.setState({
                auth: auth
            },() => this.getAllCityData())
        }
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps) {
        // if(nextProps.initDataFun){
        //     console.log(nextProps.initDataFun)
        //     this.setState({
        //         auth: nextProps.initDataFun.auth
        //     },() => this.getCityData())
        // }
    }
    //初始化查询起止日期
    initDateRange(rangeDays) {
        //时间类型为moment格式
        this.setState({
            selectedEndDate: moment().subtract(1, 'days'), //当前时间
            selectedStartDate: moment().subtract(rangeDays, 'days'), //当前时间减n天
        });

    }
    getAllCityData(){
        let obj = localStorage.getItem('cityData');
        let objJson = JSON.parse(obj);
        if(objJson){
            objJson = Object.assign({"all": "全部"}, objJson);
            this.setState({
                cityData: objJson
            },() => this.getCityData())

        }else {
            let cityData = getFun('/web_api/dim_info/city');
            cityData.then( res => {
                console.log(res.data)
                localStorage.setItem('cityData', JSON.stringify(res.data));
                let cityobj = Object.assign({"all": "全部"}, res.data);
                this.setState({
                    cityData: cityobj
                })

            })
        }
    }
    getCityData(){
        let auth = this.state.auth;
        let arr = Object.keys(auth);
        if(arr.indexOf("-1") > -1){
            this.setState({
                cityOptionData: this.state.cityData,
                city: ['all']
            })
        }else {
            let _this = this;
            let cityObj = this.state.auth;
            let path = document.location.toString();
            let pathUrl = path.split('#');
            let url = pathUrl[1].split('/');
            let strurl = url[url.length - 1];
            Object.keys(cityObj).map(item => {
                if(item.indexOf(strurl) > 0){
                    let cityData = cityObj[item].city;
                    if(cityData.indexOf('all') > -1){
                        _this.setState({
                            cityOptionData: _this.state.cityData,
                            city: ['all']
                        })
                    }else {
                        let cityStr = _this.state.cityData;
                        let str = {};
                        cityData.map(item => {
                            let strr = {"all": "全部"};
                            let keyStr = item;
                            strr[keyStr] = cityStr[item];
                            str = Object.assign(strr, str)
                        })

                        this.setState({
                            cityOptionData: str,
                            // city: cityStr[cityData[cityData.length-1]].toString()
                            city: ['all']
                        })
                        const start = new Date((moment(this.state.selectedStartDate).subtract())._d);
                        const end = new Date((moment(this.state.selectedEndDate).subtract())._d);

                        const param = {
                            city: cityData.join(","),
                            selectedStartDate: this.formatDate(start),
                            selectedEndDate: this.formatDate(end)
                        }
                        this.props.searchParams(param)
                    }
                }
            })
        }
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
        let cityArr = this.getCityArr(value);
        const start = new Date((moment(this.state.selectedStartDate).subtract())._d);
        const end = new Date((moment(this.state.selectedEndDate).subtract())._d);
        if(cityArr[0] == 'all'){
            const param = {
                city: '',
                selectedStartDate: this.formatDate(start),
                selectedEndDate: this.formatDate(end)
            }
            this.props.searchParams(param)
        }else {
            const param = {
                city: cityArr.join(","),
                selectedStartDate: this.formatDate(start),
                selectedEndDate: this.formatDate(end)
            }
            this.props.searchParams(param)
        }


    }
    getCityArr(value){
        let length = value.length - 1;
        let index = value.indexOf("all");
        let arr = [];
        if(index == -1){
            arr = value;
            this.setState({
                city: value
            })
        }else if(index === 0 && index < length) {
            arr = value.slice(index+1)
            this.setState({
                city: value.slice(index+1)
            })
        }else if(index === length){
            arr = ["all"]
            this.setState({
                city: ["all"]
            })
        }
        return arr;
    }
    handleSearch(value){

    }
    handlePickerChange(dates, dateStrings) {
        this.setState({
            selectedStartDate: dates[0],
            selectedEndDate: dates[1]
        })
        let city = this.state.city;
        let a = '';
        if(city[0] == 'all'){
            a = ''
        }else {
            a = city
        }
        const param = {
            city: a,
            selectedStartDate: dateStrings[0],
            selectedEndDate: dateStrings[1]
        }
        this.props.searchParams(param)
    }
    disabledDate(current) {
        return current && current > moment().subtract(1, 'days')
    }
    render() {
        const { cityOptionData, selectedStartDate,  selectedEndDate} = this.state;
        let cityOption = [];
        Object.keys(cityOptionData).map( (item) => {
            cityOption.push(<Option key={item}>{cityOptionData[item]}</Option>)
        } )
        return (
            <div className="search-box-wrapper">
                <div className="city-select">
                    <label className="cartype-label">城市：</label>
                    <Select
                        mode="multiple"
                        placeholder="请选择"
                        showArrow={true}
                        defaultValue={this.state.city}
                        value={this.state.city}
                        style={{width: 282}}
                        onSearch={this.handleSearch.bind(this)}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        onChange={this.handleChange.bind(this)}>
                        {cityOption}
                    </Select>
                </div>
                <div className="time-range">
                    <label className="cartype-label">时间范围：</label>
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
})(SearchBox);