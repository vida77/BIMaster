import React from 'react';
import {Switch} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initMenu} from '../../store/index/action'


import {getFun} from '../../utils/api'
import './searchBox.less';

class SwitchButton extends React.Component{
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            auth: {},
            showFlag: true,
        };
    }
    componentWillMount() {
        // let auth = JSON.parse(localStorage.getItem("auth"));
        // let switchInfo = JSON.parse(localStorage.getItem("switchInfo"));
        // if(switchInfo){
        //     this.setState({
        //         auth: auth,
        //         showFlag: true
        //     },)
        // }else{
        //     this.setState({
        //         showFlag: false
        //     })
        // }
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
    handleChange(value){
        const param = {
            switchBoolean: value,
        }
        console.log(param)
        this.props.searchParams(param)
    }
    render() {
        const {showFlag} = this.state;
        return (
            <div className={showFlag?"switch-wrapper active": "switch-wrapper"}>
                <label className="cartype-label" style={{marginLeft:'10px',marginRight:'10px'}}>倍率开关</label>
                <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.handleChange.bind(this)}/>
            </div>
        )
    }
}
export default connect(state => ({
    initDataFun: state.initDataFun,
}), {
    initData,
    initMenu
})(SwitchButton);