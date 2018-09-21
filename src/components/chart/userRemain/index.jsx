import React, {Component} from 'react';
import echarts from 'echarts';

export default class UserRemain extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {
                '2018-09-03': {
                    'a': 1,
                    'b': 2,
                    'c': 3,
                    'd': 0,
                    'e': 5,
                    'f': 6,
                    'g': 7,
                    'h': 5,
                    'i': 2,
                    'j': 9
                },
                '2018-09-04': {
                    'a': 3,
                    'b': 1,
                    'c': 0,
                    'd': 1,
                    'e': 1,
                    'f': 0,
                    'g': 1,
                    'h': 2,
                },
                '2018-09-05': {
                    'a': 1,
                    'b': 2,
                    'c': 3,
                    'd': 0,
                    'e': 5,
                    'f': 6
                },
                '2018-09-06': {
                    'a': 8,
                    'b': 5,
                    'c': 0,
                    'd': 1,
                    'e': 2
                },
                '2018-09-07': {
                    'a': 2,
                    'b': 8,
                    'c': 3,
                    'd': 0,
                    'e': 3
                },
                '2018-09-08': {
                    'a': 9,
                    'b': 3,
                    'c': 7,
                    'd': 2
                }
            },
            xData:[],
            yData:[],
            chartData: []
        }
    }
    componentWillMount(){
        let data = this.state.data;
        let yData = Object.keys(this.state.data);
        let arr = [];
        yData.map(item => {
            let dataItem = data[item];
            let length = Object.keys(dataItem)
            for(let i=0; i< length.length; i++){
                let val = dataItem[length[i]] ? dataItem[length[i]] : ''
                arr.push([i, item, val])
            }
        })
        // arr.push([item, i, dataItem[i]])
        this.setState({
            yData: yData,
            chartData: arr,
            xData: this.props.xData
        },()=>this.showChart())
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            xData: nextProps.xData
        },()=>this.showChart())
    }
    showChart(){
        let {chartData, xData, yData} = this.state;
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            backgroundColor:'#fff',
            tooltip: {
                show: false,
                position: 'top'
            },
            animation: false,
            grid: {
                left: '10%',
                right: 0,
            },
            xAxis: {
                type: 'category',
                position: 'top',
                data: xData,
                splitArea: {
                    show: false
                },

                axisTick:{
                    length:0,
                    lineStyle:{
                        color: '#ccc'
                    }
                },
                axisLine:{
                    show: false
                },
                axisLabel:{
                    margin: 15,
                    color: 'rgba(0, 0, 0, .85)',
                    fontWeight: 'bold'
                },
            },
            yAxis: {
                type: 'category',
                name: '时间',
                nameLocation: 'start',
                nameTextStyle: {
                    fontWeight: 'bold',
                    padding: [2, 100, 0, 0],
                    color: 'rgba(0, 0, 0, .85)'
                },
                data: yData,
                inverse: true,
                splitArea: {
                    show: false
                },
                axisLine:{
                    show: false
                },
                axisLabel:{
                    margin: 20,
                    color: 'rgba(0, 0, 0, .85)',
                },
                axisTick:{
                    length:0,
                    lineStyle:{
                        color: '#ccc'
                    }
                }
            },
            visualMap: {
                show: false,
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                color:['#1890ff','#fff']
            },
            series: [{
                name: '',
                type: 'heatmap',
                data: chartData,
                label: {
                    normal: {
                        show: true,
                        color: 'rgba(0,0,0,.65)'
                    }
                },
                itemStyle: {
                    emphasis: {
                        // shadowBlur: 10,
                        // shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        window.onresize = myChart.resize;
        myChart.setOption(option);

    }
    render(){
        return(
            <div id="main" className="line-box"  style={{ height: '400px'}}></div>
        )
    }
}
