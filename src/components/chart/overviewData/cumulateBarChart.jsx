import React, {Component} from 'react';
import echarts from 'echarts';

export default class CumulateBarChart extends Component{
    constructor(props){
        super(props);
        this.state = {
            title: '体验数据',
            chartData: {},
            finalData: []
        }
    }
    componentWillMount(){
        this.getChartData();
    }
    componentDidMount(){
        this.showChart();
    }
    //获取图表series数据
    getChartData(){
        const {chartData} = this.props;
        console.log(chartData)
        let seriesArr = [];
        chartData.map(item => {
            seriesArr.unshift(Object.values(item))
        })
        console.log(seriesArr)
        let seriesData = [];
        seriesArr.map((item,index) => {
            // let arrB = [];
            for(let item1 of item){
                let arr=[0,0,0,0];
                // console.log(item1)
                arr[index] = item1;
                // arrB.push(arr)
                seriesData.push(
                    {
                        name: '',
                        type: 'bar',
                        barWidth: 30,
                        stack: '总量',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight',
                                formatter: function(params){
                                    if(params.value === 0){
                                        return '';
                                    }else{
                                        return params.value+'%'
                                    }
                                }
                            }
                        },
                        data: arr
                    },
                )
            }
            // console.log(arrB)
        })
        let legendData = ['创建订单', '主动取消(派单阶段)','有车接单','有车无人接','无车可接','主动取消(决策阶段)','主动选择','超时取消','主动取消(服务阶段)','当日完成','等待服务']
        legendData.reverse().map((legend,index)=>{
            seriesData[index].name = legend;
        })
        console.log(seriesData)
        this.setState({
            finalData:seriesData
        })
    
    }
    // 获取对象的第一个属性
    get_object_first_attribute(data){
        for (let key in data)
            return key;
    }
    showChart(){
        let _this = this;
        let {title} = this.state;
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
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                // formatter: '{b0}: {c0}%'
                formatter: function(params){
                    let htm = '<div>' + params[0].name + '<br/>';
                    params.map(item => {
                        if(item.value !== 0){
                            htm += '<span>'+item.seriesName + '：</span>' 
                            + '<span>' + item.value + '</span><br/>'
                            + '</div>';
                            
                        }
                    })
                    return htm;
                }
            },
            legend: {
                orient: 'horizontal',
                itemWidth: 10,
                itemHeight: 10,
                right: '5%',
                left: '3%',
                bottom:'1%',
                data: ['创建订单', '主动取消(派单阶段)','有车接单','有车无人接','无车可接','主动取消(决策阶段)','主动选择','超时取消','主动取消(服务阶段)','当日完成','等待服务']
            },
            grid: {
                left: '3%',
                top: '15%',
                right: '5%',
                bottom: '20%',
                containLabel: true
            },
            xAxis:  {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                 splitLine: {
                    lineStyle: {
                        color: '#eee',
                        type: 'dotted'
                    }
                },
                 axisTick: {
                    show: true
                },
                axisLabel: {
                    color: '#666'
                }
            },
            yAxis: {
                type: 'category',
                data: ['服务阶段','决策阶段','派单阶段','创建订单'],
                name: '',
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
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
            color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#69c0ff', '#9254de', '#a0d911' ,'#d4b106', '#d46b06','#d4b106'],
            // series: [
            //     {
            //         name: '创建订单',
            //         type: 'bar',
            //         barWidth: 30,
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 0, 0, 500]
            //     },
            //     {
            //         name: '主动取消',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 0, 120, 0]
            //     },
            //     {
            //         name: '有车接单',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 0, 120, 0]
            //     },
            //     {
            //         name: '有车无人接',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 0, 130, 0]
            //     },
            //     {
            //         name: '无车可接',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 0, 80, 0]
            //     },
            //     {
            //         name: '主动取消',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 140, 0, 0]
            //     },
            //     {
            //         name: '主动选择',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 100, 0, 0]
            //     },
            //      {
            //         name: '超时取消',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [0, 90, 0, 0]
            //     },
            //     {
            //         name: '主动取消',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [80, 0, 0, 0]
            //     },
            //      {
            //         name: '当日完成',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [110, 0, 0, 0]
            //     },
            //     {
            //         name: '等待服务',
            //         type: 'bar',
            //         stack: '总量',
            //         label: {
            //             normal: {
            //                 show: true,
            //                 position: 'insideRight',
            //                 formatter: function(params){
            //                     if(params.value === 0){
            //                         return '';
            //                     }else{
            //                         return params.value+'%'
            //                     }
            //                 }
            //             }
            //         },
            //         data: [90, 0, 0, 0]
            //     }
            // ]
            
            series: this.state.finalData
        };
        window.onresize = myChart.resize;
        myChart.setOption(option);
    }
    render(){
        return (
            <div ref="main" className="line-box"  style={{ height: '360px'}}></div>
        )
    }
}