
import React, {Component} from 'react';
import { Button, notification, Icon, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData} from '../store/index/action'


class NoticeBox extends Component {
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state = {
            visibleDetail: false,
            details: {},
            notificationData: []
        };
    }

    componentWillMount(){
    }
    componentDidMount() {
        this.handleClickBtn();

        // clearTimeout(t);
    }
    componentWillReceiveProps(nextProps) {
        notification.destroy();
        let initDataFun = nextProps.initDataFun;
        let informs = initDataFun.informs;
        if(informs && informs.length) {
            if(informs.length > 5){
                this.setState({
                    notificationData: informs.slice(0,4)
                })
            }else {
                this.setState({
                    notificationData: informs
                })
            }
            this.handleClickBtn();
        }else {
            this.setState({
                notificationData: []
            },()=>this.handleClickBtn())
        }
    }
    close() {
    };
    notificationClick(item){
        // notification.close(item.id);
        this.setState({
            details: item,
            visibleDetail: true
        })
    }
    openNotification() {
        let {notificationData} = this.state;
        let _this = this;
        notificationData.map((item, index) => {
            const key = item.id;
            const btn = (
                <div>
                    {/*<Button type="primary" size="small" onClick={() => notification.close(key)}>*/}
                    {/*关闭*/}
                    {/*</Button>*/}
                    <Button type="primary" className='checkMore' size="small" onClick={this.notificationClick.bind(this, item) }>
                        点击查看
                    </Button>
                </div>
            );
            notification.open({
                message: item.title,
                description: item.describe,
                icon: <Icon type="info-circle-o" style={{ color: '#108ee9' }} />,
                btn,
                key,
                duration: null,
                onClose: _this.close,
            });
        })

    }
    handleOk(){
        this.setState({
            visibleDetail: false
        });
    }
    handleClickBtn(){
        let _this = this;
        let t = setTimeout(function(){
            _this.openNotification();
        },10);

    }
    render() {
        const {details} = this.state;

        return (
            <div>
                <Button className="notification-btn" onClick={this.handleClickBtn.bind(this)}></Button>
                <Modal
                    className="details-modal"
                    title="公告详情"
                    visible={this.state.visibleDetail}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleOk.bind(this)}
                    bodyStyle={{height: 200}}
                    okText="关闭"
                >
                    <div className="notice-wrapper">
                        <p><span className="detail-title">标题：</span><span className="detail-title-txt">{details.title}</span></p>
                        <p><span className="detail-title">通告概要：</span><span className="detail-title-txt">{details.describe}</span></p>
                        <p><span className="detail-title">通告内容：</span><span className="detail-title-txt">{details.detail}</span></p>
                        <p><span className="detail-title">创建人：</span><span className="detail-title-txt">{details.create_name}</span></p>
                    </div>
                </Modal>
                <style>{`
                    .checkMore:active, .checkMore.active,
                    .checkMore:focus, .checkMore.focus{
                        color: #49a9ee;
                        background: none!important;
                        border: none!important;
                    }
                    .notification-btn {
                        display: none;
                    }
                `}</style>
            </div>

        )
    }
}

export default connect(state => ({
    initDataFun: state.initDataFun,
}), {
    initData,
})(NoticeBox);