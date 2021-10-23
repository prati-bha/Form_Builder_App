import { select, takeLatest, put } from '@redux-saga/core/effects';
import makeSelectFormStore from './selectors';
import { SUBMIT_DATA, UPDATE_FIELD } from './constants';
import { FORMS_STORAGE_KEY } from '../constants';
import { uniqueId } from 'lodash';

export function* submitData() {
  const currentForms = localStorage.getItem(FORMS_STORAGE_KEY);
  const parsedForm = JSON.parse(currentForms);
  const formStore = yield select(makeSelectFormStore());
  const formObject = {
    uniqueFormSlug: uniqueId('form'),
    formName: formStore.formName,
    questions: formStore.questions,
  }
  if (parsedForm && parsedForm.length > 0) {
    const updatedForm = [...parsedForm, formObject];
    const arrayStringified = JSON.stringify(updatedForm);
    localStorage.setItem(FORMS_STORAGE_KEY, arrayStringified)
  } else {
    const formArray = [formObject];
    const arrayStringified = JSON.stringify(formArray);
    localStorage.setItem(FORMS_STORAGE_KEY, arrayStringified);
  }
  yield put({ type: UPDATE_FIELD, payload: [], key: 'questions' });
  yield put({ type: UPDATE_FIELD, payload: '', key: 'formName' });
  yield put({ type: UPDATE_FIELD, payload: [], key: 'questions' });
}

export default function* sampleFormSaga() {
  yield takeLatest(SUBMIT_DATA, submitData);
}
