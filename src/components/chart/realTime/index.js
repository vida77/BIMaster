import React, {Component} from 'react';
import echarts from 'echarts';
import './index.scss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {initToggle} from "../../../store/index/action";


class RealSummaryChart extends Component {
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props) {
        super(props);
        this.state = {
            flag: false,
            legendSeries: ['today', 'yesterday', 'day7', 'day30'],
            lineColor: ['#269aff','#26d574', '#fed726', '#ff2672', '#26d1ce'],
        }
    }
    // 基于准备好的dom，初始化echarts实例
    componentDidMount() {
        if(this.props.data){
            this.showChart(this.props.data);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.showChart(nextProps.data);
        }
    }

    componentWillUnmount() {

    }

    handleRef(n) {
        this.node = n;
    }

    // 绘制图表
    showChart(data){

        var that = this;
        if (!data) {
            return;
        }
        var dom = this.node;
        var myChart = echarts.init(dom);

        var legend = ['今日', '昨日', '7天', '30天'];
        var series = [];
        var xAxisData = Object.keys(data.yesterday);
        var xAixsToday = Object.keys(data.today);
        var endTime = xAixsToday.pop();
        var startTime = 0;
        if(xAixsToday.length > 60) {
            startTime = xAixsToday[xAixsToday.length - 30];
        }

        var selected = {};
        that.state.legendSeries.forEach(function(day, index) {
            selected[legend[index]] = legend[index] === '今日';
            var seriesData = [];
            xAxisData.forEach(function(xAixs) {
                if(data[day].hasOwnProperty(xAixs)) {
                    seriesData.push(data[day][xAixs])
                }
            });
            series[index] = {
                name: legend[index],
                type: 'line',
                // stack: '总量',
                data: seriesData,
                itemStyle: {
                    normal: {
                        color: that.state.lineColor[index],
                        lineStyle: {
                            color: that.state.lineColor[index]
                        }
                    }
                }
            }
        })

        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },

            grid: {
                top: '5%',
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

        window.onresize = function(){
            myChart.resize();
        }


        myChart.setOption(option);
    }

    render() {
        const { height=400 } = this.props;
        return (
            <div>
                <div id="main" className="line-box" style={{ height}} ref={this.handleRef.bind(this)}></div>

            </div>
        )
    }
}
export default connect(state => ({
    initDataToggle: state.initDataToggle,
}), {
    initToggle
})(RealSummaryChart);