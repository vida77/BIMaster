import React, {Component} from 'react';
import {Select, Card, Button, Icon, Table} from 'antd';
import moment from 'moment';


import * as carType from '../../components/ranking/car_types';
import * as navMenu from '../../components/ranking/navs';
import * as dateUtil from '../../components/ranking/DateFormat';
import * as api from '../../utils/api';
import * as city from '../../components/ranking/city';
import * as hash from '../../components/ranking/hashes';

import './ranking.less';

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';;
const HEADER_DATE_FORMAT = 'MM/DD';
const ROW_KEY_DATE_FORMAT = 'YYYYMMDD';
const YESTERDAY = moment().subtract('1', 'days').format(DEFAULT_DATE_FORMAT);

export default class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCarType: 'all',
      selectedDateType: 'days',
      selectedBaseDay: YESTERDAY,
      prevTime: '',
      nextTime: '',

      pageLoading: false,
      pageName: '',
      pageUrl: '',
      carTypes: {},
      dateTypes: {
        days: '日',
        weeks: '周',
        months: '月',
      },

      allCities: {},
      tableData: [],
      tableHeader: [],
      rangeDays: [],
      numberDigit: 0,
      showCarTypeSelection: true,
    }
  }

  //车型改变的处理方法
  handleCarTypeChange(carType) {
    this.setState({
      selectedCarType: carType
    }, () => {
      this.getAllData();
    })
  }

  //时间类型改变的处理方法
  handleDateTypeChange(dateType) {
    this.setState({
      selectedDateType: dateType
    }, () => {
      this.getAllData();
    })
  }

  //上一页、下一页改变的处理方法
  handlePageChange(num) {
      console.log(num)

      if(num > 0){
          this.setState({
              selectedBaseDay: this.state.nextTime,
          },() => this.getAllData());
      }else {
          this.setState({
            selectedBaseDay: this.state.prevTime,
          },() => this.getAllData());
      }

    // const baseDay = moment(this.state.selectedBaseDay);
    // let newBaseDay = '';
    // if (num > 0) {
    //   newBaseDay = baseDay.add(num, this.state.prevTime);
    // } else {
    //   newBaseDay = baseDay.subtract(-num, this.state.nextTime);
    // }
    // newBaseDay = newBaseDay.format(DEFAULT_DATE_FORMAT);
    // this.setState({
    //   selectedBaseDay: newBaseDay,
    // }, () => {
    //   this.getAllData();
    // });
  }

  //获取时间数组，用于请求api的时候的timeAt参数
  getRangeDays() {
    let rangeDays = dateUtil.getDateRange(this.state.selectedBaseDay, this.state.selectedDateType);
    this.setState({
      rangeDays: rangeDays,
    });
    return rangeDays;
  }

  //生成接口请求数据参数
  getApiParams(groupBy = '') {
    let params = {
        start_at: this.state.selectedBaseDay,
        date_limit: 8,
        cycle_type: this.state.selectedDateType,
        car_type_id: this.state.selectedCarType
    };
    let carTypeIds = carType.getCarTypeIds(this.state.selectedCarType);
    if (this.state.selectedCarType === 'other') {
        params['car_type_id!'] = carTypeIds;
    } else {
        params['car_type_id'] = carTypeIds;
    }
    return params;
  }

  //获取分城市数据
  getCityData() {
    return api.getDatamartData(this.getApiParams());
  }

  //获取全国数据
  getNationData() {
    return api.getDatamartData(this.getApiParams());
  }

  //获取数据，包含分城市数据和全国数据
  getAllData() {
    this.setState({
      pageLoading: true,
    });
      let searchParams = this.getApiParams();
      let result =api.getRankFun(searchParams);
      result.then(res => {
          this.setState({
              tableData: this.formatTableData(res.data),
              tableHeader: this.formatTableHeader(),
              pageLoading: false,
              prevTime: res.pages.prev,
              nextTime: res.pages.next
          });
      }).catch(err => {
          this.setState({
              pageLoading: false,
              tableData: [],
              tableHeader: [],
          })
      })
  }

  //格式化表数据，以用于Table组件
    formatTableData(originData) {
        let flipData = {};
        for (let day in originData) {
            let dayKey = moment(day).format(ROW_KEY_DATE_FORMAT);//20180625
            let cityDataObj = originData[day];//{order_average_time_am: 0, order_average_time_anshun: 0, order_average_time_as: 25.38,…}
            let arr = [];
            for (let cityHash in cityDataObj) {
                let hashArray = cityHash.split('_');//["total", "of", "active", "drivers", "zz"]
                let a = hashArray.length;
                arr.push(a);
                let b = Math.max.apply(null, arr)
                let cityKey = hashArray.length === b ? hashArray[b-1] : 'allcity';
                if (!flipData.hasOwnProperty(cityKey)) {
                    flipData[cityKey] = {};
                }
                flipData[cityKey][dayKey] = cityDataObj[cityHash];
            }
        }

        let data = [];
        for (let city in flipData) {
            let item = flipData[city];
            item['city'] = this.state.allCities[city];
            data.push(item);
        }
        let sortDay = this.getRangeDays()[0];
        let sortKey = moment(sortDay).format(ROW_KEY_DATE_FORMAT);
        const result = data.sort(this.compareLastItem(sortKey));

        let finalResult = [];
        for (let idx in result) {
            let item = result[idx];
            item['rank'] = parseInt(idx) + 1;
            item['key'] = parseInt(idx) + 1;
            finalResult.push(item);
        }
        return finalResult;
    }
  //格式化表头内容，以用于Table组件
  formatTableHeader() {
    let headers = [{
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: '8%',
    }, {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: '12%',
    }];

    const days = dateUtil.getDateRange(this.state.selectedBaseDay, this.state.selectedDateType);
    days.reverse();
    for (let day of days) {
      let dayTitle = this.state.dateTypes[this.state.selectedDateType] + ' ' + moment(day).format(HEADER_DATE_FORMAT);
      if (day === YESTERDAY) {
        const dateType = this.state.selectedDateType;
        if (dateType === 'days') {
          dayTitle = '昨天';
        }
        if (dateType === 'weeks') {
          dayTitle = '最近7天';
        }
        if (dateType === 'months') {
          dayTitle = '最近30天';
        }
      }
      let dayKey = moment(day).format(ROW_KEY_DATE_FORMAT);
      headers.push({
        title: dayTitle,
        dataIndex: dayKey,
        key: dayKey,
        sorter: (a, b) => a[dayKey] - b[dayKey],
        width: '10%',
        render: (text, record, index) => this.renderTableCellValue(text, record, index),
      });
    }
    return headers;
  }

  //自定义表格单元格内容显示方式
  renderTableCellValue(text, record, index) {
    const digit = this.state.numberDigit;
    return (
      <div className="cellValue">{this.formatNumber(text, digit)}</div>
    );
  }

  //数字格式化
  formatNumber(number, digit) {
    return this.milliFormat(parseFloat(number).toFixed(digit));
  }

  //数字添加千分符
  milliFormat(num) {
    return num && num.toString()
      .replace(/^\d+/g, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
  }

  //计算变化率
  calRate(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (b === 0) {
      return 'NaN';
    }
    let result = (a / b).toFixed(2).toString();
    if (result === 'NaN') {
      return 'NaN';
    }
    return result + '%';
  }

  //排序用的比较方法
  compareLastItem(sortKey) {
    return function (a, b) {
      return b[sortKey] - a[sortKey];
    }
  }

  loadPageData(pageUrl) {
    const pageName = navMenu.getPageName(pageUrl);
    const numberDigit = hash.getHashDigit(navMenu.getPageHashKey(pageUrl));
    const showCarTypeSelection = navMenu.checkPageShowCarTypeSelection(pageUrl);

    this.setState({pageUrl, pageName, numberDigit, showCarTypeSelection}, () => {
      this.getAllData();
    });
  }

  componentWillMount() {
      let cityData = JSON.parse(localStorage.getItem("cityData"))
      if(cityData){
          cityData['allcity'] = '全国';
          this.setState({
              allCities: cityData,
          },()=>console.log(this.state.allCities));
      }else {
          city.getAllCities().then(cities => {
              this.setState({
                  allCities: cities,
              });
          });
      }
    this.setState({
      carTypes: carType.getCarTypes(),
    });

    // let result = getCityFun();
    // result.then(res => {
    //   this.setState({
    //       allCities: res.data,
    //   });
    // }).catch(err => {
    //     console.log(err)
    // })
  }

  componentDidMount() {
    this.loadPageData(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.loadPageData(nextProps.location.pathname);
    }
  }

  render() {
    const {selectedCarType, selectedDateType, pageName, carTypes, dateTypes, tableData, tableHeader, pageLoading, selectedBaseDay, showCarTypeSelection} = this.state;

    return (
      <div className="rank">
        <Card bordered={false} className="card-wrap" title={pageName} extra={
          <div>
            {showCarTypeSelection ?
              <Select className="search" value={selectedCarType} onChange={(val) => this.handleCarTypeChange(val)}>
                {
                  Object.keys(carTypes).map((carKey) => {
                    return <Select.Option key={carKey} value={carKey}>{carTypes[carKey]}</Select.Option>
                  })
                }
              </Select>
              : null}

            <Select className="search" value={selectedDateType} onChange={(val) => this.handleDateTypeChange(val)}>
              {
                Object.keys(dateTypes).map((dateKey) => {
                  return <Select.Option key={dateKey} value={dateKey}>{dateTypes[dateKey]}</Select.Option>
                })
              }
            </Select>

            <Button.Group>
              <Button onClick={() => this.handlePageChange(-1)}>
                <Icon type="left"/>前一页
              </Button>
              <Button onClick={() => this.handlePageChange(1)} disabled={selectedBaseDay >= YESTERDAY}>
                后一页<Icon type="right"/>
              </Button>
            </Button.Group>
          </div>
        }>

          <Table dataSource={tableData} columns={tableHeader}
                 pagination={false} loading={pageLoading} bordered
                 size="small" scroll={{x: true}}/>
        </Card>
      </div>
    )
  }
}