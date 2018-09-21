import React, {Component} from 'react';
import {Card, Table, Row, Col, Form, Input, Button, Pagination, Modal, Select, Divider} from 'antd';
import './systemNotice.less';
import {getFun,post} from "../../utils/api";

const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

//添加和编辑
const AddEditForm = Form.create()(

    class extends React.Component {
        parentModuleChange(val){
            this.props.getVal(val)
        }
        render() {
            const { visible, onCancel, onSubmit, form, popTitle, btnFlag,disableFlag} = this.props;
            let {popValues, optionData} = this.props;
            if(btnFlag === 0){
                popValues = {};
            }
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 5 },
                wrapperCol: { span: 19 },
            }
            return (
                <Modal
                    visible={visible}
                    title={popTitle}
                    okText="提交"
                    onCancel={onCancel}
                    onOk={onSubmit}
                >
                    <Form layout="horizontal">
                        <FormItem label="模块" {...formItemLayout}>
                            {getFieldDecorator('path', {
                                rules: [{
                                    // required: true,
                                    // message: '请填写模块'
                                }],
                                initialValue: popValues.path?popValues.path:''
                            })(
                                <Input type="text" disabled={disableFlag}/>
                            )}
                        </FormItem>
                        <FormItem label="模块名称" {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [{
                                    //required: true,
                                    //message: '请填写模块名称'
                                }],
                                initialValue: popValues.name
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                        <FormItem label="父模块" {...formItemLayout}>
                            {getFieldDecorator('parent_name', {
                                initialValue: popValues.parent_name
                            })(
                                <Select onChange={this.parentModuleChange.bind(this)}>
                                    {optionData}
                                </Select>
                            )}
                        </FormItem>
                    </Form>

                </Modal>
            );
        }
    }
);

