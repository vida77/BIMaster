import React, {Component} from 'react';
import {Button} from 'antd';
import pageError1 from './pageError1.png';
import pageError2 from './pageError2.png';
import './pageError.less';

export default class SystemNotice extends Component {
    constructor(props) {
        super(props);
        this.state={
            title:'',
            tip:'',
            imgSrc:'',
            code: ''
        };
    }
    componentWillMount() {
        this.setState({
            code: this.props.location.search.split('?')[1].split('=')[1]
        },()=>this.showPage())
    }
    componentDidMount(){
    }
    showPage(){
        if(this.state.code == 105){
            this.setState({
                title: '抱歉，您的访问权限已过期。',
                tip: 'BI权限有效期30自然日，如需要请继续在钉钉中申请。',
                imgSrc: pageError1
            })
        }else if(this.state.code == 106){
            this.setState({
                title: '抱歉，您的账户已被禁用。',
                tip: '如有疑问请与管理员联系。',
                imgSrc: pageError1
            })
        }else if(this.state.code == 10002){
            this.setState({
                title: '抱歉，您没有此页面访问权限。',
                tip: '如需要请在钉钉相关模块申请使用权限。',
                imgSrc: pageError2
            })
        }
    }
    goBack() {
        window.location.href='/index.php/index/login'
    }
    render() {
        let {title, tip, imgSrc} = this.state;
        return (
            <div>
                <div className="con-wrapper">
                    <img src={imgSrc} alt=""/>
                    <h3>{title}</h3>
                    <p>{tip}</p>
                </div>
                <div className="btn-wrapper">
                    <Button type="primary" onClick={this.goBack.bind(this)}>
                        返回首页
                    </Button>
                </div>
            </div>
        )
    }
}