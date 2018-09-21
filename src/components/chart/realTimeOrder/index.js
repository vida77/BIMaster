import React, {Component} from 'react';
import echarts from 'echarts';
import './index.scss';

export default class TimeLineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineColor: ['#269aff','#26d574', '#fed726', '#ff2672', '#26d1ce']

        }
    }

    // 基于准备好的dom，初始化echarts实例
    componentDidMount() {
        if(this.props.data){
            this.showChart(this.props.data, this.props.desc, this.props.title);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data) {
            this.showChart(nextProps.data, nextProps.desc, nextProps.title);
        }

    }


    // 绘制图表
    showChart(data, desc, title=''){
        var that = this;
        if(!data) {
            return;
        }

        var myChart = echarts.init(document.getElementById('main'));

        let legendKeys = [], legend = [], series = [], xAxisData = [], selected = {};

        desc.forEach((obj, index) => {
            var key = Object.keys(obj)[0];
            legendKeys.push(key);
            legend.push(obj[key]);
        })

        // legendKeys = Object.keys(desc);
        xAxisData = Object.keys(data[legendKeys[1]]);
        var xAixsToday = Object.keys(data[legendKeys[0]]);

        var endTime = xAixsToday.pop();
        var startTime = 0;
        if(xAixsToday.length > 60) {
            startTime = xAixsToday[xAixsToday.length - 30];
        }


        legendKeys.forEach((key, index) => {
            let xValue = [];
            xAxisData.forEach((x, index) => {
                xValue.push(data[key][x]);
            });
            series.push({
                name: legend[index],
                type: 'line',
                // stack: '总量',
                data: xValue,
                itemStyle: {
                    normal: {
                        color: that.state.lineColor[index],
                        lineStyle: {
                            color: that.state.lineColor[index]
                        }
                    }
                }
            })
            selected[legend[index]] = index === 0;


        });

        var option = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: '10%',
                left: '5%',
                right: '5%',
                bottom: 100
            },
            legend: {
                selected: selected,
                data: legend,
                bottom: 0
            },
            dataZoom: { //缩放
                show: true,
                startValue: startTime,
                endValue: endTime,
                bottom: 40
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: series
        };

        window.onresize = myChart.resize;
        myChart.setOption(option);
    }

    render() {
        const { height=400 } = this.props;
        return (
            <div id="main" className="line-box"  style={{ height}}></div>
        )
    }
}