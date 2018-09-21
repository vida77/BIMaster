import React, {Component} from 'react';
import {Card, Table, Row, Col, Input, Button, Pagination, Modal, Select, Divider, Tree} from 'antd';
import PropTypes from 'prop-types';
// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux'
import {initData} from '../../store/index/action'
import './systemNotice.less';
import {getFun,post} from '../../utils/api'
const confirm = Modal.confirm;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class RightsManageRole extends Component{
    static propTypes = {
        initData: PropTypes.func
    }
    constructor(props){
        super(props);
        this.state = {
            current: 1,
            pageSize: 1,
            total: 10,
            title: '角色组',
            roleName: '',
            load: false,
            tableData: [],
            tableHeader: [
                {title: '角色组名称', dataIndex: 'name', key: 'name'},
                {title: '功能数', dataIndex: 'permission_count', key: 'permission_count',
                    sorter: (a, b) => a.permission_count - b.permission_count,
                },
                {
                    title: '关联用户数', dataIndex: 'user_count', key: 'user_count',
                    sorter: (a, b) => a.user_count - b.user_count,
                    render: (text, record) => (
                        <span>{record.user_count ? record.user_count : '0'}</span>
                    )
                },
                {title: '添加时间', dataIndex: 'created_at', key: 'created_at',
                    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
                },
                {title: '操作', key: 'action',
                    render: (text, record) => (
                        <span>
                          <a href="javascript:;" onClick={this.editClick.bind(this,text, record)}>编辑</a>
                          <Divider type="vertical" />
                          <a href="javascript:;" onClick={this.detailsClick.bind(this, text, record)}>详情</a>
                        </span>
                    )
                }
            ],
            addVisible: false,
            detailsVisible: false,
            addTitle: '添加角色组',
            treeData:[],
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            searchValue: '',
            dataList: [],
            roleRightsName: '',
            checkFlag: true,
            addOrEdit: true,
            editId: '',
            treeFlag: false,
            userId:0,
            funcModuleArr: [],
            permissions: [],
            isDetails: false
        }
        this.roleRightsNameChange = this.roleRightsNameChange.bind(this);
    }
    componentWillMount(){
        let userid = JSON.parse(localStorage.getItem("userInfo")).id;
        this.setState({
            userId: userid.id
        })
        this.getTableData();
        this.getFunModuleData();
    }
    componentDidMount(){
        this.initTree() //初始化 获取用户列表数据
    }
    componentWillReceiveProps(nextProps) {
        // let initData = nextProps.initDataFun.userInfo;
    }
    // 获取功能模块下拉列表
    getFunModuleData(){
        let result = getFun('/system/auth/permission/all_list');
        result.then(res => {
            this.setState({
                funcModuleArr: res.data
            })
        })
    }
    roleNameChange(event){
        this.setState({
            roleName: event.target.value
        })
    }
    //功能模块下拉框选择
    funcModuleChange(val){
        this.setState({
            permissions: val
        })
    }
    //点击查询按钮
    searchBtn(){
        let params = {
            page: this.state.current,
            name: this.state.roleName,
            permissions: this.state.permissions
        }
        this.getTableData(params)
    }
    //分页
    onChange(current){
        let params = {
            page: current
        }
        this.getTableData(params)
    }
    // 获取用户列表数据
    getTableData(params){
        let _this = this;
        let result = getFun('/system/auth/role/list',params);
        result.then(res => {
            res.data.data.map(item => {
                item.key = item.id;
            })
            _this.setState({
                tableData: res.data.data,
                load: false,
                total: res.data.total,
                current: res.data.current_page,
                pageSize: res.data.per_page
            })
        })
    }
    // 列表-添加
    addBtn(){
        this.setState({
            addVisible: true,
            addOrEdit: true,
            checkFlag: true,
            valVal: '',
            checkedKeys: [],
            treeFlag: false,
            isDetails: false
        })
    }
    // 列表-编辑
    editClick(text, record){
        let params = {
            id: text.id
        }
        let result = getFun('/system/auth/role/info',params);
        result.then(res => {
            let aa = res.data.permissions.join(",");
            this.setState({
                checkedKeys: aa.split(","),
                addVisible: true,
                addOrEdit: false,
                editId: text.id,
                checkFlag: true,
                addTitle: '编辑角色组',
                valVal: text.name,
                treeFlag: false,
                isDetails: false
            })
        })
    }

    // 列表-详情
    detailsClick(text, record){
        let params = {
            id: text.id
        }
        let result = getFun('/system/auth/role/info',params);
        result.then(res => {
            let aa = res.data.permissions.join(",");
            this.setState({
                addVisible: true,
                checkFlag: false,
                addTitle: '角色组详情',
                valVal: res.data.name,
                treeFlag: true,
                checkedKeys: aa.split(","),
                isDetails: true
            })
        })
    }
    // 列表-添加-弹出框确认按钮
    hideModalOk(){
        let params;
        let url;
        if(this.state.isDetails){
            this.setState({
                addVisible: false
            })
        }else {
            if(!this.state.addOrEdit){
                url = '/system/auth/role/edit';
                params = {
                    id: this.state.editId,
                    name: this.state.valVal,
                    permissions: this.state.checkedKeys
                }
            }else{
                url = '/system/auth/role/add';
                params = {
                    name: this.state.valVal,
                    permissions: this.state.checkedKeys
                }
            }
            let result = post(url,params);
            result.then(res => {
                this.getTableData();
                this.setState({
                    addVisible: false
                })
            })
        }

    }
    // 列表-添加-弹出框取消按钮
    hideModalCancel(){
        this.setState({
            addVisible: false
        })
    }
    roleRightsNameChange(event) {
        this.setState({
            // roleRightsName: event.target.value,
            valVal: event.target.value,
        })
    }
    searchTreeChange(e){
        let dataList = this.state.treeData;
        let value = e.target.value;
        let expandedKeys = dataList.map((item) => {
            if (item.name.indexOf(value) > -1) {
                return this.getParentKey(item.id, this.state.treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys: expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }
    addChildObj(data) {
        let childs = data.child;
        data.child = [];
        for (let key in childs) {
            data.child.push(childs[key]);
            if (childs[key].child) {
                this.addChildObj(childs[key]);
            }
        }
    }
    changeArray(data) {
        let newData = [];
        for (let key in data) {
            let obj = data[key];
            newData.push(obj);
            this.addChildObj(obj);
        }
        return newData;
    }
    initTree(){
        let result = getFun('/system/auth/permission/tree');
        result.then(res => {
            this.generateList(this.changeArray(res.data))
            // console.log(this.changeArray(res.data))
            this.setState({
                treeData: this.changeArray(res.data)
            })
        })
    }
    generateList(data){
        let dataList = this.state.dataList;
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.id;
            dataList.push({ key, name: key });
            if (node.child) {
                this.generateList(node.child, node.id);
            }
        }
        this.setState({
            dataList: dataList
        })
    };
    getParentKey(key, tree){
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.child) {
                if (node.child.some(item => item.id === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.child)) {
                    parentKey = this.getParentKey(key, node.child);
                }
            }
        }
        return parentKey;
    };
    onCheck(checkedKeys){
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    onSelect(selectedKeys, info){
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }
    onExpand(expandedKeys){
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.child) {
                return (
                    <TreeNode title={item.name} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.child)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }
    render(){
        const {title, roleName, funcModuleArr, tableData, load, tableHeader, total, addVisible,addTitle,
            expandedKeys, autoExpandParent, checkedKeys, selectedKeys, treeData, searchValue, roleRightsName, checkFlag, treeFlag, funcModule} = this.state;
        const loop = data => data.map((item) => {
            const index = item.name.indexOf(searchValue);
            const beforeStr = item.name.substr(0, index);
            const afterStr = item.name.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : <span>{item.name}</span>;
            if (item.child) {
                return (
                    <TreeNode key={item.id} title={title}>
                        {loop(item.child)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id} title={title} />;
        });
        let optionData = funcModuleArr.map(item => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>
        })
        return(
            <div>
                <div className="notice-wrapper">
                    <Card title={title}  bordered={false}>

                        <div className="search-content">
                            <div className="search-wrapper">
                                <div className="input-wrapper">
                                    <label>角色组名称：</label>
                                    <Input type="text"   onChange={this.roleNameChange.bind(this)}/>
                                </div>
                                <div className="input-wrapper input-select-wrapper">
                                    <label>功能模块：</label>
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择"
                                        showArrow={true}
                                        // value={funcModule}
                                        onChange={this.funcModuleChange.bind(this)}>
                                        {optionData}
                                    </Select>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary" icon='search' style={{marginRight: '20px'}} onClick={this.searchBtn.bind(this)}>查询</Button>
                                <Button type="primary" icon='plus' onClick={this.addBtn.bind(this)}>添加</Button>
                            </div>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <Table  dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col style={{textAlign: 'right'}}>
                                    <Pagination showQuickJumper pageSize={this.state.pageSize} current={this.state.current}  total={total} onChange={this.onChange.bind(this)}/>
                                </Col>
                            </Row>
                        </div>

                    </Card>
                </div>
                <Modal
                    title={addTitle}
                    visible={addVisible}
                    onOk={this.hideModalOk.bind(this)}
                    onCancel={this.hideModalCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                >
                    <div>
                        <Input disabled={!checkFlag} type="text" placeholder="请输入角色组名称" style={{ marginBottom: 16 }} defaultValue={roleRightsName} value={this.state.valVal} onChange={this.roleRightsNameChange} />
                        {
                            checkFlag?(<Search style={{ marginBottom: 8 }} placeholder="请输入权限名称" onChange={this.searchTreeChange.bind(this)} />
                            ):''
                        }
                        <Tree
                            disabled={treeFlag}
                            checkable = {true}
                            defaultExpandAll={true}
                            onCheck={this.onCheck.bind(this)}
                            checkedKeys={checkedKeys}
                            onSelect={this.onSelect.bind(this)}
                            selectedKeys={selectedKeys}
                            onExpand={this.onExpand.bind(this)}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                        >
                            {loop(treeData)}
                        </Tree>
                    </div>
                </Modal>
            </div>
        )
    }

}
export default connect(state => ({
    initDataFun: state.initDataFun,
}), {
    initData,
})(RightsManageRole);