export default class RightsManageModule extends Component{
    constructor(props){
        super(props);
        this.state = {
            total: 10,
            pageSize: 10,
            current: 1,
            title: '模块列表',
            searchModuleName: '',
            detailModule: '',
            detailModuleName: '',
            detailPModuleName: '',
            detailsVisible: false,
            detailTitle: '模块详情',
            funcModuleData: [],
            load: false,
            tableData: [],
            tableHeader: [
                {title: '模块ID', dataIndex: 'id', key: 'id',},
                {title: '模块', dataIndex: 'path', key: 'path',},
                {title: '模块名', dataIndex: 'name', key: 'name',},
                {title: '父模块', dataIndex: 'parent_name', key: 'parent_name',},
                {title: '添加时间', dataIndex: 'created_at', key: 'created_at',
                    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
                },
                {title: '操作', key: 'action',
                    render: (text, record) => (
                        <span>
                          <a href="javascript:;" onClick={this.deleteClick.bind(this, text, record)}>删除</a>
                          <Divider type="vertical" />
                          <a href="javascript:;" onClick={this.detailsClick.bind(this, text, record)}>详情</a>
                          <Divider type="vertical" />
                          <a href="javascript:;" onClick={this.editModule.bind(this, text, record)}>编辑</a>
                        </span>
                    )
                }
            ],
            visible: false,
            pid: 0,
            id:'',
            popValues:'',
            inputDisable: false
        }
        this.searchNameChange = this.searchNameChange.bind(this);
    }
    componentWillMount(){
    }
    componentDidMount(){
        this.initList()
    }
    getValFun(val) {
        console.log(val)
        this.setState({ pid: val });
    }
    //搜索模块input
    searchNameChange(event){
        this.setState({
            searchModuleName: event.target.value,
        })
    }
    //点击查询按钮
    searchBtn(){
        let params = {
            name: this.state.searchModuleName,
            page: this.state.current_page
        };
        this.setState({
            load: true
        },() => {
            this.initList(params)
        })
    }
    //分页
    onChange(page){
        let params = {
            name: this.state.searchModuleName,
            page: page
        };
        this.setState({
            current: page,
            current_page: page,
            load: true
        },() => {
            this.initList(params)
        })
    }
    //列表-初始化
    initList(params) {
        let result =getFun('/system/auth/permission/list',params);
        result.then(res => {
            res.data.data.map( item => {
                item.key = item.id;
            })
            this.setState({
                load: false,
                tableData: res.data.data,
                total: res.data.total,
                current_page: res.data.current_page,
                pageSize: res.data.per_page
            })
        }).catch(err => {
            console.log(err)
        })
    }
    //下拉框
    parentList(params) {
        let result =getFun('/system/auth/permission/parent_list',params);
        result.then(res => {
            this.setState({
                load: false,
                funcModuleData: res.data,
            })
        }).catch(err => {
            console.log(err)
        })
    }
    //添加公告
    addModule(params, params1) {
        let url = '';
        let param = {};
        if (this.state.btnFlag == 1){
            param = params1;
            url = '/system/auth/permission/edit';
        }else{
            param = params;
            url = '/system/auth/permission/add';
        }
        let result =post(url,param);
        result.then(res => {
            this.initList();
        }).catch(err => {
            console.log(err)
        })
    }
    //点击添加
    addBtn = () => {
        this.setState({ visible: true, popTitle: '添加模块', btnFlag:0,inputDisable: false});
        this.parentList();
    }
    //取消提交和提交
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // console.log(values)
            //add
            let parameter = {
                pid: this.state.pid,
                path: values.path,
                name: values.name,
            };
            //edit
            let parameter1 = {
                id: this.state.id,
                pid: this.state.pid,
                name: values.name,
            };
            //添加/编辑
            this.addModule(parameter, parameter1);
            form.resetFields();
            this.setState({ visible: false });

        });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    //编辑公告
    editModule(text,index) {
        console.log(text)
        this.setState({
            visible: true,
            popTitle: '编辑模块',
            popValues: text,
            btnFlag:1,
            pid: text.pid,
            id: text.id,
            inputDisable: true
        });
        this.parentList({id:text.id});
    }
    // 列表-删除
    deleteClick(text, record){
        let _this = this;
        confirm({
            title: '你确定要删除此模块吗？',
            content: '确认删除后该模块将不能恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                let params = {
                    id: text.id
                };
                let result =post('/system/auth/permission/del',params);
                result.then(res => {
                    _this.initList();
                    if(res.code ==1){
                        confirm({
                            content: res.message,
                            okText: '确认',
                            cancelText: '取消',
                            onOk() {

                            },
                            onCancel() {
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            onCancel() {
            }
        })
    }
    // 列表-详情
    detailsClick(text, record){
        console.log(text)
        this.setState({
            detailVisible: true,
            detailModule: text.path,
            detailModuleName: text.name,
            detailPModuleName: text.parent_name,
        })
    }
    // 列表-详情-弹出框确认按钮
    hideModalOk2(){
        this.setState({
            detailVisible: false
        })
    }
    // 列表-详情-弹出框取消按钮
    hideModalCancel2(){
        this.setState({
            detailVisible: false
        })
    }
    render(){
        const {searchModuleName, title, funcModuleData, tableData, load, tableHeader, pageSize, current, total,
            detailTitle, detailVisible, detailModule, detailModuleName, detailPModuleName} = this.state;
        let optionData = funcModuleData.map(item => <Option key={item.id} >{item.name}</Option>)
        return(
            <div>
                <div className="notice-wrapper">
                    <Card title={title}  bordered={false}>

                        <div className="search-content">
                            <div className="search-wrapper">
                                <div className="input-wrapper">
                                    <label>查询内容：</label>
                                    <Input type="text" placeholder="" defaultValue={searchModuleName} onChange={this.searchNameChange}/>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary" icon='search' style={{marginRight: '20px'}} onClick={this.searchBtn.bind(this)}>查询</Button>
                                <Button type="primary" icon='plus' onClick={this.addBtn.bind(this)}>添加</Button>
                            </div>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <Table onChange={this.handleChange} dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col style={{textAlign: 'right'}}>
                                    <Pagination showQuickJumper current={current} total={total} onChange={this.onChange.bind(this)} pageSize={pageSize}/>
                                </Col>
                            </Row>
                        </div>

                    </Card>
                </div>
                <AddEditForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onSubmit={this.handleSubmit}
                    popTitle={this.state.popTitle}
                    popValues={this.state.popValues}
                    btnFlag={this.state.btnFlag}
                    optionData={optionData}
                    disableFlag={this.state.inputDisable}
                    getVal={val=>this.getValFun(val)}
                />
                <Modal
                    className="details-modal"
                    title={detailTitle}
                    visible={detailVisible}
                    onOk={this.hideModalOk2.bind(this)}
                    onCancel={this.hideModalCancel2.bind(this)}
                    okText="关闭"
                >
                    <Form layout="horizontal">
                        <div className="notice-wrapper">
                            <p><span className="detail-title">模块：</span><span className="detail-title-txt">{detailModule}</span></p >
                            <p><span className="detail-title">模块名：</span><span className="detail-title-txt">{detailModuleName}</span></p >
                            <p><span className="detail-title">父模块：</span><span className="detail-title-txt">{detailPModuleName}</span></p >
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}