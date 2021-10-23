import React, { Component } from 'react';
import { Table, Card, Modal, Input, Button } from "antd";
import { withRouter } from 'react-router-dom';
import './List.css';
import { FORMS_STORAGE_KEY, ROUTES } from '../constants';
import { TABLE_COLUMNS } from './constants';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            forms: [],
            isAddFormModalOpen: false,
            formName: '',
        }
    }
    componentDidMount() {
        this.setState({
            loading: true,
        })
        setTimeout(() => {
            const currentForms = localStorage.getItem(FORMS_STORAGE_KEY);
            const parsedForm = JSON.parse(currentForms);
            if (parsedForm && parsedForm.length > 0) {
                this.setState({
                    forms: parsedForm,
                });
            }
            this.setState({
                forms: parsedForm,
                loading: false,
            });
        }, 5000);
    }

    toggleAddFormModal = () => {
        const { isAddFormModalOpen } = this.state;
        this.setState({
            isAddFormModalOpen: !isAddFormModalOpen,
            formName: '',
        })
    }

    handleNewForm = () => {
        this.props.history.push({
            pathname: ROUTES.NEW_FORM,
            state: {
                formName: this.state.formName
            },
        });
        this.toggleAddFormModal();
    }

    renderNewFormModal = () => {
        const { isAddFormModalOpen, formName, loading } = this.state;
        return (
            <>
                <Button type="primary" disabled={loading} onClick={this.toggleAddFormModal}>Add Form</Button>
                <Modal title={`Add New Form`} visible={isAddFormModalOpen} onCancel={this.toggleAddFormModal} onOk={this.handleNewForm} okButtonProps={{ disabled: formName.length === 0 }}>
                    <div className="addFormModalContainer">
                        Form Name : <Input value={formName} onChange={e => this.setState({ formName: e.target.value })} placeholder="Form Name" />
                    </div>
                </Modal>
            </>
        )
    }
    render() {
        const { forms, loading } = this.state;
        return (
            <div className="listContainer">
                <Card
                    style={{ marginTop: 16 }}
                    title="Form Builder"
                    extra={this.renderNewFormModal()}
                >
                    <Table
                        loading={loading}
                        dataSource={forms}
                        columns={TABLE_COLUMNS}
                        pagination={false}
                    />
                </Card>
            </div>
        );
    }
}

export default withRouter(index);