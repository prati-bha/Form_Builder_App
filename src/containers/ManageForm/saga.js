// import { take, call, put, select } from 'redux-saga/effects';

import { select, takeLatest } from '@redux-saga/core/effects';
import makeSelectSampleForm from './selectors';
import { SUBMIT_DATA } from './constants';

export function* submitData() {
  yield select(makeSelectSampleForm());
}

export default function* sampleFormSaga() {
  yield takeLatest(SUBMIT_DATA, submitData);
}
