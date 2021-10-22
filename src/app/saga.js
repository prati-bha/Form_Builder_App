
import { fork, all } from 'redux-saga/effects';
import formSaga from '../containers/ManageForm/saga';
export default function* rootSaga () {
    yield all[
        fork(formSaga)
    ];
}