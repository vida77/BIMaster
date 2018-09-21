
import React, { Component } from 'react';
// import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';

// 实时数据概况
import Order from '../page/realTimeData/order';
import Survey from '../page/realTimeData/survey';
// 运营日报
import IncomeAndCost from '../page/operatingDaily/orderIncomeCost';
import BargainingAnalysis from '../page/operatingDaily/bargainingAnalysis';
import CapacityAnalysis from '../page/operatingDaily/capacityAnalysis';
import Distribution from '../page/operatingDaily/orderDistribution';
import Portrait from '../page/operatingDaily/orderPortrait';
import PiesAnalysis from '../page/operatingDaily/piesAnalysis';
import ServiceQualityOfDrivers from '../page/operatingDaily/serviceQualityOfDrivers';
import UserStatistics from '../page/operatingDaily/userStatistics';
// 排行榜
import Ranking from '../page/ranking/ranking';
// 系统中心-系统公告
import SystemNotice from '../page/systemManage/systemNotice';
// 系统中心-权限管理
import RightsManageRole from '../page/systemManage/rightsManageRole';
import RightsManageUser from '../page/systemManage/rightsManageUser';
import RightsManageModule from '../page/systemManage/rightsManageModule';

import PageError from '../page/pageError/pageError'
// 留存
import userRetain from '../page/retain/userRetain'
// 活动效果
import effectStatistic from '../page/activityEffect/effectStatistic'
import couponStatistic from '../page/activityEffect/couponStatistic'
// 看板数据
import overviewData from '../page/overviewData/overviewData'



export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        // const { permissions } = auth.data;
        // const { auth } = mobx.getState().httpData;
        // if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    constructor(props){
        super(props);
        this.state = {
            flag: true
        }
    }
    componentWillMount(){
    }
    componentWillReceiveProps(nextProps) {

        let flag = this.props.collapsed;
        this.setState({
            flag: flag
        })
    }
    render() {
        return (
            <Switch>

                <Route exact path="/app/realtime/survey" component={Survey} />
                <Route exact path="/app/realtime/order" component={Order} />

                <Route exact path="/app/operation/income" component={IncomeAndCost} />
                <Route exact path="/app/operation/order_dist" component={Distribution} />
                <Route exact path="/app/operation/portrait" component={Portrait} />
                <Route exact path="/app/operation/bargain" component={BargainingAnalysis} />
                <Route exact path="/app/operation/driver" component={CapacityAnalysis} />
                <Route exact path="/app/operation/user" component={UserStatistics} />
                <Route exact path="/app/operation/dispatch" component={PiesAnalysis} />
                <Route exact path="/app/operation/service_quality" component={ServiceQualityOfDrivers} />

                <Route exact path="/app/ranking/rank_order/complete_count" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/complete_amount" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/average_amount" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/average_time" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/average_distance" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/complete_rate" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/create_total" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/dispatch_success_rate" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/billing_difference" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/service_cost" component={Ranking} />
                <Route exact path="/app/ranking/rank_order/no_car_can_dispatch" component={Ranking} />
                {/*<Route exact path="/app/ranking/rank_order/order_10" component={Ranking} />*/}
                {/*<Route exact path="/app/ranking/rank_order/order_11" component={Ranking} />*/}

                <Route exact path="/app/ranking/rank_driver/active_total" component={Ranking}/>
                <Route exact path="/app/ranking/rank_driver/average_orders" component={Ranking}/>
                <Route exact path="/app/ranking/rank_driver/registered_total" component={Ranking}/>
                <Route exact path="/app/ranking/rank_driver/activation_total" component={Ranking}/>
                <Route exact path="/app/ranking/rank_driver/negative_rate" component={Ranking}/>
                {/*<Route exact path="/app/ranking/rank_driver/lose_rate" component={Ranking}/>*/}

                <Route exact path="/app/ranking/rank_user/active_total" component={Ranking} />
                <Route exact path="/app/ranking/rank_user/average_total" component={Ranking} />
                <Route exact path="/app/ranking/rank_user/registered_total" component={Ranking} />
                <Route exact path="/app/ranking/rank_user/activation_total" component={Ranking} />
                <Route exact path="/app/ranking/rank_user/recharge_amount" component={Ranking} />
                {/*<Route exact path="/app/ranking/rank_user/lose_rate" component={Ranking} />*/}
                <Route exact path="/app/ranking/rank_user/place_order_user_total" component={Ranking} />
                {/*<Route exact path="/app/auth/basic" component={AuthBasic} />*/}
                {/*<Route exact path="/app/auth/routerEnter" component={(props) => this.requireAuth('auth/testPage', <RouterEnter {...props} />)} />*/}


                <Route exact path="/app/systemManage/systemNotice" component={SystemNotice} />
                <Route exact path="/app/systemManage/rightsManage/role" component={RightsManageRole} />
                <Route exact path="/app/systemManage/rightsManage/user" component={RightsManageUser} />
                <Route exact path="/app/systemManage/rightsManage/module" component={RightsManageModule} />

                <Route exact path="/app/retain/userRetain/" component={userRetain} />
                
                <Route exact path="/app/activityEffect/effectStatistic" component={effectStatistic} />
                <Route exact path="/app/coupon/list" component={couponStatistic} />

                <Route exact path="/app/overviewData/overviewData" component={overviewData} />

                <Route exact path="/app/pageError" component={PageError}/>

                {/*<Route render={() => <Redirect to="/404" />} />*/}
            </Switch>
        )
    }
}