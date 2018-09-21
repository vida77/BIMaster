import React, {Component} from 'react';
import {Card, Table, Row, Col, Input, Form, Button, Pagination, Badge, Modal} from 'antd';


import {getFun} from '../../utils/api'

import './systemNotice.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;
//添加和编辑
const AddEditForm = Form.create()(

    class extends React.Component {

        render() {
            const { noticeCreator, visible, onCancel, onSubmit, form, popTitle, btnFlag } = this.props;
            let {popValues} = this.props;
            if(btnFlag === 0){
                // popValues = {};
            }
            const { TextArea } = Input;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 5 },
                wrapperCol: { span: 19 },
            }
            const validFunction = (rule, value, callback) => {
                if(value){
                    if (value.length > 20) {
                        callback('标题长度不超过20个字'); // 校验未通过
                    }
                }

                callback(); // 校验通过
            }
            const validFunction2 = (rule, value, callback) => {
                if(value){
                    if (value.length > 40) {
                        callback('概要长度不超过40个字'); // 校验未通过
                    }
                }

                callback(); // 校验通过
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
                        <FormItem label="公告标题" {...formItemLayout}>
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    //max:20,
                                    message: '请填写公告标题'
                                },{
                                    validator: validFunction
                                }],
                                initialValue: popValues.title?popValues.title:''
                            })(
                                <Input type="text" />
                            )}
                        </FormItem>
                        <FormItem label="公告概要" {...formItemLayout}>
                            {getFieldDecorator('desc', {
                                rules: [{
                                    required: true,
                                    // max:40,
                                    message: '请填写公告概要'
                                },{
                                    validator: validFunction2
                                }],
                                initialValue: popValues.describe
                            })(
                                <TextArea rows={2}/>
                            )}
                        </FormItem>
                        <FormItem label="公告内容" {...formItemLayout}>
                            {getFieldDecorator('detail', {
                                rules: [{
                                    required: true,
                                    message: '请填写公告内容'
                                }],
                                initialValue: popValues.detail
                            })(
                                <TextArea rows={4}/>
                            )}
                        </FormItem>
                        <FormItem label="创建人" {...formItemLayout}>
                            {popValues.create_name?popValues.create_name:noticeCreator}
                        </FormItem>
                    </Form>

                </Modal>
            );
        }
    }
);
export default class SystemNotice extends Component {
    constructor(props) {
        super(props);
        this.state={
            title: '系统公告',
            total: 100,
            pageSize: 5,
            current: 1,
            current_page: 1,
            load: true,
            sortedInfo: null,
            tableData: [],
            userId: 3,
            inputTitle:'',
            inputCreator:'',
            visible: false,
            visibleDetail: false,
            btnFlag: '',
            popTitle: '',
            popValues: '',
            confirmLoading: false,
            noticeCreator: '哆啦B梦',
            noticeCreatorId: 11,
            titleDetail: '',
            describeDetail: '',
            detailDetail: '',
            createNameDetail: '',
            editId: ''
        };
        this.inputTitleChange = this.inputTitleChange.bind(this);
        this.inputCreatorChange = this.inputCreatorChange.bind(this);
    }
    componentWillMount() {
        let userName = JSON.parse(localStorage.getItem("userInfo"));
        if(userName){
            let name = userName.name
            this.setState({
                noticeCreator: name,
                userId: userName.id
            })
        }
    }
    componentDidMount(){
        this.getTableData();
    }
    // 排序
    handleSortChange = (pagination, sorter) => {
        console.log('排序', pagination, sorter);
        this.setState({
            sortedInfo: sorter,
        });
    }
    //点击查询
    // 查询
    searchBtn() {
        let params = {
            title: this.state.inputTitle,
            create_name: this.state.inputCreator,
            page: this.state.current_page
        };
        this.setState({
            load: true
        },() => {
            this.getTableData(params)
        })
    }
    //查询参数
    inputTitleChange(event) {
        this.setState({
            inputTitle:event.target.value,
        })
    }
    inputCreatorChange(event) {
        this.setState({
            inputCreator:event.target.value,
        })
    }
    // 获取当前页数
    onChange(page) {
        let params = {
            title: this.state.inputTitle,
            create_name: this.state.inputCreator,
            page: page
        };
        this.setState({
            current: page,
            current_page: page,
            load: true
        },() => {
            this.getTableData(params)
        })
    }
    // 获取表格数据
    getTableData(params) {
        let result =getFun('/system/informs/list',params);
        result.then(res => {
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
    //停用
    switchFun(txt,idx) {
        const {tableData} = this.state;
        const _this = this;
        // console.log(idx,txt)
        let params = {
            id: txt.id,
            // create_id: txt.create_id
        };
        if(txt.status){
            confirm({
                title:'你确定要停用此公告吗？',
                content:'确认停用后该公告将不再显示。',
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    let result =getFun('/system/informs/stop',params);
                    result.then(res => {
                        if(res.data[0]){
                            let tableData2 = tableData;
                            tableData2.map(item=>{
                                if(item.id === txt.id){
                                    item.status =!item.status;
                                }
                            })
                            _this.setState({
                                tableData:tableData2
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })

                },
                onCancel(){

                }
            })
        }

    }
    //添加公告
    addNotice(params, params1) {
        let url = '';
        let param = {};
        if (this.state.btnFlag === 1){
            param = params1;
            url = '/system/informs/edit';
        }else{
            param = params;
            url = '/system/informs/add';
        }
        let result =getFun(url,param);
        result.then(res => {
            this.getTableData();
        }).catch(err => {
            console.log(err)
        })
    }
    //点击添加
    addBtn = () => {
        this.setState({ visible: true, popTitle: '添加公告', btnFlag:0, popValues: ''});
    }
    //取消提交和提交
    handleCancel = (e) => {
        this.setState({ visible: false });
        e.preventDefault();
        const form = this.formRef.props.form;
        form.resetFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let parameter = {
                title: values.title,
                desc: values.desc,
                detail: values.detail
            };
            let parameter1 = {
                id: this.state.editId,
                title: values.title,
                desc: values.desc,
                detail: values.detail
            };
            //添加/编辑
            this.addNotice(parameter, parameter1);
            form.resetFields();
            this.setState({ visible: false });

        });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    //编辑公告
    noticeEdit(text,index) {
        this.setState({ visible: true, popTitle: '编辑公告', popValues: text, btnFlag:1, editId: text.id});
    }
    //公告详情
    noticeDetail(text,index) {
        this.setState({ visibleDetail: true, titleDetail: text.title, describeDetail: text.describe, detailDetail: text.detail, createNameDetail: text.create_name });

    }
    handleOk = () => {
        this.setState({ visibleDetail: false });
    }
    render() {
        let {title, load, total, pageSize, current} = this.state;
        let tableHeader = [
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: 280
            }, {
                title: '概要',
                dataIndex: 'describe',
                key: 'describe',
                className: 'describe'
            }, {
                title: '创建人',
                dataIndex: 'create_name',
                key: 'create_name',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, index) => <span><Badge status={record.status? "success":"error"} />{record.status?"显示":"停用"}</span>
            }, {
                title: '添加时间',
                dataIndex: 'created_at',
                key: 'created_at',
                sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
                // sortOrder: this.sortedInfo.columnKey === 'addDate' && this.sortedInfo.order,
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                        <span className={record.create_id === this.state.userId ? "stop-show": "stop-hide"}><a href="javascript:;" className={record.status?"stop":"stopped"} onClick={() => this.switchFun(text,index)} >{text.status?"停用":"已停用"}</a>
                        <span className="ant-divider" /></span>
                        <a onClick={() => this.noticeDetail(text,index)} href="javascript:;" >详情</a>
                        <span className={record.status && record.create_id === this.state.userId ? "ant-divider" : ""}/>
                        <a onClick={() => this.noticeEdit(text,index)} href="javascript:;">{record.status && record.create_id === this.state.userId ? "编辑" : ""}</a>
                </span>
                ),
            }]
        let tableData = this.state.tableData;
        tableData.map( item => {
            item.key = item.id;
        })
        return (
            <div>
                <div className="notice-wrapper">
                    <Card title={title}  bordered={false}>
                        <div className="search-content">
                            <div className="search-wrapper">
                                <div className="input-wrapper">
                                    <label>查询内容：</label>
                                    <Input type="text" placeholder="" defaultValue={this.state.inputTitle} onChange={this.inputTitleChange}/>
                                </div>
                                <div className="input-wrapper">
                                    <label>创建人：</label>
                                    <Input type="text" placeholder="" defaultValue={this.state.inputCreator} onChange={this.inputCreatorChange}/>
                                </div>
                            </div>
                            <div className="search-btn-wrapper">
                                <Button type="primary" icon='search' style={{marginRight: '20px'}} onClick={this.searchBtn.bind(this)}>查询</Button>

                            </div>
                        </div>
                        <div className="search-content" style={{marginTop: '10px'}}>
                            <Button type="primary" icon='plus' onClick={this.addBtn.bind(this)}>添加</Button>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <Table onChange={this.handleSortChange} dataSource={tableData} bordered loading={load} columns={tableHeader} pagination={false}>

                            </Table>
                        </div>
                        <div className="page-footer">
                            <Row>
                                <Col style={{textAlign: 'right'}}>
                                    <Pagination current={current} total={total} onChange={this.onChange.bind(this)} pageSize={pageSize}  showQuickJumper></Pagination>
                                    {/*<Pagination total={total} pageSize={pageSize} onChange={this.pageChange.bind(this)} showSizeChanger={true} onShowSizeChange={this.onShowSizeChange.bind(this)} showQuickJumper size="small" ></Pagination>*/}
                                </Col>
                            </Row>
                        </div>
                        <AddEditForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onSubmit={this.handleSubmit}
                            noticeCreator={this.state.noticeCreator}
                            popTitle={this.state.popTitle}
                            popValues={this.state.popValues}
                            btnFlag={this.state.btnFlag}
                        />
                        <Modal
                            className="details-modal"
                            title="公告详情"
                            visible={this.state.visibleDetail}
                            onOk={this.handleOk.bind(this)}
                            onCancel={this.handleOk.bind(this)}
                            bodyStyle={{height: 200}}
                            okText="关闭"
                        >
                            <div className="notice-wrapper">
                                <p><span className="detail-title">标题：</span><span className="detail-title-txt">{this.state.titleDetail}</span></p >
                                <p><span className="detail-title">通告概要：</span><span className="detail-title-txt">{this.state.describeDetail}</span></p >
                                <p><span className="detail-title">通告内容：</span><span className="detail-title-txt">{this.state.detailDetail}</span></p >
                                <p><span className="detail-title">创建人：</span><span className="detail-title-txt">{this.state.createNameDetail}</span></p >
                            </div>
                        </Modal>
                    </Card>
                </div>
            </div>
        )
    }
}