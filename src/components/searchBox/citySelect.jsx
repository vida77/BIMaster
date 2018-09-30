import React from 'react';
import {Select} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initMenu} from '../../store/index/action'


import {getFun} from '../../utils/api'
import './searchBox.less';

const Option = Select.Option;

class CitySelect extends React.Component{
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            city: [],
            cityOptionData: {},
            cityData: {},
            auth: {}
        };
    }
    componentWillMount() {
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

                        const param = {
                            city: cityData.join(","),
                        }
                        this.props.searchParams(param)
                    }
                }
            })
        }
    }
    
    handleChange(value){
        let cityArr = this.getCityArr(value);
        if(cityArr[0] == 'all'){
            const param = {
                city: '',
            }
            this.props.searchParams(param)
        }else {
            const param = {
                city: cityArr.join(","),
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
    render() {
        const { cityOptionData} = this.state;
        let cityOption = [];
        Object.keys(cityOptionData).map( (item) => {
            cityOption.push(<Option key={item}>{cityOptionData[item]}</Option>)
        } )
        return (
            <div className="search-box-wrapper">
                <div className="city-select">
                    <label className="cartype-label" style={{width:'42px'}}>城市：</label>
                    <Select
                        mode="multiple"
                        placeholder="请选择"
                        showArrow={true}
                        defaultValue={this.state.city}
                        value={this.state.city}
                        style={{width: 300}}
                        onSearch={this.handleSearch.bind(this)}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        onChange={this.handleChange.bind(this)}>
                        {cityOption}
                    </Select>
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
})(CitySelect);