import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Card, Button, Modal, Result, Input, Select, Radio, Space, Checkbox } from 'antd';
import { DeleteFilled, PlusCircleOutlined } from '@ant-design/icons';
import { compose } from 'redux';
import { cloneDeep, isEqual } from 'lodash';
import './ManageForms.css';
import { EMPTY_VIEW_MESSAGE, NEW_QUESTION_KEYS, QUESTION_TYPES } from './constants';
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
    }
  }


  componentDidUpdate(props) {
    if (!isEqual(props.formStore.questions, this.props.formStore.questions)) {
      this.forceUpdate();
    }
  }

  handleAddQuestionSubmit = () => {
    const { formStore, updateField } = this.props;
    const currentQuestions = cloneDeep(formStore.questions);
    let newQuestion = {}
    Object.entries(formStore).forEach((key) => {
      if (NEW_QUESTION_KEYS.some((allowedKey) => allowedKey === key[0])) {
        newQuestion[key[0]] = key[1];
      }
    });
    const updatedQuestions = [...currentQuestions, { ...newQuestion }];
    updateField("questions", cloneDeep([...updatedQuestions]));
    this.toggleAddQuestionModal();
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
    if (e === QUESTION_TYPES[0].value) {
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
    Object.entries(initialState).forEach((key) => {
      if (NEW_QUESTION_KEYS.some((allowedKey) => allowedKey === key[0])) {
        updateField(key[0], initialState[key[0]])
      }
    });
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

  renderQuestionUI = (questionData, index) => {
    switch (questionData.questionType) {
      case QUESTION_TYPES[0].value:
        return <Input placeholder="Text" disabled />
      case QUESTION_TYPES[2].value:
        return (
          <Radio.Group>
            <Space direction="vertical">
              {questionData.options.map((option) =>
                <Radio
                  key={option.value}
                  value={option.value}
                  disabled
                >
                  {option.value}
                </Radio>
              )}
            </Space>
          </Radio.Group>
        )
      case QUESTION_TYPES[1].value:
        return (
          <Checkbox.Group>
            <Space direction="vertical">
              {questionData.options.map((option) =>
                <Checkbox
                  key={option.value}
                  value={option.value}
                  disabled
                >
                  {option.value}
                </Checkbox>
              )}
            </Space>
          </Checkbox.Group>
        )
      default:
        return
    }
  }

  handleDeleteQuestion = (index) => {
    const { formStore: { questions }, updateField } = this.props;
    const currentQuestions = cloneDeep(questions);
    currentQuestions.splice(index, 1);
    updateField("questions", currentQuestions);
  }

  renderDeleteQuestion = (index) => <Button onClick={() => this.handleDeleteQuestion(index)}><DeleteFilled /></Button>;

  renderSingleQuestion = (questionData, index) => {
    return (<Card
      style={{ marginTop: 16 }}
      type="inner"
      title={questionData.questionTitle}
      key={`card_${index}`}
      extra={this.renderDeleteQuestion(index)}
    >
      {this.renderQuestionUI(questionData, index)}
    </Card>)
  }

  renderQuestions = () => {
    const { formStore: { questions } } = this.props;
    return (
      <div>
        {questions.map((eachQuestion, index) => this.renderSingleQuestion(eachQuestion, index))}
      </div>
    )
  }

  handleFormCancel = () => {
    const { updateField } = this.props;
    Object.entries(initialState).forEach((key) => {
      updateField(key[0], initialState[key[0]])
    });
  }

  handleFormSubmit = () => {
    const { submitData } = this.props;
    submitData();
  }

  renderSubmitPanel = () => {
    return (
      <div className="submitPanelContainer">
        <Button onClick={this.handleFormCancel}>Cancel</Button>
        <Button onClick={this.handleFormSubmit}>Submit</Button>
      </div>
    )
  }

  renderEmptyPanel = () => {
    return (
      <div className="noChats ">
        <Result icon={<PlusCircleOutlined />} title={EMPTY_VIEW_MESSAGE} />
      </div>
    )
  }
  render() {
    const { formStore: { questions, formName } } = this.props;
    return (
      <div className="mainCardContainer">
        <Card title={formName} bordered={true} extra={this.renderAddQuestionButton()} actions={[questions.length > 0 && this.renderSubmitPanel()]}>
          {this.renderQuestions()}
          {this.renderAddQuestionModal()}
          {!questions.length > 0 && this.renderEmptyPanel()}
        </Card>
      </div>
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
