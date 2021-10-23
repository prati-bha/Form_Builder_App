import { select, takeLatest, put } from '@redux-saga/core/effects';
import makeSelectFormStore from './selectors';
import { SUBMIT_DATA, UPDATE_FIELD } from './constants';
import { FORMS_STORAGE_KEY, ROUTES } from '../constants';
import history from '../../utils/history';
import moment from 'moment';

export function* submitData() {
  const currentForms = localStorage.getItem(FORMS_STORAGE_KEY);
  const parsedForm = JSON.parse(currentForms);
  const formStore = yield select(makeSelectFormStore());
  const formObject = {
    formName: formStore.formName,
    questions: formStore.questions,
    createdAt: new Date(),
  }
  if (parsedForm && parsedForm.length > 0) {
    let updatedForm;
    if (!(formStore.uniqueFormSlug && formStore.uniqueFormSlug.length > 0)) {
      formObject.uniqueFormSlug = `form_${moment().valueOf()}`;
      updatedForm = [...parsedForm, formObject];
    } else {
      const otherForms = parsedForm.filter((eachForm) => eachForm.uniqueFormSlug !== formStore.uniqueFormSlug);
      formObject.uniqueFormSlug = formStore.uniqueFormSlug;
      updatedForm = [...otherForms, formObject];
    }
    const arrayStringified = JSON.stringify(updatedForm);
    localStorage.setItem(FORMS_STORAGE_KEY, arrayStringified);
  } else {
    formObject.uniqueFormSlug = `form_${moment().valueOf()}`;
    const formArray = [formObject];
    const arrayStringified = JSON.stringify(formArray);
    localStorage.setItem(FORMS_STORAGE_KEY, arrayStringified);
  }
  yield put({ type: UPDATE_FIELD, payload: [], key: 'questions' });
  yield put({ type: UPDATE_FIELD, payload: '', key: 'formName' });
  yield put({ type: UPDATE_FIELD, payload: [], key: 'questions' });
  history.push(ROUTES.HOME);
}

export default function* sampleFormSaga() {
  yield takeLatest(SUBMIT_DATA, submitData);
}
