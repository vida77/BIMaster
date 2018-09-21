import React, {Component} from 'react';
import echarts from 'echarts';

export default class Funnel extends Component{
    constructor(props){
        super(props);
        this.state = {
            title: '司机漏斗',
            chartData: 
            [
                {value: 60, name: '日均完成订单司机'},
                {value: 40, name: '日均中标司机'},
                {value: 20, name: '日均抢单司机'},
                {value: 80, name: '日均派单司机'},
                {value: 100, name: '日均有效在线司机'},
                {value: 120, name: '日均在线司机'}
            ],
        }
    }
    componentWillMount(){
        let data = this.state.chartData;
        // let arr = [];

        this.setState({
            chartData: data,
        },()=>this.showChart())
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            chartData: nextProps.chartData
        },()=>this.showChart())
    }
    showChart(){
        let {title} = this.state;
        let _this = this;
        let {chartData} = this.state;
        var myChart = echarts.init(_this.refs.main);
        var option = {
            title: {
                text: title,
                left: 20,
                textStyle: {
                    color: '#333',
                    fontSize: 16,
                }
            },
            backgroundColor:'#fff',
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}"
            },
            calculable: true,
            color: ['#1890ff', '#096dd9', '#0050b3', '#40a9ff','#69c0ff','#91d5ff', ],
            series: [
                {
                    name:'',
                    type:'funnel',
                    top: '15%',
                    bottom: 20,
                    left: '20%',
                    width: '70%',
                    min: 0,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'descending',
                    gap: 20,
                    label: {
                        normal: {
                            show: true,
                            position: 'left'
                        },
                        // emphasis: {
                        //     textStyle: {
                        //         fontSize: 18
                        //     }
                        // }
                    },
                    labelLine: {
                        normal: {
                            length: 30,
                            lineStyle: {
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                       
                        }
                    },
                    data: chartData
                }
            ]
        };
        window.onresize = myChart.resize;
        myChart.setOption(option);

    }
    render(){
        return(
            <div ref="main" className="line-box"  style={{ height: '300px'}}></div>
        )
    }
}
