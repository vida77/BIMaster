import React, { Component } from 'react';
import { Layout, LocaleProvider } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initToggle} from './store/index/action'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import Routes from './routes';
import {getFun} from './utils/api'
import NoticeBox from "./components/noticeBox";
const { Content, Footer } = Layout;

class App extends Component {
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state = {
            collapsed: false
        };
    }

    componentWillMount() {
        this.getInitData();
        this.getCityData();
    }
    componentDidMount(){
    }
    getInitData(){
        let initData = getFun('/index/init');
        initData.then(res => {
            this.props.initData(res.data);
            localStorage.setItem("auth",JSON.stringify(res.data.auth))
            localStorage.setItem("userInfo",JSON.stringify(res.data.userInfo))
            // localStorage.setItem("switchInfo",JSON.stringify(res.data.switchInfo))
        })

    }
    getCityData(){
        let objJson = JSON.parse(localStorage.getItem('cityData'));
        if(!objJson){
            let cityData = getFun('/web_api/dim_info/city');
            cityData.then( res => {
                console.log(res.data)
                localStorage.setItem('cityData', JSON.stringify(res.data));
            })
        }
    }
    toggle = () => {
        let flag = !this.state.collapsed;
        this.setState({
            collapsed: flag,
        });
        this.props.initToggle(flag);
    };
    render() {
        return (
            <LocaleProvider locale={zhCN}>

            <Layout>
                {/* <NoticeBox ></NoticeBox> */}
                <SiderCustom collapsed={this.state.collapsed} />
                <Layout style={{flexDirection: 'column'}}>
                    <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} />
                    <Content style={{ margin: '0 16px', overflow: 'initial' }}>
                        <Routes collapsed={this.state.collapsed}/>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                    ©2018 易到大数据中心
                    </Footer>
                </Layout>
                
                {/* {
                    responsive.data.isMobile && (   // 手机端对滚动很慢的处理
                        <style>
                        {`
                            #root{
                                height: auto;
                            }
                        `}
                        </style>
                    )
                } */}
            </Layout>
            </LocaleProvider>
        );
    }
}
export default connect(state => ({
    initDataFun: state.initDataFun,
    initDataToggle: state.initDataToggle
}), {
    initData,
    initToggle
})(App);