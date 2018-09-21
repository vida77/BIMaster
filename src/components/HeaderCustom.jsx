
import React, { Component } from 'react';
import {Icon, Layout, Avatar, Tabs, List, Modal } from 'antd';
import screenfull from 'screenfull';

import { connect } from 'react-redux';
import {initData} from '../store/index/action'

const { Header } = Layout;
const TabPane = Tabs.TabPane;

class HeaderCustom extends Component {
    constructor(props){
        super(props);
        this.state = {
            flag: false,
            userName: '',
            userID: 0,
            visible: false,
            messageFlag: false,
            visibleDetail: false,
            details:{},
            messageDataArr: [],
            messageData: [],
            collapsed: false
        };
    }
    componentWillMount(){

    }
    componentDidMount() {
        let _this = this;
        document.onclick=function(e){
            _this.setState({
                messageFlag: false
            })
            if(e.target.id === 'bell'){
                _this.setState({
                    messageFlag: true
                })
            }
        }
    };
    componentWillReceiveProps(nextProps) {
        let initDataFun = nextProps.initDataFun;
        let userInfo = initDataFun.userInfo;
        let informs = initDataFun.informs;
        if(userInfo){
            let userName = userInfo.name;
            if(userName){
                this.setState({
                    userName: userName,
                    userID: userInfo.id
                })
            }
        }else {
            this.setState({
                userName: '',
                collapsed: true
            })
        }
        if(informs && informs.length) {
            if(informs.length > 3){
                this.setState({
                    messageData: informs.slice(0,3)
                })
            }else {
                this.setState({
                    messageData: informs
                })
            }
        }
    }
    screenFull = () => {
        if (screenfull.enabled) {
            screenfull.request();
        }

    };
    menuClick = e => {
        e.key === 'logout' && this.logout();
    };
    logout = () => {
        localStorage.removeItem('user');
        this.props.history.push('/login')
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({ visible });
    };
    // 点击头部消息，显示消息列表
    bellClick(e){
        e.stopPropagation();
        this.setState({
            messageFlag: true
        })
    }

    // 头部消息通知弹出列表，TAB切换
    headerTabCallback(key){
    }
    // 点击公告查看详情
    messageDetailClick(item){
        this.setState({
            details: item,
            visibleDetail: true
        })
    }
    handleOk(){
        this.setState({
            visibleDetail: false
        });
    }
    render() {
        const {messageData, messageFlag, details, userName, collapsed} = this.state;
        let content = (
            <Tabs defaultActiveKey="1" onChange={this.headerTabCallback}>
                <TabPane tab="系统公告" key="1">
                    <List
                        itemLayout="horizontal"
                        dataSource={messageData}
                        renderItem={item => (
                            <List.Item actions={[<a onClick={this.messageDetailClick.bind(this, item)}>查看详情</a>]}>
                                <List.Item.Meta
                                    title={<span>{item.title}</span>}
                                    description={<span>{item.describe}</span>}
                                />
                            </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>
        )
        return (
            <Header style={{ background: '#fff', padding: 0, height: 65 }} className="custom-theme" >
                {

                        <Icon
                            className="trigger custom-trigger"
                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                }
                {userName?<p className="user-info"><Avatar icon="user" size="small"></Avatar><span className="username">{userName}</span></p>:''}
                {
                    userName?(<div className="popover-wrapper">
                        <a className="bell-wrapper"><Icon type="bell" className="bell" id="bell" onClick={this.bellClick.bind(this)}></Icon></a>
                        <div className={messageFlag? 'message-box active' : 'message-box'}>{content}</div>
                    </div>):''
                }
                    <Modal
                        className="details-modal"
                        title="公告详情"
                        visible={this.state.visibleDetail}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleOk.bind(this)}
                        bodyStyle={{height: 200}}
                        okText="关闭"
                    >
                        <div className="notice-wrapper ">
                            <p><span className="detail-title">标题：</span><span className="detail-title-txt">{details.title}</span></p>
                            <p><span className="detail-title">通告概要：</span><span className="detail-title-txt">{details.describe}</span></p>
                            <p><span className="detail-title">通告内容：</span><span className="detail-title-txt">{details.detail}</span></p>
                            <p><span className="detail-title">创建人：</span><span className="detail-title-txt">{details.create_name}</span></p>
                        </div>
                    </Modal>
                <style>{`
                    .popover-wrapper{
                        float: right;
                        margin-right: 10px;
                        position: relative;
                    }
                    .bell-wrapper{
                        color: #666;
                    }
                    .message-box{
                        width: 350px;
                        position: absolute;
                        top: 70px;
                        right: -100px;
                        display: none;
                        background: #fff;
                        box-shadow: 0 2px 8px rgba(0,0,0,.15);
                        border-radius: 5px;
                    }
                    .message-box.active {
                        display: block;
                        z-index: 100000000;
                    }
                    .message-box .ant-tabs-nav-scroll{
                        padding: 0 16px;
                    }
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -20px;
                    }
                    .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
                        margin-right: 0;
                    }
                    .ant-menu-horizontal {
                        border: none;
                    }
                    .ant-menu-item-group-title {
                        padding: 0;
                    }
                    .ant-menu-item-group {
                        border-bottom: 1px solid #ccc;
                    }
                    .ant-avatar-sm.ant-avatar-icon{
                        float: left;
                        margin: 20px 8px 0 0;
                    }
                    .bell{
                        float: right;
                        font-size: 20px;
                        line-height: 65px;
                        margin-right: 10px;
                    }
                    .username{
                        float: left;
                    }
                    .ant-popover-placement-bottom, .ant-popover-placement-bottomLeft, .ant-popover-placement-bottomRight{
                        width: 300px;
                        right: 20px;
                    }
                    .message-box .ant-tabs-bar{
                        margin: 0;
                    }
                    .ant-list-item{
                        padding: 12px 16px;
                    }
                    .ant-popover-inner-content .ant-tabs-nav-scroll{
                        padding: 0 12px;
                    }
                    .ant-list-item:hover {
                        background: #e6f7ff;
                    }
                    .ant-popover-inner-content{
                        padding: 12px 0 0 0;
                    }
                    .ant-tabs-nav-container,.ant-list-item-meta-title{
                        font-size: 14px;
                    }
                    .ant-list-item-action {
                        align-self: flex-end;
                    }
                    .ant-menu-submenu-popup{
                        top: 70px!important;
                    }
                    .notice-wrapper p{
                        margin-bottom: 0;
                    }
                    .notice-wrapper p:after{
                        content: ".";
                        visibility: hidden;
                        display: block;
                        height: 0;
                        clear: both;
                    }
                    .detail-title{
                        float: left;
                        width: 80px;
                        height: 40px;
                    }
                    .detail-title-txt {
                    }
                    .details-modal .ant-modal-footer .ant-btn{
                        visibility: hidden;
                    }
                    .details-modal .ant-modal-footer .ant-btn-primary{
                        visibility: visible;
                    }
                    .ant-layout p.user-info{
                        height: 65px;
                        float: right;
                        margin-right: 20px;
                        line-height: 65px;
                    }
                    .ant-list-item-action{
                        margin-left: 20px;
                    }
                `}</style>
            </Header>
        )
    }
}

export default connect(state => ({
    initDataFun: state.initDataFun,
}), {
    initData,
})(HeaderCustom);

// export default withRouter(connect()(HeaderCustom));
