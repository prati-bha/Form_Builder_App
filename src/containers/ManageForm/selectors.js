import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectFormStore = state => state.form || initialState;
const makeSelectFormStore = () =>
  createSelector(
    selectFormStore,
    substate => substate,
  );

  export default makeSelectFormStore;
