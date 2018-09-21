import React from 'react';
import { Pagination} from 'antd';

class PaginationCom extends React.Component{
    constructor(props){
        super(props);
        this.state={
            current: 0,
            total: 0,
            pageSize: 10
        }
    }
    componentDidMount(){
        this.setState({
            total: this.props.totalNum
        })
        console.log(this.props.totalNum)
    }
    handlePage(val) {
        this.setState({
            current: val
        })
        this.props.pageChange(val)
    }
    onShowSizeChange(current, size) {
        this.setState({
            pageSize: size,
            current: current
        });
    }
    render(){
        return(
            <div className="pagination-wrapper">
                <Pagination pageSize={this.state.pageSize} size="small" total={this.state.total}  showQuickJumper
                 onChange={this.handlePage.bind(this)} showSizeChanger={true} onShowSizeChange={this.onShowSizeChange.bind(this)} showQuickJumper
                />
            </div>
        )
    }
}
export default PaginationCom;