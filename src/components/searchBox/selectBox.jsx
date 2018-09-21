// 优惠券--暂时不用
import React from 'react';
import {Select} from 'antd';
import './searchBox.less';

const Option = Select.Option;

class SelectBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            title: '',
            typeOptionData: ['活动ID','活动名称'],
            flag: false,
            activity: [],
            activityOptionData: ['111','222','333'],
            activityOptionData1: ['111','222','333'],
            activityOptionData2: ['活动A','活动B','活动C']
        };
    }
    componentWillMount() {
        this.setState({
            title: this.props.title,
            typeOptionData: this.props.typeOptionData
        })
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps) {    
    }

    handleTypeChange(value) {
        
        this.setState({
            activity: []
        })
        if(value=='活动ID'){
            this.setState({
                activityOptionData: this.state.activityOptionData1,
                flag:false,
            });
        }else{
            this.setState({
                activityOptionData: this.state.activityOptionData2,
                flag:true,
            });
        }
    }
    handleChange(value){
        let length=value.length
        if(!this.state.flag){//id
            const param = {
                activity: this.state.activityOptionData1.slice(0,length),
            }
            this.setState({
                activity: value
            })
            this.props.searchParams(param)
        }else{//name
            const param = {
                activity: this.state.activityOptionData2.slice(0,length),
            }
            this.setState({
                activity: value
            })
            this.props.searchParams(param)
        }
        
    }
    
    handleSearch(value){

    }
    render() {
        const { typeOptionData, activityOptionData, title} = this.state;
        let activityOption = [];
        Object.keys(activityOptionData).map( (item) => {
            activityOption.push(<Option key={item}>{activityOptionData[item]}</Option>)
        } )

        let typeOptions = typeOptionData.map(item => <Option key={item}>{item}</Option>);

        return (
            <div className="search-box-wrapper">
                <div className="city-select">
                    <label className="cartype-label" style={{float:'left',marginTop:8}}>{title}：</label>
                    <Select 
                        defaultValue={this.state.typeOptionData[0]} 
                        style={{ width: 110 , float:'left'}}
                        onChange={this.handleTypeChange.bind(this)}>
                        {typeOptions}
                    </Select>
                    <Select
                        mode="multiple"
                        placeholder="请选择"
                        showArrow={true}
                        defaultValue={this.state.activity}
                         value={this.state.activity}
                        style={{width: 200, float:'left'}}
                        onSearch={this.handleSearch.bind(this)}
                        filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                        onChange={this.handleChange.bind(this)}>
                        {activityOption}
                    </Select>
                </div>
            </div>
        )
    }
}
export default SelectBox;