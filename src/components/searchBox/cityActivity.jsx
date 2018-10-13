import React from 'react';
import {Select, DatePicker, Input} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initMenu} from '../../store/index/action'


import {getFun} from '../../utils/api'
import './searchBox.less';

const Option = Select.Option;

class CityActivity extends React.Component{
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            title: '',
            typeOptionData: ['活动ID','活动名称'],
            flag: false,
            id_value_state: '',
            name_value_state: '',
           
            city: [],
            cityOptionData: {},
            cityData: {},
            auth: {},
            defaultCity:['all'],
        };
    }
    componentWillMount() {
        let auth = JSON.parse(localStorage.getItem("auth"));
        if(auth){
            this.setState({
                auth: auth
            },() => this.getAllCityData())
        }
        this.setState({
            title: this.props.title,
            typeOptionData: this.props.typeOptionData
        })
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps) {
        if('defaultCity' in nextProps){
            this.setState({
                city: nextProps.defaultCity
            })
        }
        
        // if(nextProps.initDataFun){
        //     console.log(nextProps.initDataFun)
        //     this.setState({
        //         auth: nextProps.initDataFun.auth
        //     },() => this.getCityData())
        // }

    }
    
    getJsonLength(jsonData) {
        let length;
        for(let ever in jsonData) {
            length++;
        }
        return length;
    }
    getAllCityData(){
        let obj = localStorage.getItem('cityData');
        let objJson = JSON.parse(obj);
        console.log(objJson)
        if(objJson){
            if(Object.keys(objJson).length>1){
                objJson = Object.assign({"all": "全部"}, objJson);
                this.setState({
                    cityData: objJson
                },() => this.getCityData())
            }else{
                objJson = objJson;
                this.setState({
                    cityData: objJson
                },() => this.getCityData())
            }

        }else {
            let cityData = getFun('/web_api/dim_info/city');
            cityData.then( res => {
                localStorage.setItem('cityData', JSON.stringify(res.data));
                if(Object.keys(res.data).length>1){
                    let cityobj = Object.assign({"all": "全部"}, res.data);
                    this.setState({
                        cityData: cityobj
                    })
                }else{
                    let cityobj = res.data;
                    this.setState({
                        cityData: cityobj
                    })
                }

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
                id_value: this.state.id_value_state,
                name_value: this.state.name_value_state,
            }
            // this.setState({
            //     city: ''
            // })
            this.props.searchParams(param)
            console.log(param)
        }else {
            const param = {
                city: cityArr.join(","),
                id_value: this.state.id_value_state,
                name_value: this.state.name_value_state,
            }
            // this.setState({
            //     city: cityArr.join(","),
            // })
            this.props.searchParams(param)
            console.log(param)
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
    handleTypeChange(value) {
        if(value=='活动ID' || value=='优惠券ID'){
            this.setState({
                flag:false,
                name_value_state:'',
                id_value_state: ''
            });
        }else if(value=='活动名称' || value=='优惠券名称'){
            this.setState({
                flag:true,
                name_value_state:'',
                id_value_state: ''
            });
        }
    }
    searchNameChange(e){
        // console.log(e.target.value)
        if(!this.state.flag){//id
            const param = {
                id_value: e.target.value,
                name_value: this.state.name_value_state,
                city: this.state.city
            }
            this.setState({
                id_value_state: e.target.value,
            })
            this.props.searchParams(param)
        }else{//name
            const param = {
                name_value: e.target.value,
                id_value: this.state.id_value_state,
                city: this.state.city
            }
            this.setState({
                name_value_state: e.target.value,
            })
            this.props.searchParams(param)
        }
    }
    
    render() {
        const { typeOptionData, activityOptionData, title, cityOptionData} = this.state;
        // 活动筛选--下拉框2
        // let activityOption = [];
        // Object.keys(activityOptionData).map( (item) => {
        //     activityOption.push(<Option key={item}>{activityOptionData[item]}</Option>)
        // } )
        // 活动筛选--下拉框1
        let typeOptions = typeOptionData.map(item => <Option key={item}>{item}</Option>);
        // 城市筛选        
        let cityOption = [];
        Object.keys(cityOptionData).map( (item) => {
            cityOption.push(<Option key={item}>{cityOptionData[item]}</Option>)
        } )
        return (
            <div className="search-box-wrapper">
                <div className="city-select">
                    <label className="cartype-label" style={{float:'left',marginTop:8}}>城市：</label>
                    <Select
                        mode="multiple"
                        placeholder="请选择"
                        showArrow={true}
                        defaultValue={this.state.city}
                        value={this.state.city}
                        style={{width: 270}}
                        onSearch={this.handleSearch.bind(this)}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        onChange={this.handleChange.bind(this)}>
                        {cityOption}
                    </Select>
                </div>
                <div className="city-select">
                    <label className="cartype-label" style={{float:'left',marginTop:8}}>{title}：</label>
                    <Select 
                        defaultValue={this.state.typeOptionData[0]} 
                        style={{ width: 110 , float:'left'}}
                        onChange={this.handleTypeChange.bind(this)}>
                        {typeOptions}
                    </Select>
                    <Input type="text" placeholder="" defaultValue="" onChange={this.searchNameChange.bind(this)} style={{width: '160px'}}/>
                    {/* <Select
                        mode="multiple"
                        placeholder="请选择"
                        showArrow={true}
                        defaultValue={this.state.activity}
                         value={this.state.activity}
                        style={{width: 200, float:'left'}}
                        onSearch={this.handleSearch.bind(this)}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        onChange={this.searchNameChange.bind(this)}>
                        {activityOption}
                    </Select> */}
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
})(CityActivity);