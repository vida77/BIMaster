import React from 'react';
import { Button, Icon} from 'antd';
import moment from 'moment';
import ExportFile from '../../utils/exportFile';
import {getFun} from "../../utils/api";
import {objectToArr} from "../../utils/dataHandle";

class ExportFileCom extends React.Component{
    constructor(props){
        super(props);
        this.state={
            exporting: false,
            params: {},
            tableData: []
        }
    }
    componentWillReceiveProps(){
         this.setState({
             params: this.props.params
         })
    }
     exportClick() {
         this.setState({
             params: this.props.params,
             tableData: this.props.exportData
         }, () => this.exportData())
         this.setState({
             exporting: true
         })

     }
     exportData(exportData){
         const {params } = this.state;
         let _exportData =params.exportData;
         _exportData.map( item => {
             delete item.key;
         })
         let start = params.start_at;
         let end = params.end_at;
         let now = this.formatDate(new Date());
         let title = '';
         if(params.title.includes('_')){
             title = params.title + '_' + now;
         }else {
             title = "运营日报_" + params.title + '_' + start + '_' + end + '_' + now;
         }
         ExportFile.exportJson2CSV(_exportData, title, params.tableHeader);
         this.setState({
             exporting: false
         })
     }
    // 时间格式转化
    formatDate (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };
    render(){
        const {exporting} = this.state;
        return(
            <div className="export-wrapper">
                <Button type="primary"  size='small'  onClick={() => this.exportClick()}>
                    <Icon type={exporting ? 'loading': 'export'} />导出
                </Button>
            </div>
        )
    }
}
export default ExportFileCom;