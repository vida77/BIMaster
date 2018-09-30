
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import logo from '../style/imgs/logo.png';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initData, initMenu} from '../store/index/action'


const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
            mode: 'inline',
            openKey: '',
            selectedKey: '',
            firstHide: true,        // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
            menuObj: {},
            menuArrItem: [],
            menuArr: [
                {   key: '/app/realtime', title: '实时数据概况', icon: 'clock-circle-o',
                    sub: [
                        { key: '/app/realtime/survey', title: '概况', menuID: 'web_api/realtime/summary'},
                        { key: '/app/realtime/order', title: '订单', menuID: 'web_api/realtime/order'}
                    ]
                },
                {
                    key: '/app/operation', title: '运营日报', icon: 'schedule',
                    sub: [
                        { key: '/app/operation/income', title: '订单收入及成本', menuID: 'web_api/operation/income' },
                        { key: '/app/operation/order_dist', title: '订单分布', menuID: 'web_api/operation/order_dist'},
                        { key: '/app/operation/portrait', title: '订单画像', menuID: 'web_api/operation/portrait'},
                        { key: '/app/operation/bargain', title: '议价分析', menuID: 'web_api/operation/bargain'},
                        { key: '/app/operation/driver', title: '运力分析', menuID: 'web_api/operation/driver'},
                        { key: '/app/operation/user', title: '用户统计', menuID: 'web_api/operation/user'},
                        { key: '/app/operation/dispatch', title: '派单分析', menuID: 'web_api/operation/dispatch'},
                        { key: '/app/operation/service_quality', title: '司机服务质量', menuID: 'web_api/operation/service_quality'}
                    ]
                },
                {
                    key: '/app/ranking', title: '排行榜', icon: 'flag',
                    sub: [
                        { key: '/app/ranking/rank_order', title: '订单',
                            sub: [
                                { key: '/app/ranking/rank_order/complete_count', title: '完成订单数', menuID: 'web_api/rank_order/complete_count'},
                                { key: '/app/ranking/rank_order/complete_amount', title: '完成订单金额', menuID: 'web_api/rank_order/complete_amount'},
                                { key: '/app/ranking/rank_order/average_amount', title: '订单平均金额', menuID: 'web_api/rank_order/average_amount'},
                                { key: '/app/ranking/rank_order/average_time', title: '订单平均时长', menuID: 'web_api/rank_order/average_time'},
                                { key: '/app/ranking/rank_order/average_distance', title: '平均行驶距离', menuID: 'web_api/rank_order/average_distance'},
                                { key: '/app/ranking/rank_order/complete_rate', title: 'C to R订单完成率', menuID: 'web_api/rank_order/complete_rate'},
                                { key: '/app/ranking/rank_order/create_total', title: '创建订单', menuID: 'web_api/rank_order/create_total'},
                                { key: '/app/ranking/rank_order/dispatch_success_rate', title: '派单成功率', menuID: 'web_api/rank_order/dispatch_success_rate'},
                                { key: '/app/ranking/rank_order/billing_difference', title: '计费差额', menuID: 'web_api/rank_order/billing_difference'},
                                { key: '/app/ranking/rank_order/service_cost', title: '服务成本', menuID: 'web_api/rank_order/service_cost'},
                                { key: '/app/ranking/rank_order/no_car_can_dispatch', title: '无车可派', menuID: 'web_api/rank_order/no_car_can_dispatch'}
                            ]
                        },
                        { key: '/app/ranking/rank_driver', title: '司机',
                            sub: [
                                { key: '/app/ranking/rank_driver/active_total', title: '活跃司机', menuID: 'web_api/rank_driver/active_total'},
                                { key: '/app/ranking/rank_driver/average_orders', title: '司机均单量', menuID: 'web_api/rank_driver/average_orders'},
                                { key: '/app/ranking/rank_driver/registered_total', title: '新注册司机', menuID: 'web_api/rank_driver/registered_total'},
                                { key: '/app/ranking/rank_driver/activation_total', title: '新增激活司机', menuID: 'web_api/rank_driver/activation_total'},
                                { key: '/app/ranking/rank_driver/negative_rate', title: '差评率', menuID: 'web_api/rank_driver/negative_rate'}
                            ]
                        },
                        { key: '/app/ranking/rank_user', title: '用户',
                            sub: [
                                { key: '/app/ranking/rank_user/active_total', title: '活跃用户', menuID: 'web_api/rank_user/active_total'},
                                { key: '/app/ranking/rank_user/average_total', title: '乘客单均量', menuID: 'web_api/rank_user/average_total'},
                                { key: '/app/ranking/rank_user/registered_total', title: '新注册用户', menuID: 'web_api/rank_user/registered_total'},
                                { key: '/app/ranking/rank_user/activation_total', title: '新激活用户', menuID: 'web_api/rank_user/activation_total'},
                                { key: '/app/ranking/rank_user/recharge_amount', title: '充值金额', menuID: 'web_api/rank_user/recharge_amount'},
                                { key: '/app/ranking/rank_user/place_order_user_total', title: '下单用户数', menuID: 'web_api/rank_user/place_order_user_total'}
                            ]
                        }
                    ]
                },
                {
                    key: '/app/retain', title: '留存', icon: 'solution',
                    sub: [
                        { key: '/app/retain/userRetain', title: '用户留存', menuID: 'web_api/retain/userRetain' },
                    ]
                },
                {
                    key: '/app/market', title: '活动效果', icon: 'gift',
                    sub: [
                        { key: '/app/market/activity', title: '活动效果统计', menuID: 'web_api/market/activity'},
                        { key: '/app/market/coupon', title: '优惠券统计', menuID: 'web_api/market/coupon'}
                    ]
                },
                {
                    key: '/app/overviewData', title: '看板数据', icon: 'profile',
                    sub: [
                        { key: '/app/overviewData/overviewData', title: '看板数据', menuID: 'web_api/overviewData/overviewData' },
                    ]
                },
                {
                    key: '/app/systemManage', title: '系统中心', icon: 'appstore-o',
                    sub: [
                        { key: '/app/systemManage/systemNotice', title: '系统公告', menuID: 'web_api/system_informs/informs_list'},
                        { key: '/app/systemManage/rightsManage', title: '权限管理',
                            sub: [
                                {key: '/app/systemManage/rightsManage/role', title: '角色组', menuID: '/system/auth/role/list'},
                                {key: '/app/systemManage/rightsManage/user', title: '用户列表', menuID: '/system/auth/user/list'},
                                {key: '/app/systemManage/rightsManage/module', title: '模块列表', menuID: '/system/auth/permission/list'}
                            ]
                        }
                    ]
                },

            ]
        };
    }

    getMenuItem(){
        let arr = [];
        let menuArr = this.state.menuArr;
        let menuObj = this.state.menuObj;
        if(menuObj){
            menuArr.map( item => {
                let item1sub = item.sub;
                if(item1sub && item1sub.length){
                    let item1menu = item;
                    item1menu.sub = [];
                    item1sub.map( item2 => {
                        let item2sub = item2.sub;
                        if(item2sub && item2sub.length){
                            let item2menu = item2;
                            item2menu.sub = [];
                            item2sub.map( item3 => {
                                let item3sub = item3.sub;
                                if(item3sub && item3sub.length){

                                }else {
                                    Object.keys(menuObj).map( obj => {
                                        if(obj === item3.menuID){
                                            item2menu.sub.push(item3)
                                        }
                                    })
                                }
                            })
                            if(item2menu.sub && item2menu.sub.length){
                                item1menu.sub.push(item2menu)
                            }
                        }else {
                            Object.keys(menuObj).map( obj => {
                                if(obj === item2.menuID){
                                    item1menu.sub.push(item2)
                                }
                            })
                        }
                    })
                    if(item1menu.sub && item1menu.sub.length){
                        arr.push(item1menu)
                    }
                }
            });
            this.setState({
                menuArrItem: arr
            })
            this.props.initMenu(arr[0].sub[0].key)
        }else {
            this.setState({
                menuArrItem: []
            })
        }
    }
    componentWillMount(){

    }
    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
        let auth = nextProps.initDataFun.auth;
        let userInfo = nextProps.initDataFun.userInfo;
        if(!userInfo){
           this.setState({
               collapsed: true
           })
        }
        if(auth instanceof Array){
            auth = {...auth}
        }
        if(!(JSON.stringify(auth) == "{}")){
            if(typeof (auth) ==  "undefined"){
                this.setState({
                    collapsed: true,
                    menuArrItem: []
                })
            }else {
                let arr = Object.keys(auth);
                if(arr.indexOf("-1") > -1){
                    this.setState({
                        menuArrItem: this.state.menuArr
                    })
                    this.props.initMenu('/app/realtime/survey')
                }else {
                    this.setState({
                        menuObj: auth
                    },() => this.getMenuItem())
                }
            }
        }else {
            this.setState({
                collapsed: true,
                menuArrItem: []
            })
            hashHistory.push({
                pathname: '/app/pageError',
                query: {
                    code: 10002
                },
            })
        }
    }

    setMenuOpen = props => {
        const { pathname } = props.location;
        this.setState({
            openKey: pathname.substr(0, pathname.lastIndexOf('/')),
            selectedKey: pathname
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };
    formSubmenusChild(obj){
        let cHtml=<div></div>;
        let childArray=obj.sub;
        if("undefined"!== typeof(childArray)&&childArray.length>0) {
            cHtml = childArray.map((item, i) => {
                return this.formSubmenusChild(item);
            });
            if(obj.icon){
                return <SubMenu key={obj.key} title={<span><Icon type={obj.icon}></Icon><span className="nav-text">{obj.title}</span></span>}>{cHtml}</SubMenu>
            }else {
                return <SubMenu key={obj.key} title={obj.title}>{cHtml}</SubMenu>
            }

        }else{
            return <Menu.Item key={obj.key}><Link to={obj.key}>{obj.title}</Link></Menu.Item>
        }

    }

    render() {
        const {openKey, menuArrItem, collapsed} = this.state;
        const { initDataFun } = this.props;
        let openKeyKey = ['/app/ranking'],openKeyArr = [],openKeyKey1=['/app/systemManage'];
        if (openKey === '/app/ranking/rank_order' || openKey === '/app/ranking/rank_driver' || openKey === '/app/ranking/rank_user'){
            openKeyKey.push(openKey);
            openKeyArr = openKeyKey;
        }else if (openKey === '/app/systemManage/rightsManage'){
            openKeyKey1.push(openKey);
            openKeyArr = openKeyKey1;
        }else {
            openKeyArr.push(openKey)
        }
        let columnMenu = menuArrItem;
        let htmlMenu =columnMenu.map((obj, i)=>{
            if ("undefined"!==typeof(obj.sub)&&obj.sub.length>0) {
                return this.formSubmenusChild(obj);
            } else {
                //这里的routeurl是路由地址，是自定义的一个属性
                return <Menu.Item key={obj.key}>{obj.name}</Menu.Item>
            }
        })
        return (
            <Sider
                trigger={null}
                collapsed={collapsed}
                style={{ overflowY: 'auto' }}
            >
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="logo"/>
                        <span className="logo-title">商业智能系统</span>
                    </Link>
                </div>
                {initDataFun.auth?<Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[this.state.selectedKey]}
                    openKeys = {this.state.firstHide ? null : openKeyArr}
                    onClick={this.menuClick}
                    onOpenChange={this.openMenu}
                    inlineCollapsed={this.state.collapsed}
                >
                    {htmlMenu}
                </Menu>:''}
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    .ant-layout .logo {
                        height: 64px;
                        line-height: 64px;
                        background: #002140;
                        margin: 0;
                        padding-left: 14px;
                    }
                    .logo-title {
                        color: #fff;
                        font-size: 20px;
                        font-weight: 600;
                    }
                    .logo img {
                        display: inline-block;
                        width: 45px;
                        height: 45px;
                    }
                    .logo i img {
                        width: 100%;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

// export default withRouter(SiderCustom);
export default withRouter(connect(state => ({
    initDataFun: state.initDataFun,
}), {
    initData,
    initMenu
})(SiderCustom));