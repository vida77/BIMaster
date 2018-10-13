import React, {Component} from 'react';
import echarts from 'echarts';

import '../../../page/overviewData/overviewData.less'

export default class LineBarChart extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            title: '订单数据',
            xData: [],
            legendData: [],
            chartData: {},
            selectedLegend: {},
            arr: [],
            data: {},
        }
    }
    
    componentWillReceiveProps(){
        let that = this;
        setTimeout(function(){
            that.setState({
                title: that.props.title
            })
            that.getXDataLegend();
            that.getSelectLegend()
            that.getChartData();
            
        },0)
        
    }
    componentWillMount(){
        this.setState({
            title: this.props.title
        })
        this.getXDataLegend();
        this.getSelectLegend()
        this.getChartData();
        
    }
    componentDidMount(){
        this.showChart();
    }
    // 获取X轴和LEGEND数据
    getXDataLegend(){
        let xData = Object.keys(this.props.chartData);
        let legendD = [];
        for(let item of this.props.chartInform){
            legendD.push(item.name)
        }
        this.setState({
            xData: xData,
            legendData: legendD
        })
    }
    //获取图表series数据
    getChartData(){
        const {chartData, chartInform} = this.props;
        let data = chartData;
        let arrData = chartInform;
        let objJson = {};
        for(let key of arrData){
            let keyName = key.filedName;//total_of_orders，
            let a = [];
            Object.keys(data).map(item => {
                // console.log(item)//09-10
                a.push(data[item][keyName])
                // console.log(a)//[180, 281, 180, 281, 180, 281, 180, 281]
            })
            objJson[keyName] = a;
        }
        this.setState({
            chartData: objJson
        },() => this.showChart())
    }
    // 设置第一个legend选中
    getSelectLegend(){
        const {chartInform} = this.props;
        let arr = chartInform;
        let selectedLegend = {};
        for(let item of arr){
            selectedLegend[item.name] = false
        }
        let objFirstKey = this.get_object_first_attribute(selectedLegend);
        selectedLegend[objFirstKey] = true;
        this.setState({
            selectedLegend: selectedLegend
        })
    }
    // 获取对象的第一个属性
    get_object_first_attribute(data){
        for (let key in data)
            return key;
    }
    showChart(){
        let _this = this;
        let {chartData, xData, legendData, selectedLegend, title} = this.state;
        const {chartInform} = this.props;
        let seriesData = [];
        for(let item of chartInform ){
            seriesData.push(
                {
                    name: item.name,
                    type: item.type,
                    barMaxWidth: '50%',
                    barCategoryGap: '40%',
                    data: chartData[item.filedName]
                }
            )
        }
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
            tooltip:{
                show: true,
                trigger: 'axis'
            },
            backgroundColor:'#fff',
            color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#eb2f96', '#a0d911' ,'#fadb14'],
            legend: {
                bottom: '5',
                selected: selectedLegend,
                data:legendData
            },
            grid: {
                bottom: 80,
                left: 40,
                right: 40
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#aaa'
                        }
                    },
                    axisLabel: {
                        color: '#666'
                    }
                },

            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#eee',
                            type: 'dotted'
                        }
                    },
                    axisLabel: {
                        // formatter: '{value}',
                        color: '#666'
                    }
                },
                {
                    type: 'value',
                    name: '',
                    splitLine: {
                        show: false
                    },
                    min: 0,
                    max: 100,
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        // formatter: '{value}',
                        color: '#666'
                    }
                }
            ],
            series: seriesData
        };
        window.onresize = myChart.resize;
        myChart.setOption(option);
    }
    render(){
        return (
            <div ref="main" className="line-box"  style={{ height: '350px'}}></div>

        )
    }
}