import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Card, Button, Modal, Input, Select } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { compose } from 'redux';
import { cloneDeep } from 'lodash';
import './ManageForms.css';
import { QUESTION_TYPES } from './constants';
import * as actions from './actions';
import makeSelectFormStore from './selectors';
import { initialState } from './reducer';

const { Option } = Select;

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddQuestionModalOpen: false,
      questionId: '',
      questions: [],
    }
  }

  handleAddQuestionSubmit = () => {
    const { formStore } = this.props;
    const { questions } = this.state;
    this.setState({
      questions: [...questions, { ...formStore }]
    }, () => {
      this.toggleAddQuestionModal();
    });
  }

  handleEachOptionChange = (index, e, actionType) => {
    const { formStore: { options }, updateField } = this.props;
    const currentOptions = cloneDeep(options);
    if (actionType === 'delete') {
      currentOptions.splice(index, 1);
    } else {
      if (e) {
        currentOptions[index].value = e.target.value;
      } else {
        currentOptions.push({ value: '' })
      }
    }
    updateField("options", currentOptions);
  }

  renderOptionUI = () => {
    const { formStore: { options } } = this.props;
    return options.map((eachOption, index) => {
      return (<div key={index} className="optionContainer">
        <Input placeholder={`Enter Option ${index + 1}`} onChange={(e) => this.handleEachOptionChange(index, e)} />
        {options.length > 1 && index > 0 && <DeleteFilled title="delete option" onClick={() => this.handleEachOptionChange(index, '', 'delete')} />}
      </div>)
    })
  }

  getOptions = () => {
    const { formStore: { questionType, options }, updateField } = this.props;
    if (questionType === QUESTION_TYPES[1].value || questionType === QUESTION_TYPES[2].value) {
      if (options && options.length > 0) {
        return this.renderOptionUI();
      } else {
        updateField("options", [{ value: '' }]);
      }
    }
  }
  addOption = () => {
    const { formStore: { questionType } } = this.props;
    if (questionType && questionType.length > 0 && questionType !== QUESTION_TYPES[0].value) {
      return <Button onClick={() => this.handleEachOptionChange()} className="addButton">Add Option</Button>
    }
  }
  getAddQuestionDisabledCondition = () => {
    const { formStore: { questionType, questionTitle, options } } = this.props;
    if (questionType.length === 0 || questionTitle.length === 0) {
      return true
    }
    if (questionType === QUESTION_TYPES[1].value || questionType === QUESTION_TYPES[2].value) {
      if (options.length === 0) {
        return true;
      } else {
        const emptyOptions = options.filter((option) => option.value.length === 0);
        if (emptyOptions.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  handleOptionChange = (e) => {
    const { updateField } = this.props;
    if(e === QUESTION_TYPES[0].value) {
      updateField('options', []);
    }
    updateField('questionType', e);
  }
  renderAddQuestionModal = () => {
    const { isAddQuestionModalOpen, questionId } = this.state;
    const { updateField, formStore } = this.props;
    return (
      <Modal title={`${!questionId ? 'Add' : 'Edit'} New Question`} visible={isAddQuestionModalOpen} onCancel={this.toggleAddQuestionModal} onOk={this.handleAddQuestionSubmit} okButtonProps={{ disabled: this.getAddQuestionDisabledCondition() }}>
        <div className="addQuestionModalContainer">
          <Input value={formStore['questionTitle']} onChange={e => updateField(e.target.name, e.target.value)} placeholder="Question Title" name="questionTitle" />
          <Select style={{ width: '100%' }} onChange={e => this.handleOptionChange(e)} placeholder="Question Type" value={formStore['questionType'] || undefined}>
            {QUESTION_TYPES.map((singleOption) => <Option key={singleOption.key} value={singleOption.value}>{singleOption.value}</Option>)}
          </Select>
          {this.getOptions()}
          {this.addOption()}
        </div>
      </Modal>
    )
  }
  toggleAddQuestionModal = () => {
    const { isAddQuestionModalOpen } = this.state;
    const { updateField } = this.props;
    const objectKeys = Object.keys(initialState);
    objectKeys.forEach((key) => { updateField(key, initialState[key]) });
    this.setState({
      isAddQuestionModalOpen: !isAddQuestionModalOpen,
    })
  }
  renderAddQuestionButton = () => {
    return (
      <Button type="primary" onClick={() => this.toggleAddQuestionModal()}>
        Add Question
      </Button>
    )
  }
  renderSingleQuestion = (questionData, index) => {
    return <p key={index}>{questionData.questionTitle}</p>;
  }
  renderQuestions = () => {
    const { questions } = this.state;
    return (
      <div>{questions.map((eachQuestion, index) => this.renderSingleQuestion(eachQuestion, index))}</div>
    )
  }
  render() {
    return (
      <Card title={"this.props.formTitle"} extra={this.renderAddQuestionButton()} >
        {this.renderQuestions()}
        {this.renderAddQuestionModal()}
      </Card>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  formStore: makeSelectFormStore(),
});

function mapDispatchToProps(dispatch) {
  return {
    updateField: (key, value) => dispatch(actions.updateField(key, value)),
    submitData: () => dispatch(actions.submitData()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(index);
