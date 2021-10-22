import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Card, Button, Modal, Input, Select } from 'antd';
import { compose } from 'redux';
import { cloneDeep } from 'lodash';
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
    const { formStore, updateField } = this.props;
    const { questions } = this.state;
    this.setState({
      questions: [...questions, { ...formStore }]
    }, () => {
      const objectKeys = Object.keys(initialState);
      console.log(objectKeys)
      objectKeys.forEach((key) => updateField(key, initialState[key]));
      console.log("form", formStore)
      this.toggleAddQuestionModal();
    });
  }

  handleEachOptionChange = (index, e) => {
    const { formStore: { options }, updateField } = this.props;
    const currentOptions = cloneDeep(options);
    if (e) {
      currentOptions[index].value = e.target.value;
    } else {
      currentOptions.push({ value: '' })
    }
    updateField("options", currentOptions);
  }

  renderOptionUI = () => {
    const { formStore: { options } } = this.props;
    return options.map((eachOption, index) => <Input placeholder={`Enter Option ${index}`} key={index} onChange={(e) => this.handleEachOptionChange(index, e)} />)
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
      return <Button onClick={() => this.handleEachOptionChange()}>Add Option</Button>
    }
  }
  renderAddQuestionModal = () => {
    const { isAddQuestionModalOpen, questionId } = this.state;
    const { updateField } = this.props;
    return (
      <Modal title={`${!questionId ? 'Add' : 'Edit'} New Question`} visible={isAddQuestionModalOpen} onCancel={this.toggleAddQuestionModal} onOk={this.handleAddQuestionSubmit}>
        <Input onChange={e => updateField(e.target.name, e.target.value)} placeholder="Question Title" name="questionTitle"/>
        <Select style={{ width: '100%' }} onChange={e => { updateField('questionType', e) }} placeholder="Question Type">
          {QUESTION_TYPES.map((singleOption) => <Option key={singleOption.key} value={singleOption.value}>{singleOption.value}</Option>)}
        </Select>
        {this.getOptions()}
        {this.addOption()}
      </Modal>
    )
  }
  toggleAddQuestionModal = () => {
    const { isAddQuestionModalOpen } = this.state;
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
  renderSingleQuestion = (questionData) => {
    console.log("qD", questionData)
    return <p>{questionData.questionTitle}</p>;
  }
  renderQuestions = () => {
    const { questions } = this.state;
    return (
      <div>{questions.map((eachQuestion) => this.renderSingleQuestion(eachQuestion))}</div>
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
