import React from 'react';
import {Radio, Checkbox} from 'antd';

import './searchBox.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;


const plainOptions = ['早高峰[8, 11)', '平峰[11, 17)', '晚高峰[17, 20)', '夜间'];
const plainOptions1 = ['[0, 5)', '[5, 10)', '[10, 15)', '[15, 20)', '[20, +)'];
const obj = {
    "早高峰[8, 11)": "morning",
    "平峰[11, 17)": "noon",
    "晚高峰[17, 20)": "afternoon",
    "夜间": "night"
}
const obj1 = {
    "[0, 5)": "a0-5km",
    "[5, 10)": "b5-10km",
    "[10, 15)": "c10-15km",
    "[15, 20)": "d15-20km",
    "[20, +)": "eglt20km"
}
class SearchCheckBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            orderType: {
                0: "全部",
                1: "即时订单",
                2: "预约订单"
            },
            orderTypeNum: {
                0: '',
                1: 1,
                2: 0
            },
            is_asap: '',
            checkAll: true,
            indeterminate: false,
            checkedList: plainOptions,
            checkAll1: true,
            indeterminate1: false,
            checkedList1: plainOptions1,
            order_peak_type: '',
            estimate_distance: ''
        }
    }
    componentWillMount(){
        let arr = Object.values(obj);
        let arr1 = Object.values(obj1);
        this.setState({
            order_peak_type: arr.join(","),
            estimate_distance: arr1.join(",")
        })

    }
    componentDidMount(){
        let params = {
            is_asap: this.state.is_asap,
            order_peak_type: this.state.order_peak_type,
            estimate_distance: this.state.estimate_distance
        }
        this.props.checkedBoxParams(params)
    }
    orderTypeChange(e){
        let index = e.target.value;
        this.setState({
            is_asap: this.state.orderTypeNum[index]
        })
        let params = {
            is_asap: this.state.orderTypeNum[index],
            order_peak_type: this.state.order_peak_type,
            estimate_distance: this.state.estimate_distance
        }
        this.props.checkedBoxParams(params)
    }
    onChange = (checkedList) => {
        let arr = [];
        checkedList.map(item => {
            arr.push(obj[item]);
        })
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
            order_peak_type: arr.join(",")
        },()=>this.postParams());
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
        if(e.target.checked){
            this.setState({
                order_peak_type: ''
            })
        }else {
            let arr = Object.values(obj);
            this.setState({
                order_peak_type: arr.join(",")
            })
        }
        this.postParams();
    }
    onChange1 = (checkedList1) => {
        let arr = [];
        checkedList1.map(item => {
            arr.push(obj1[item]);
        })
        this.setState({
            checkedList1,
            indeterminate1: !!checkedList1.length && (checkedList1.length < plainOptions1.length),
            checkAll1: checkedList1.length === plainOptions1.length,
            estimate_distance: arr.join(",")
        },()=>this.postParams());

    }

    onCheckAllChange1 = (e) => {
        this.setState({
            checkedList1: e.target.checked ? plainOptions1 : [],
            indeterminate1: false,
            checkAll1: e.target.checked,
        });
        if(e.target.checked){
            this.setState({
                estimate_distance: ''
            })
        }else {
            let arr = Object.values(obj1);
            this.setState({
                estimate_distance: arr.join(",")
            })
        }
        this.postParams();
    }
    postParams(){
        let params = {
            is_asap: this.state.is_asap,
            order_peak_type: this.state.order_peak_type,
            estimate_distance: this.state.estimate_distance
        }
        this.props.checkedBoxParams(params)
    }
    render(){
        const {orderType} = this.state;
        const radioChildren = Object.keys(orderType).map(item => {
            return <RadioButton key={item} value={item}>{orderType[item]}</RadioButton>
        })
        return(
            <div className="check-box-wrapper">
                <div className="order-type" style={{marginTop: '20px'}}>
                    <label className="cartype-label">订单类型：</label>
                    <RadioGroup onChange={this.orderTypeChange.bind(this)} defaultValue='0'>
                        {radioChildren}
                    </RadioGroup>
                </div>
                <div className="order-time"  style={{marginTop: '20px', padding: '7px 0'}}>
                    <label className="cartype-label">下单时间：</label>
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                    >全部</Checkbox>
                    <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange}>
                    </CheckboxGroup>
                </div>
                <div className="order-time"  style={{marginTop: '20px', padding: '7px 0'}}>
                    <label className="cartype-label">预估里程：</label>
                    <Checkbox
                        indeterminate={this.state.indeterminate1}
                        onChange={this.onCheckAllChange1}
                        checked={this.state.checkAll1}
                    >全部</Checkbox>
                    <CheckboxGroup options={plainOptions1} value={this.state.checkedList1} onChange={this.onChange1}>
                    </CheckboxGroup>
                </div>
            </div>
        )
    }
}
export default SearchCheckBox;