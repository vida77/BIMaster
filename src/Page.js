import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { hashHistory } from 'react-router';
import NotFound from './components/pages/NotFound';
import App from './App';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initMenu} from './store/index/action'

class Page extends React.Component {
    static propTypes = {
        initMenu: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            path: '/app/realtime/survey'
        }
    }
    componentWillMount(){
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            path: nextProps.initDataMenu
        })
        hashHistory.push({pathname: nextProps.initDataMenu})
    }
    render(){
        const { path } = this.state;
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to={path} push/>} />
                    <Route path="/app" component={App} />}/>
                    <Route path="/404" component={NotFound} />
                    <Route component={NotFound} />
                </Switch>
            </Router>
        )
    }
}
export default connect(state => ({
    initDataMenu: state.initDataMenu,
}), {
    initMenu
})(Page);